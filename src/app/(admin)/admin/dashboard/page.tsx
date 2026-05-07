import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Package, Users, FileText, Bell, Map } from "lucide-react"
import Link from "next/link"
import ModalBerita from "@/components/ModalBerita"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) return null

  // Fetch quick stats
  const totalMitra = await prisma.user.count({ where: { role: 'mitra' } })
  const totalKomoditas = await prisma.msKomoditas.count()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const transaksiHariIni = await prisma.transaksiPangan.count({
    where: {
      tanggal_input: {
        gte: today
      }
    }
  })

  // Fetch recent notifications or system logs
  const recentLogs = await prisma.systemLog.findMany({
    orderBy: { id: 'desc' },
    take: 5
  })

  // Get Latest News for Modal
  const latestNews = await prisma.berita.findFirst({
    orderBy: { created_at: 'desc' }
  })

  // Format news for client component
  const beritaForModal = latestNews ? {
    id: latestNews.id,
    judul: latestNews.judul,
    isi: latestNews.isi,
    gambar: latestNews.gambar,
    createdAt: latestNews.created_at?.toISOString() || new Date().toISOString()
  } : null

  return (
    <div>
      <ModalBerita berita={beritaForModal} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dasbor Admin</h1>
        <p className="text-gray-600 mt-1">Selamat datang kembali, {session.user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Mitra</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalMitra}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Komoditas</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalKomoditas}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Input Hari Ini</p>
            <h3 className="text-2xl font-bold text-gray-900">{transaksiHariIni}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Peta Sebaran</p>
            <Link href="/sebaran" className="text-sm font-bold text-purple-600 hover:text-purple-700">Lihat Peta &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Aktivitas Sistem Terbaru
              </h2>
            </div>
            <div className="p-0">
              {recentLogs.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentLogs.map((log) => (
                    <div key={log.id.toString()} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.username} <span className="font-normal text-gray-600">{log.action}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : 'N/A'} • IP: {log.ip_address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">Belum ada aktivitas sistem.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar/Secondary Area */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <Link href="/admin/komoditas" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all group">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  <span className="font-medium text-gray-700 group-hover:text-green-700">Kelola Komoditas</span>
                </div>
                <span className="text-gray-300 group-hover:text-green-500">&rarr;</span>
              </Link>
              <Link href="/admin/mitra" className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">Manajemen Mitra</span>
                </div>
                <span className="text-gray-300 group-hover:text-blue-500">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
