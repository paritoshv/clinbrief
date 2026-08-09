import InkBasin from "@/components/InkBasin";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TheCall from "@/components/TheCall";
import TheBrief from "@/components/TheBrief";
import Languages from "@/components/Languages";
import WhyPhone from "@/components/WhyPhone";
import Limits from "@/components/Limits";
import Standing from "@/components/Standing";
import Contact from "@/components/Contact";

/* One basin runs behind everything. The sections are sheets of paper laid on the
   water, and the gaps between them are where the water shows through. */
export default function Page() {
  return (
    <>
      <InkBasin />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <TheCall />
        <div className="h-[18vh] md:h-[26vh]" aria-hidden="true" />
        <TheBrief />
        <Languages />
        <WhyPhone />
        <Limits />
        <Standing />
        <Contact />
      </main>
    </>
  );
}
