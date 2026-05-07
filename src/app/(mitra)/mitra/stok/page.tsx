import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Package, Plus, Trash2 } from "lucide-react"

export const dynamic = 'force-dynamic'

async function addStok(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const id_user = parseInt(session.user.id)
  
  const user = await prisma.user.findUnique({
    where: { id_user },
    include: { profil_mitra: true }
  })
  
  const id_mitra = user?.profil_mitra?.id_mitra
  if (!id_mitra) throw new Error("Profil belum lengkap")

  const id_komoditas = parseInt(formData.get("id_komoditas") as string)
  const jumlah_stok = parseFloat(formData.get("jumlah_stok") as string)
  const harga_jual = parseFloat(formData.get("harga_jual") as string)

  await prisma.transaksiPangan.create({
    data: {
      id_mitra,
      id_komoditas,
      jumlah_stok,
      harga_jual,
      input_by: id_user,
      tanggal_input: new Date(),
    }
  })

  // Add notification to system
  await prisma.notifikasiSistem.create({
    data: {
      tipe: 'info',
      judul: 'Stok Masuk Baru',
      pesan: `Mitra ${user?.profil_mitra?.nama_usaha} menambahkan stok baru.`,
      icon: 'box-arrow-in-right',
      waktu: new Date()
    }
  })

  revalidatePath("/mitra/stok")
  revalidatePath("/mitra/dashboard")
}

async function deleteStok(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
    
  const id_transaksi = BigInt(formData.get("id_transaksi") as string)
  
  await prisma.transaksiPangan.delete({
    where: { id_transaksi }
  })

  revalidatePath("/mitra/stok")
  revalidatePath("/mitra/dashboard")
}

export default async function MitraStokPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id_user: parseInt(session.user.id) },
    include: { profil_mitra: true }
  })

  const mitraId = user?.profil_mitra?.id_mitra
  const komoditasList = await prisma.msKomoditas.findMany()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const transactionsToday = mitraId ? await prisma.transaksiPangan.findMany({
    where: {
      id_mitra: mitraId,
      tanggal_input: {
        gte: today
      }
    },
    include: {
      komoditas: true
    },
    orderBy: {
      id_transaksi: 'desc'
    }
  }) : []

  if (!mitraId) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Profil Belum Lengkap</h2>
        <p className="text-yellow-700">Silakan lengkapi profil usaha Anda terlebih dahulu sebelum dapat menginput stok pangan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-green-50/50">
            <h2 className="text-lg font-bold text-green-900">Input Stok Baru</h2>
            <p className="text-sm text-green-700 mt-1">Tambahkan data stok untuk hari ini</p>
          </div>
          <div className="p-6">
            <form action={addStok} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Komoditas</label>
                <select
                  name="id_komoditas"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white"
                >
                  <option value="">-- Pilih Komoditas --</option>
                  {komoditasList.map((item) => (
                    <option key={item.id_komoditas} value={item.id_komoditas}>
                      {item.nama_pangan} ({item.satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Stok Masuk</label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    name="jumlah_stok"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Contoh: 100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Satuan</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Jual / Satuan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    type="number"
                    name="harga_jual"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Contoh: 15000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
              >
                <Plus className="w-5 h-5" />
                Tambah Stok
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              Riwayat Input Hari Ini
            </h2>
          </div>
          
          <div className="p-0 overflow-x-auto">
            {transactionsToday.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komoditas</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stok</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactionsToday.map((trx) => (
                    <tr key={trx.id_transaksi.toString()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(trx.tanggal_input).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trx.komoditas.nama_pangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {trx.jumlah_stok} {trx.komoditas.satuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                        Rp {trx.harga_jual.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <form action={deleteStok}>
                          <input type="hidden" name="id_transaksi" value={trx.id_transaksi.toString()} />
                          <button type="submit" className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Belum ada data stok yang diinput hari ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
