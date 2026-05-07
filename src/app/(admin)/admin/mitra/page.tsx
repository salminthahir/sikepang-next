import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Users, Plus, Trash2, MapPin } from "lucide-react"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

async function addMitraAccount(formData: FormData) {
  "use server"
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const hashedPassword = await bcrypt.hash(password, 10)

  // Buat User
  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: 'mitra',
      status: 'aktif'
    }
  })
  
  revalidatePath("/admin/mitra")
}

async function deleteMitraAccount(formData: FormData) {
  "use server"
  const id_user = parseInt(formData.get("id_user") as string)
  
  // Karena ada relasi cascade atau kita perlu manual hapus profilnya
  // Prisma bisa di-setup dengan onDelete: Cascade
  await prisma.user.delete({
    where: { id_user }
  })
  
  revalidatePath("/admin/mitra")
}

export default async function AdminMitraPage() {
  const users = await prisma.user.findMany({
    where: { role: 'mitra' },
    include: {
      profil_mitra: true
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Mitra</h1>
        <p className="text-gray-600 mt-1">Kelola akun distributor, pasar, penyosoh, dan agen pangan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-blue-50/50">
              <h2 className="text-lg font-bold text-blue-900">Buat Akun Mitra</h2>
              <p className="text-xs text-blue-700 mt-1">Mitra akan melengkapi profil mereka setelah login.</p>
            </div>
            <div className="p-6">
              <form action={addMitraAccount} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Contoh: toko_jaya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Default</label>
                  <input
                    type="text"
                    name="password"
                    required
                    defaultValue="mitra123"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Buat Akun Baru
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
                <Users className="w-5 h-5 text-gray-500" />
                Daftar Akun Mitra ({users.length})
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usaha / Username</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id_user} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {user.profil_mitra?.nama_usaha || <span className="text-gray-400 italic">Belum Set Profil</span>}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Username: {user.username}
                        </div>
                        {user.profil_mitra?.latitude && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                            <MapPin className="w-3 h-3" /> GPS Tersedia
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.profil_mitra?.kontak_hp || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {user.profil_mitra?.kategori_usaha || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <form action={deleteMitraAccount}>
                          <input type="hidden" name="id_user" value={user.id_user} />
                          <button type="submit" className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        Belum ada akun mitra yang terdaftar.
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
