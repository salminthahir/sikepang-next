import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Package, Save } from "lucide-react"

export const dynamic = 'force-dynamic'

async function updateProfil(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const id_user = parseInt(session.user.id)
  const nama_usaha = formData.get("nama_usaha") as string
  const kategori_usaha = formData.get("kategori_usaha") as "Distributor" | "Penyosoh" | "Pasar" | "Petani"
  const alamat = formData.get("alamat") as string
  const kontak_hp = formData.get("kontak_hp") as string
  const latitude = parseFloat(formData.get("latitude") as string)
  const longitude = parseFloat(formData.get("longitude") as string)

  await prisma.profilMitra.upsert({
    where: { id_user },
    update: {
      nama_usaha,
      kategori_usaha,
      alamat,
      kontak_hp,
      latitude: isNaN(latitude) ? null : latitude,
      longitude: isNaN(longitude) ? null : longitude,
      last_update: new Date(),
    },
    create: {
      id_user,
      nama_usaha,
      kategori_usaha,
      alamat,
      kontak_hp,
      latitude: isNaN(latitude) ? null : latitude,
      longitude: isNaN(longitude) ? null : longitude,
      last_update: new Date(),
    }
  })

  revalidatePath("/mitra/profil")
  revalidatePath("/mitra/dashboard")
}

export default async function ProfilMitraPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id_user: parseInt(session.user.id) },
    include: { profil_mitra: true }
  })

  const profil = user?.profil_mitra

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Usaha</h1>
          <p className="text-gray-600 mt-1">Kelola informasi usaha dan titik lokasi distribusi Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Data Profil</h2>
            <p className="text-sm text-gray-500">Formulir informasi mitra pangan</p>
          </div>
        </div>

        <div className="p-6">
          <form action={updateProfil} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Usaha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Usaha / Distributor <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama_usaha"
                  defaultValue={profil?.nama_usaha || ""}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Mitra <span className="text-red-500">*</span></label>
                <select
                  name="kategori_usaha"
                  defaultValue={profil?.kategori_usaha || "Pasar"}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all bg-white"
                >
                  <option value="Distributor">Distributor / Agen Besar</option>
                  <option value="Pasar">Pedagang Pasar / Retail</option>
                  <option value="Penyosoh">Penyosoh Beras</option>
                  <option value="Petani">Petani / Kelompok Tani</option>
                </select>
              </div>

              {/* Kontak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kontak / No. HP <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="kontak_hp"
                  defaultValue={profil?.kontak_hp || ""}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              {/* Alamat */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap <span className="text-red-500">*</span></label>
                <textarea
                  name="alamat"
                  rows={3}
                  defaultValue={profil?.alamat || ""}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                ></textarea>
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude (GPS)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  defaultValue={profil?.latitude || ""}
                  placeholder="Contoh: 0.803"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude (GPS)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  defaultValue={profil?.longitude || ""}
                  placeholder="Contoh: 127.325"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
