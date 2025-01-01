import Header from "@/components/header";
import { WritingSection } from "@/components/writing-section";
export default function Page() {
  return (
    <main className="relative z-aboveVignette min-h-screen p-8 md:p-16 lg:p-24 motion-safe:animate-fade">
      <div className="mx-auto max-w-2xl flex gap-16 flex-col">
        <Header />
        <WritingSection />
      </div>
    </main>
  );
}
