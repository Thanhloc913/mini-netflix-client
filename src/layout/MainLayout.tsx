import Navbar from "@/components/Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-950 text-neutral-100 overflow-x-hidden antialiased">
      <Navbar />
      <main className="flex-1 pt-16 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
