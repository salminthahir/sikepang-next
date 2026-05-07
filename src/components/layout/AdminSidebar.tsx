"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Package, FileText, Settings, LogOut, ChevronLeft, Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Kelola Komoditas", href: "/admin/komoditas", icon: <Package className="w-5 h-5" /> },
    { name: "Manajemen Mitra", href: "/admin/mitra", icon: <Users className="w-5 h-5" /> },
    { name: "Stok Pangan", href: "/admin/stok", icon: <FileText className="w-5 h-5" /> },
    { name: "Berita & Artikel", href: "/admin/berita", icon: <FileText className="w-5 h-5" /> },
    { name: "Profil Admin", href: "/admin/profil", icon: <Settings className="w-5 h-5" /> },
  ]

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-[0_0_20px_rgba(0,0,0,0.05)] font-['System_UI',_sans-serif]">
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img src="/logo/image.png" alt="SiKepang" className="h-[45px] object-contain" />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hidden md:block ml-auto"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-5 space-y-2">
        <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          Menu Utama
        </p>
        
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href)
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActive 
                  ? "bg-[#435ebe] text-white shadow-[0_4px_10px_rgba(67,94,190,0.4)]" 
                  : "text-[#25396f] hover:bg-gray-50 hover:text-[#435ebe]"
              } ${isCollapsed ? "justify-center px-2" : ""}`}
              title={isCollapsed ? link.name : ""}
            >
              <div className={`${isActive ? "text-white" : "text-[#7b8cb8]"}`}>
                {link.icon}
              </div>
              {!isCollapsed && <span className="ml-4">{link.name}</span>}
            </Link>
          )
        })}
      </div>

      <div className="p-5 border-t border-gray-100">
        <p className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ${isCollapsed ? 'hidden' : 'block'}`}>
          Sesi
        </p>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-xl font-semibold text-[#ff7976] hover:bg-[#ff7976]/10 transition-colors ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-600"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block h-screen sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-900/50" onClick={() => setIsMobileOpen(false)}></div>
          <aside className="relative w-64 h-full">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
