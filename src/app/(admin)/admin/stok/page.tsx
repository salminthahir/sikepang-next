import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BarChart3, Plus, Trash2 } from "lucide-react"

export const dynamic = 'force-dynamic'

async function addStokBulanan(formData: FormData) {
  "use server"
  const nama_komoditas = formData.get("nama_komoditas") as string
  const stok_masuk_ton = parseFloat(formData.get("stok_masuk_ton") as string)
  const stok_keluar_ton = parseFloat(formData.get("stok_keluar_ton") as string) || 0
  const bulan = parseInt(formData.get("bulan") as string)
  const tahun = parseInt(formData.get("tahun") as string)
  const kategori_dinas = formData.get("kategori_dinas") as string

  await prisma.stokPanganBulanan.create({
    data: {
      nama_komoditas,
      stok_masuk_ton,
      stok_keluar_ton,
      bulan,
      tahun,
      kategori_dinas
    }
  })
  revalidatePath("/admin/stok")
}

async function deleteStokBulanan(formData: FormData) {
  "use server"
  const id = BigInt(formData.get("id_stok_bulanan") as string)
  
  await prisma.stokPanganBulanan.delete({
    where: { id }
  })
  revalidatePath("/admin/stok")
}

export default async function AdminStokBulananPage() {
  const currentYear = new Date().getFullYear()
  const stok = await prisma.stokPanganBulanan.findMany({
    where: { tahun: currentYear },
    orderBy: [
      { bulan: 'desc' },
      { nama_komoditas: 'asc' }
    ]
  })

  const komoditasList = await prisma.msKomoditas.findMany({
    orderBy: { nama_pangan: 'asc' }
  })

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rekapitulasi Stok Bulanan</h1>
        <p className="text-gray-600 mt-1">Kelola data stok bulanan (dalam Ton) yang akan ditampilkan pada grafik monitoring publik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-orange-50/50">
              <h2 className="text-lg font-bold text-orange-900">Tambah Rekapitulasi</h2>
            </div>
            <div className="p-6">
              <form action={addStokBulanan} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Komoditas</label>
                  <select
                    name="nama_komoditas"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                  >
                    <option value="">-- Pilih Komoditas --</option>
                    {komoditasList.map((item) => (
                      <option key={item.id_komoditas} value={item.nama_pangan}>
                        {item.nama_pangan}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                    <select
                      name="bulan"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                    >
                      {namaBulan.map((bulan, i) => (
                        <option key={i+1} value={i+1}>{bulan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                    <input
                      type="number"
                      name="tahun"
                      required
                      defaultValue={currentYear}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stok Masuk (Ton)</label>
                  <input
                    type="number"
                    step="any"
                    name="stok_masuk_ton"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Contoh: 50.5"
                  />
                </div>

                <input type="hidden" name="kategori_dinas" value="Dinas Ketpang" />

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Simpan Rekap
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                Data Rekapitulasi Tahun {currentYear}
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komoditas</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok Masuk (Ton)</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stok.map((item) => (
                    <tr key={item.id.toString()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {namaBulan[item.bulan - 1]} {item.tahun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nama_komoditas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {Number(item.stok_masuk_ton).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-2">
                        <form action={deleteStokBulanan}>
                          <input type="hidden" name="id_stok_bulanan" value={item.id.toString()} />
                          <button type="submit" className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {stok.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        Belum ada rekapitulasi data tahun ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
