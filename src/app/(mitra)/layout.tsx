import MitraSidebar from "@/components/layout/MitraSidebar"

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f2f7ff] font-['System_UI',_sans-serif]">
      <MitraSidebar />
      <main className="flex-1 overflow-x-hidden md:pl-0">
        <div className="p-4 pt-16 md:p-8 md:pt-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
