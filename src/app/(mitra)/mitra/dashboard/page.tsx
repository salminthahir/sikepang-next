import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Package, FileText, Calendar, PlusCircle } from "lucide-react"
import Link from "next/link"
import ModalBerita from "@/components/ModalBerita"

export const dynamic = 'force-dynamic'

export default async function MitraDashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) return null

  // Fetch Mitra profile
  const user = await prisma.user.findUnique({
    where: { id_user: parseInt(session.user.id) },
    include: { profil_mitra: true }
  })

  const mitraId = user?.profil_mitra?.id_mitra

  if (!mitraId) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Profil Belum Lengkap</h2>
        <p className="text-yellow-700">Silakan lengkapi profil usaha Anda terlebih dahulu sebelum dapat menginput stok pangan.</p>
        <Link href="/mitra/profil" className="inline-block mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium">
          Lengkapi Profil
        </Link>
      </div>
    )
  }

  // Get today's transactions
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const transactionsToday = await prisma.transaksiPangan.findMany({
    where: {
      id_mitra: mitraId,
      tanggal_input: {
        gte: today
      }
    },
    include: {
      komoditas: true
    }
  })

  // Get total unique commodities ever inputted
  const totalKomoditas = await prisma.transaksiPangan.groupBy({
    by: ['id_komoditas'],
    where: { id_mitra: mitraId }
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
        <h1 className="text-2xl font-bold text-gray-900">Dasbor Mitra</h1>
        <p className="text-gray-600 mt-1">Selamat datang, {session.user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Komoditas</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalKomoditas.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Input Hari Ini</p>
            <h3 className="text-2xl font-bold text-gray-900">{transactionsToday.length} Data</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Aksi Cepat</p>
            <Link href="/mitra/stok" className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700">
              <PlusCircle className="w-4 h-4" />
              Input Stok Baru
            </Link>
          </div>
          <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Data Stok Hari Ini</h2>
          <Link href="/mitra/stok" className="text-sm font-medium text-green-600 hover:text-green-700">Lihat Semua</Link>
        </div>
        <div className="p-0">
          {transactionsToday.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komoditas</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Jual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactionsToday.map((trx) => (
                  <tr key={trx.id_transaksi.toString()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trx.komoditas.nama_pangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {trx.jumlah_stok} {trx.komoditas.satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                      Rp {trx.harga_jual.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Belum Ada Data</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Anda belum menginput data stok dan harga pangan hari ini.</p>
              <Link href="/mitra/stok" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                <PlusCircle className="w-5 h-5" />
                Input Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
