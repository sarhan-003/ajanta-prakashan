import { Home, Search } from "lucide-react";
import { LinkButton } from "@/components/common/LinkButton";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PublicAuthProvider } from "@/contexts/PublicAuthContext";

export default function NotFound() {
  return (
    <PublicAuthProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
          <div className="bg-dots-dark absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]" aria-hidden />
          <div className="relative text-center">
            <p className="font-serif text-8xl font-bold tracking-tight text-brand-500 sm:text-9xl">404</p>
            <h1 className="mt-4 font-serif text-2xl font-semibold text-ink-900 sm:text-3xl">Page not found</h1>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-500">
              The conference, event or notification you&apos;re looking for may have been removed or the link is incorrect.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton href="/" size="lg">
                <Home className="h-5 w-5" /> Go Home
              </LinkButton>
              <LinkButton href="/conferences" variant="outline" size="lg">
                <Search className="h-5 w-5" /> Browse Conferences
              </LinkButton>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PublicAuthProvider>
  );
}
