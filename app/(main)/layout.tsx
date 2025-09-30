import { ThemeToggle } from "@/components/common/ThemeToggle";

 
export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* <Sidebar /> */}
      <ThemeToggle/>
      <div className="flex flex-col">
        {/* <Navbar /> */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary/40">
          {children}
        </main>
      </div>
    </div>
  );
}