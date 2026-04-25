// app/tutorial/page.tsx
import TutorialHero from "@/components/tutorial/TutorialHero";
import TutorialNav from "@/components/tutorial/Tutorialnav";
import SectionJualan from "@/components/tutorial/SectionJualan";
import SectionBeli from "@/components/tutorial/SectionBeli";
import SectionBayar from "@/components/tutorial/SectionBayar";
import SectionRating from "@/components/tutorial/SectionRating";
import SectionLapor from "@/components/tutorial/SectionLapor";
import SectionFeedback from "@/components/tutorial/SectionFeedback";
import { Header } from "@/components/views/Header";

export default function TutorialPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header />
      <TutorialHero />
      <TutorialNav />

      <div className="max-w-6xl mx-auto px-5 space-y-10 pb-16 pt-8">
        <SectionJualan />
        <div className="h-px bg-blue-50" />
        <SectionBeli />
        <div className="h-px bg-blue-50" />
        <SectionBayar />
        <div className="h-px bg-blue-50" />
        <SectionRating />
        <div className="h-px bg-blue-50" />
        <SectionLapor />
        <div className="h-px bg-blue-50" />
        <SectionFeedback />
      </div>
    </main>
  );
}
