import Header from "@/components/header";
import { WritingSection } from "@/components/writing-section";
import { NewsletterForm } from "@/components/newsletter-form";
import MainNav from "@/components/navigation-bar";

export default async function Page() {
  return (
    <>
      <main className="motion-safe:animate-fade">
        <MainNav
          backable={true}
          backMessage="cd ~/personal-projects/ethan.dev cd .."
          backAnchor="https://ethanpinedaa.dev/"
        />
        <div className="relative z-aboveVignette min-h-screen p-8 md:p-16 lg:p-24 motion-safe:animate-fade ">
          <div className="mx-auto max-w-2xl flex gap-16 flex-col">
            <Header />
            <WritingSection />
            <NewsletterForm />
          </div>
        </div>
      </main>
    </>
  );
}
