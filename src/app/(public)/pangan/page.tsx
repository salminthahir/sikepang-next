import { prisma } from "@/lib/prisma"
import { Search, Sliders, FileText, Info, Building, MapPin, Calendar, Building2, Filter, Store } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PanganPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const keyword = typeof searchParams.keyword === 'string' ? searchParams.keyword : '';
  const lokasi = typeof searchParams.lokasi === 'string' ? searchParams.lokasi : '';

  // Get current date string for querying latest entries today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Logic
  const transactions = await prisma.transaksiPangan.findMany({
    where: {
      tanggal_input: {
        gte: today, 
      },
      komoditas: {
        nama_pangan: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      mitra: lokasi && lokasi !== 'rata_rata' ? {
        ...(lokasi === 'Pasar' ? { kategori_usaha: 'Pasar' } : 
           lokasi === 'UD' ? { kategori_usaha: 'Distributor' } : 
           { nama_usaha: { contains: lokasi, mode: 'insensitive' } })
      } : undefined
    },
    include: {
      komoditas: true,
      mitra: true
    },
    orderBy: {
      tanggal_input: 'desc'
    }
  })

  // Group by komoditas if rata_rata
  let data: Array<{
    id: string;
    nama_pangan: string;
    satuan: string;
    harga_jual: number;
    jumlah_stok: number;
    nama_usaha: string;
    tanggal_input: Date;
  }> = [];
  
  if (lokasi === 'rata_rata') {
    const grouped = transactions.reduce((acc: any, curr) => {
      if (!acc[curr.id_komoditas]) {
        acc[curr.id_komoditas] = {
          nama_pangan: curr.komoditas.nama_pangan,
          satuan: curr.komoditas.satuan,
          total_harga: 0,
          total_stok: 0,
          count: 0,
          tanggal: curr.tanggal_input
        }
      }
      acc[curr.id_komoditas].total_harga += curr.harga_jual;
      acc[curr.id_komoditas].total_stok += curr.jumlah_stok;
      acc[curr.id_komoditas].count += 1;
      return acc;
    }, {});
    
    data = Object.values(grouped).map((g: any) => ({
      id: g.nama_pangan,
      nama_pangan: g.nama_pangan,
      satuan: g.satuan,
      harga_jual: Math.round(g.total_harga / g.count),
      jumlah_stok: g.total_stok,
      nama_usaha: 'Gabungan',
      tanggal_input: g.tanggal
    }));
  } else {
    data = transactions.map(t => ({
      id: t.id_transaksi.toString(),
      nama_pangan: t.komoditas.nama_pangan,
      satuan: t.komoditas.satuan,
      harga_jual: t.harga_jual,
      jumlah_stok: t.jumlah_stok,
      nama_usaha: t.mitra.nama_usaha || t.mitra.kategori_usaha,
      tanggal_input: t.tanggal_input
    }));
  }

  // Remove duplicates for non rata_rata (only latest per mitra per komoditas today)
  if (lokasi !== 'rata_rata') {
    const uniqueMap = new Map();
    data.forEach(item => {
      const key = `${item.nama_pangan}-${item.nama_usaha}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    data = Array.from(uniqueMap.values());
  }

  return (
    <div className="bg-[var(--color-body-bg)] min-h-screen pb-16">
      {/* Header */}
      <div className="pt-12 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:align-items-center mb-4">
            <div>
                <h2 className="text-3xl font-bold mb-1 text-gray-900">Daftar Harga & Stok</h2>
                <p className="text-gray-500 mb-0">Pantau pergerakan harga komoditas pasar secara real-time.</p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1c20] rounded-[1rem] shadow-sm sticky top-28 text-white overflow-hidden">
              <div className="border-b border-gray-700 py-4 px-5">
                  <h5 className="font-bold mb-0 text-white flex items-center gap-2">
                    <Sliders size={20} /> Filter Data
                  </h5>
              </div>
              <div className="p-5">
                <form action="/pangan" method="get">
                  <div className="mb-5">
                      <label className="block font-bold text-xs uppercase text-gray-400 mb-2">Kata Kunci</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                          <input 
                            type="text" 
                            name="keyword" 
                            defaultValue={keyword}
                            className="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border-0 rounded-md text-white placeholder-gray-500 focus:ring-1 focus:ring-green-500 text-sm"
                            placeholder="Cari komoditas..."
                          />
                      </div>
                  </div>

                  <div className="mb-6">
                      <label className="block font-bold text-xs uppercase text-gray-400 mb-2">Lokasi Pasar</label>
                      <select 
                        name="lokasi" 
                        defaultValue={lokasi}
                        className="block w-full py-2.5 px-3 bg-gray-800 border-0 rounded-md text-white focus:ring-1 focus:ring-green-500 font-medium text-sm appearance-none"
                      >
                          <option value="">Semua Data</option>
                          <option value="rata_rata" className="text-yellow-400 font-bold">★ Rekapitulasi Kota</option>
                          <option disabled>────────────────────────</option>
                          <option value="Pasar">Semua Pasar</option>
                          <option value="Higienis">Pasar Higienis</option>
                          <option value="Bastiong">Pasar Bastiong</option>
                          <option value="Dufa">Pasar Dufa-Dufa</option>
                          <option value="UD">Distributor / UD</option>
                      </select>
                  </div>

                  <div className="grid gap-3">
                      <button type="submit" className="w-full flex justify-center items-center gap-2 bg-[#198754] hover:bg-[#157347] text-white font-bold py-2.5 rounded-md shadow-sm transition-colors text-sm">
                          <Filter size={16} /> Terapkan Filter
                      </button>
                      <a href={`/api/pdf?keyword=${keyword}&lokasi=${lokasi}`} target="_blank" className="w-full flex justify-center items-center gap-2 bg-transparent hover:bg-[rgba(255,255,255,0.1)] text-white border border-gray-600 font-bold py-2.5 rounded-md transition-colors text-sm">
                          <FileText size={16} /> Unduh PDF
                      </a>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {lokasi === 'rata_rata' && (
              <div className="bg-[#198754] text-white border-0 shadow-sm rounded-[1rem] p-4 mb-6 flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Info size={24} className="text-white" />
                  </div>
                  <div>
                      <strong className="block text-lg">Mode Rekapitulasi Aktif:</strong> 
                      <span className="opacity-90 text-sm">Menampilkan rata-rata harga se-Kota Ternate.</span>
                  </div>
              </div>
            )}

            <div className="bg-white border-0 shadow-sm rounded-[1rem] overflow-hidden mb-6">
              <div className="py-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h5 className="font-bold mb-0 text-gray-900 text-lg">Hasil Pencarian</h5>
                  <span className="bg-[#198754] text-white text-xs font-bold px-3 py-1.5 rounded-full">Live Data</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#155724] text-white text-xs uppercase">
                    <tr>
                      <th className="py-4 px-6 font-semibold">Komoditas</th>
                      <th className="py-4 px-6 font-semibold">Stok</th>
                      <th className="py-4 px-6 font-semibold">Harga (Rp)</th>
                      <th className="py-4 px-6 font-semibold">Sumber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                              <Search size={32} className="text-gray-400" />
                            </div>
                            <h6 className="text-gray-500 font-bold">Data Tidak Ditemukan</h6>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      data.map((item, idx) => (
                        <tr key={item.id || idx} className={`hover:bg-gray-50 transition-colors ${lokasi === 'rata_rata' ? 'bg-[#198754]/5' : ''}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="text-[#198754]">
                                ▶
                              </div>
                              <div className="font-bold text-gray-900">{item.nama_pangan}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-900">{item.jumlah_stok.toLocaleString('id-ID')}</span>
                            <span className="text-xs text-gray-500 ml-1">{item.satuan}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-[#198754] font-bold">
                              Rp {item.harga_jual.toLocaleString('id-ID')}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded">
                              {item.nama_usaha}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View Cards (visible only on small screens) */}
            <div className="block md:hidden space-y-4 mb-6">
              {data.map((item, idx) => (
                <div key={item.id || idx} className={`bg-white border-0 shadow-sm rounded-2xl p-4 ${lokasi === 'rata_rata' ? 'border-l-4 border-l-[#198754]' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-900 text-lg">{item.nama_pangan}</div>
                    <span className="bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium px-2 py-1 rounded">
                      Stok: {item.jumlah_stok.toLocaleString('id-ID')} {item.satuan}
                    </span>
                  </div>
                  <h4 className="text-[#198754] font-bold text-xl mb-4">Rp {item.harga_jual.toLocaleString('id-ID')}</h4>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                      {lokasi === 'rata_rata' ? (
                        <span className="text-[#0d6efd] font-bold flex items-center gap-1"><Building2 size={14}/> Se-Kota</span>
                      ) : (
                        <span className="flex items-center gap-1"><Store size={14}/> {item.nama_usaha}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14}/> {new Date(item.tanggal_input).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
