import Navbar from "@/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen min-w-[360px] flex-col bg-neutral-950 text-neutral-100 overflow-x-hidden antialiased">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
