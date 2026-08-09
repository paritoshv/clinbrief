/**
 * A GPU stable-fluids solver (Stam 1999) tuned to behave like a suminagashi basin:
 * ink floats on the surface, spreads slowly, and marbles into feathered whorls
 * instead of dissipating like smoke.
 *
 * Two departures from the usual WebGL fluid demo, both deliberate:
 *   1. Dye is stored premultiplied (rgb = colour * concentration, a = concentration)
 *      so that ink thins toward the paper tone as it spreads rather than toward black.
 *   2. The display pass composites SUBTRACTIVELY over paper white. Ink darkens the
 *      water. Nothing glows.
 */

export type Vec3 = [number, number, number];

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap(): void;
}

const BASE_VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const CLEAR = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float value;
void main () {
  fragColor = value * texture(uTexture, vUv);
}`;

const SPLAT = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec4 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  float falloff = exp(-dot(p, p) / radius);
  fragColor = texture(uTarget, vUv) + falloff * color;
}`;

const ADVECTION = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`;

const DIVERGENCE = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const CURL = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

/** Vorticity confinement. This is what turns diffuse clouds into suminagashi whorls. */
const VORTICITY = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`;

const PRESSURE = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT = `#version 300 es
precision mediump float;
precision mediump sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

/**
 * Ink over water. Concentration drives how far the paper tone is pushed toward
 * the dye's own hue; a faint grain keeps the surface from reading as vector art.
 */
const DISPLAY = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDye;
uniform vec3 uPaper;
uniform float uGrain;

float hash (vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main () {
  vec4 d = texture(uDye, vUv);
  float a = max(d.a, 0.0);
  vec3 tint = d.rgb / max(d.a, 0.0015);

  // Ink sits ON the water. Beer–Lambert rather than a linear ramp: thin films
  // still read as ink, which is what keeps a spread pattern from washing out to
  // nothing the moment it marbles.
  float coverage = 1.0 - exp(-a * 3.2);

  vec3 col = mix(uPaper, tint, clamp(coverage, 0.0, 1.0));

  float grain = (hash(vUv * 1024.0) - 0.5) * uGrain;
  fragColor = vec4(col + grain, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
  }
  return shader;
}

class Program {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(private gl: WebGL2RenderingContext, vertex: WebGLShader, fragmentSource: string) {
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, fragment);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(this.program) ?? "program link failed");
    }
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(this.program, i)!.name;
      this.uniforms[name] = gl.getUniformLocation(this.program, name)!;
    }
  }

  bind() {
    this.gl.useProgram(this.program);
  }
}

export interface BasinConfig {
  simRes: number;
  dyeRes: number;
  densityDissipation: number;
  velocityDissipation: number;
  pressure: number;
  pressureIterations: number;
  curl: number;
  splatRadius: number;
  paper: Vec3;
  grain: number;
}

export const DEFAULT_CONFIG: BasinConfig = {
  simRes: 128,
  dyeRes: 700,
  // Ink on a still basin barely fades. This is the number that separates
  // "suminagashi" from "smoke machine".
  densityDissipation: 0.085,
  // Low enough that a whorl keeps turning after the stroke that made it.
  velocityDissipation: 0.26,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 30,
  // Gaussian sigma is sqrt(radius/2), so this lands a drop about 6% of the
  // viewport across — a drop, not a cloud.
  splatRadius: 0.0042,
  paper: [0.965, 0.969, 0.973],
  grain: 0.012,
};

export class InkBasinSim {
  private gl: WebGL2RenderingContext;
  private programs: Record<string, Program>;
  private dye!: DoubleFBO;
  private velocity!: DoubleFBO;
  private divergence!: FBO;
  private curlFbo!: FBO;
  private pressure!: DoubleFBO;
  private lastTime = 0;
  private textureId = 0;
  private raf = 0;
  private running = false;

  config: BasinConfig;

  constructor(private canvas: HTMLCanvasElement, config: Partial<BasinConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("webgl2 unavailable");
    if (!gl.getExtension("EXT_color_buffer_float")) throw new Error("float render targets unavailable");
    gl.getExtension("OES_texture_float_linear");
    this.gl = gl;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const vertex = compile(gl, gl.VERTEX_SHADER, BASE_VERTEX);
    this.programs = {
      clear: new Program(gl, vertex, CLEAR),
      splat: new Program(gl, vertex, SPLAT),
      advection: new Program(gl, vertex, ADVECTION),
      divergence: new Program(gl, vertex, DIVERGENCE),
      curl: new Program(gl, vertex, CURL),
      vorticity: new Program(gl, vertex, VORTICITY),
      pressure: new Program(gl, vertex, PRESSURE),
      gradient: new Program(gl, vertex, GRADIENT_SUBTRACT),
      display: new Program(gl, vertex, DISPLAY),
    };

    this.initFramebuffers();
  }

  private createFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): FBO {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const self = this;
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        void self;
        return id;
      },
    };
  }

  private createDoubleFBO(w: number, h: number, internal: number, format: number, type: number, filter: number): DoubleFBO {
    let fbo1 = this.createFBO(w, h, internal, format, type, filter);
    let fbo2 = this.createFBO(w, h, internal, format, type, filter);
    return {
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      get read() {
        return fbo1;
      },
      set read(v: FBO) {
        fbo1 = v;
      },
      get write() {
        return fbo2;
      },
      set write(v: FBO) {
        fbo2 = v;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  private resolution(target: number) {
    const gl = this.gl;
    const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const ratio = aspect < 1 ? 1 / aspect : aspect;
    const min = Math.round(target);
    const max = Math.round(target * ratio);
    return aspect > 1 ? { width: max, height: min } : { width: min, height: max };
  }

  private initFramebuffers() {
    const gl = this.gl;
    const sim = this.resolution(this.config.simRes);
    const dye = this.resolution(this.config.dyeRes);
    const filter = gl.LINEAR;

    this.dye = this.createDoubleFBO(dye.width, dye.height, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, filter);
    this.velocity = this.createDoubleFBO(sim.width, sim.height, gl.RG16F, gl.RG, gl.HALF_FLOAT, filter);
    this.divergence = this.createFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
    this.curlFbo = this.createFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
    this.pressure = this.createDoubleFBO(sim.width, sim.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
  }

  private blit(target: FBO | null) {
    const gl = this.gl;
    if (target === null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  resize() {
    const canvas = this.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) return false;
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    this.initFramebuffers();
    return true;
  }

  /** Drop ink. `point` is in 0..1 canvas space, origin bottom-left. */
  drop(x: number, y: number, color: Vec3, strength = 1, radiusScale = 1) {
    const gl = this.gl;
    const splat = this.programs.splat;
    splat.bind();

    gl.uniform1i(splat.uniforms.uTarget, this.velocity.read.attach(0));
    gl.uniform1f(splat.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    gl.uniform2f(splat.uniforms.point, x, y);
    // A drop pushes the surface outward a little as it lands.
    gl.uniform4f(splat.uniforms.color, 0, 0, 0, 0);
    gl.uniform1f(splat.uniforms.radius, this.config.splatRadius * radiusScale);
    this.blit(this.velocity.write);
    this.velocity.swap();

    gl.uniform1i(splat.uniforms.uTarget, this.dye.read.attach(0));
    gl.uniform4f(splat.uniforms.color, color[0] * strength, color[1] * strength, color[2] * strength, strength);
    gl.uniform1f(splat.uniforms.radius, this.config.splatRadius * radiusScale);
    this.blit(this.dye.write);
    this.dye.swap();
  }

  /** Stir the surface without adding ink — the fingertip drag. */
  stir(x: number, y: number, dx: number, dy: number, radiusScale = 1) {
    const gl = this.gl;
    const splat = this.programs.splat;
    splat.bind();
    gl.uniform1i(splat.uniforms.uTarget, this.velocity.read.attach(0));
    gl.uniform1f(splat.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    gl.uniform2f(splat.uniforms.point, x, y);
    gl.uniform4f(splat.uniforms.color, dx, dy, 0, 0);
    gl.uniform1f(splat.uniforms.radius, this.config.splatRadius * radiusScale);
    this.blit(this.velocity.write);
    this.velocity.swap();
  }

  private step(dt: number) {
    const gl = this.gl;
    const { programs, velocity, dye, pressure, divergence, curlFbo, config } = this;

    gl.disable(gl.BLEND);

    programs.curl.bind();
    gl.uniform2f(programs.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
    this.blit(curlFbo);

    programs.vorticity.bind();
    gl.uniform2f(programs.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.vorticity.uniforms.uCurl, curlFbo.attach(1));
    gl.uniform1f(programs.vorticity.uniforms.curl, config.curl);
    gl.uniform1f(programs.vorticity.uniforms.dt, dt);
    this.blit(velocity.write);
    velocity.swap();

    programs.divergence.bind();
    gl.uniform2f(programs.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0));
    this.blit(divergence);

    programs.clear.bind();
    gl.uniform1i(programs.clear.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(programs.clear.uniforms.value, config.pressure);
    this.blit(pressure.write);
    pressure.swap();

    programs.pressure.bind();
    gl.uniform2f(programs.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.pressureIterations; i++) {
      gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1));
      this.blit(pressure.write);
      pressure.swap();
    }

    programs.gradient.bind();
    gl.uniform2f(programs.gradient.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.gradient.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(programs.gradient.uniforms.uVelocity, velocity.read.attach(1));
    this.blit(velocity.write);
    velocity.swap();

    programs.advection.bind();
    gl.uniform2f(programs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, velocity.read.attach(0));
    gl.uniform1f(programs.advection.uniforms.dt, dt);
    gl.uniform1f(programs.advection.uniforms.dissipation, config.velocityDissipation);
    this.blit(velocity.write);
    velocity.swap();

    programs.advection.bind();
    // Velocity is expressed in simulation-grid units, so dye must be stepped with
    // the VELOCITY texel size. Using the dye grid's own (finer) texel size makes ink
    // crawl at a fraction of the flow carrying it, and the pattern never marbles.
    gl.uniform2f(programs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(programs.advection.uniforms.dt, dt);
    gl.uniform1f(programs.advection.uniforms.dissipation, config.densityDissipation);
    this.blit(dye.write);
    dye.swap();
  }

  render() {
    const gl = this.gl;
    const display = this.programs.display;
    display.bind();
    gl.uniform1i(display.uniforms.uDye, this.dye.read.attach(0));
    gl.uniform3f(display.uniforms.uPaper, ...this.config.paper);
    gl.uniform1f(display.uniforms.uGrain, this.config.grain);
    this.blit(null);
  }

  /** Advance without presenting — used to pre-settle a still frame for reduced motion. */
  settle(steps: number) {
    for (let i = 0; i < steps; i++) this.step(0.016);
    this.render();
  }

  start(onFrame?: (dt: number) => void) {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const loop = () => {
      if (!this.running) return;
      const now = performance.now();
      const dt = Math.min((now - this.lastTime) / 1000, 0.0166);
      this.lastTime = now;
      this.resize();
      onFrame?.(dt);
      this.step(dt);
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  get isRunning() {
    return this.running;
  }

  /**
   * Stops the loop but deliberately does NOT drop the GL context. A canvas whose
   * context has been lost hands back the same dead context on the next
   * getContext, and every extension query on it returns null — which under
   * StrictMode's double-invoked effects kills the basin on the second mount.
   */
  dispose() {
    this.stop();
  }
}

/** Traditional dye colours, kept inside the basin's ink family. */
export function hexToVec3(hex: string): Vec3 {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
