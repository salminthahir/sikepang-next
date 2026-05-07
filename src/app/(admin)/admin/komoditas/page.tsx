import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Package, Plus, Trash2, Edit } from "lucide-react"

export const dynamic = 'force-dynamic'

async function addKomoditas(formData: FormData) {
  "use server"
  const nama_pangan = formData.get("nama_pangan") as string
  const satuan = formData.get("satuan") as string

  await prisma.msKomoditas.create({
    data: { nama_pangan, satuan }
  })
  revalidatePath("/admin/komoditas")
}

async function deleteKomoditas(formData: FormData) {
  "use server"
  const id_komoditas = parseInt(formData.get("id_komoditas") as string)
  
  await prisma.msKomoditas.delete({
    where: { id_komoditas }
  })
  revalidatePath("/admin/komoditas")
}

export default async function AdminKomoditasPage() {
  const komoditas = await prisma.msKomoditas.findMany({
    orderBy: { nama_pangan: 'asc' }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Komoditas</h1>
        <p className="text-gray-600 mt-1">Manajemen data master komoditas pangan Kota Ternate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-green-50/50">
              <h2 className="text-lg font-bold text-green-900">Tambah Komoditas</h2>
            </div>
            <div className="p-6">
              <form action={addKomoditas} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pangan</label>
                  <input
                    type="text"
                    name="nama_pangan"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Contoh: Beras Medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
                  <input
                    type="text"
                    name="satuan"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Contoh: Kg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Simpan Data
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
                <Package className="w-5 h-5 text-gray-500" />
                Daftar Komoditas ({komoditas.length})
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pangan</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {komoditas.map((item) => (
                    <tr key={item.id_komoditas} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{item.id_komoditas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nama_pangan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {item.satuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <form action={deleteKomoditas}>
                          <input type="hidden" name="id_komoditas" value={item.id_komoditas} />
                          <button type="submit" className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {komoditas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        Belum ada data komoditas pangan.
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
