import { prisma } from "@/lib/prisma"
import StokChart from "@/components/charts/StokChart"

export const dynamic = 'force-dynamic'

export default async function MonitoringPage() {
  // Fetch monthly stock data for the year 2025
  const currentYear = 2025 // Hardcoded for this demo, usually new Date().getFullYear()
  
  const stokBulanan = await prisma.stokPanganBulanan.findMany({
    where: {
      tahun: currentYear,
      kategori_dinas: 'Dinas Ketpang'
    },
    orderBy: {
      bulan: 'asc'
    }
  })

  // Format data for Chart.js
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
  
  // Group by commodity
  const komoditasSet = new Set(stokBulanan.map(s => s.nama_komoditas))
  
  // Colors for different commodities
  const colors = [
    '#16a34a', '#2563eb', '#ea580c', '#d946ef', '#06b6d4',
    '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#64748b'
  ]

  const datasets = Array.from(komoditasSet).map((nama, index) => {
    const dataForKomoditas = months.map((_, monthIndex) => {
      const record = stokBulanan.find(s => s.nama_komoditas === nama && s.bulan === monthIndex + 1)
      return record ? Number(record.stok_masuk_ton) : 0
    })

    const color = colors[index % colors.length]

    return {
      label: nama,
      data: dataForKomoditas,
      borderColor: color,
      backgroundColor: color,
      tension: 0.4
    }
  })

  const chartData = {
    labels: months,
    datasets
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring Stok Pangan Bulanan</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Grafik ketersediaan stok masuk pangan berdasarkan data Dinas Ketahanan Pangan Kota Ternate tahun {currentYear}.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[500px]">
        {datasets.length > 0 ? (
          <StokChart data={chartData} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Belum ada data stok bulanan untuk ditampilkan.</p>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-green-900 mb-2">Sumber Data</h3>
          <p className="text-sm text-green-800">
            Data ini direkapitulasi secara berkala oleh Admin Dinas Ketahanan Pangan berdasarkan laporan mitra dan survei lapangan.
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Satuan Pengukuran</h3>
          <p className="text-sm text-blue-800">
            Seluruh data stok komoditas pada grafik di atas ditampilkan dalam satuan <strong>Ton (1.000 Kg)</strong>.
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <h3 className="font-semibold text-orange-900 mb-2">Transparansi</h3>
          <p className="text-sm text-orange-800">
            Grafik ini bertujuan memberikan transparansi informasi ketersediaan pangan bagi masyarakat luas.
          </p>
        </div>
      </div>
    </div>
  )
}
