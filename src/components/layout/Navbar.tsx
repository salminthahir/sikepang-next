"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, LineChart, Package, LogIn, Menu, X, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const navLinks = [
    { name: "Beranda", href: "/", icon: null },
    { name: "Harga Pangan", href: "/pangan", icon: <Package className="w-4 h-4 mr-2" /> },
    { name: "Sebaran Mitra", href: "/sebaran", icon: <Map className="w-4 h-4 mr-2" /> },
    { name: "Monitoring", href: "/monitoring", icon: <LineChart className="w-4 h-4 mr-2" /> },
  ]

  const dashboardUrl = session?.user?.role === 'mitra' ? '/mitra/dashboard' : '/admin/dashboard'

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1 flex">
                <img src="/logo/image.png" alt="Logo" className="h-[42px] w-auto" />
              </div>
              <div className="flex flex-col">
                <span className="block font-bold text-gray-900 leading-none" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'var(--color-primary)' }}>
                  SIKEPANG
                </span>
                <span className="block opacity-75 leading-none text-gray-500" style={{ fontSize: '11px' }}>
                  Kota Ternate
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center text-[0.95rem] font-semibold px-[18px] py-[8px] rounded-[50px] transition-all ${
                  pathname === link.href
                    ? "text-[var(--color-primary)] bg-[rgba(21,87,36,0.08)]"
                    : "text-[#555] hover:text-[var(--color-primary)] hover:bg-[rgba(21,87,36,0.08)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Login/Dashboard Button (Desktop) */}
          <div className="hidden md:flex items-center ml-4">
            {session ? (
              <Link
                href={dashboardUrl}
                className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-[28px] py-[10px] rounded-[50px] font-semibold transition-transform hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(21,87,36,0.2)] hover:shadow-[0_6px_15px_rgba(21,87,36,0.3)] active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-[28px] py-[10px] rounded-[50px] font-semibold transition-transform hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(21,87,36,0.2)] hover:shadow-[0_6px_15px_rgba(21,87,36,0.3)] active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? "bg-green-50 text-green-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-gray-100">
            {session ? (
              <Link
                href={dashboardUrl}
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-4 py-3 rounded-xl text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
