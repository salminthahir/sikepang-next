import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Settings, Save } from "lucide-react"

export const dynamic = 'force-dynamic'

async function updateProfilAdmin(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const id_user = parseInt(session.user.id)
  const nama_lengkap = formData.get("nama_lengkap") as string
  const no_hp = formData.get("no_hp") as string

  await prisma.profilAdmin.upsert({
    where: { id_user },
    update: {
      nama_lengkap,
      no_hp,
    },
    create: {
      id_user,
      nama_lengkap,
      no_hp,
    }
  })

  revalidatePath("/admin/profil")
  revalidatePath("/admin/dashboard")
}

export default async function ProfilAdminPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id_user: parseInt(session.user.id) },
    include: { profil_admin: true }
  })

  const profil = user?.profil_admin

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Admin</h1>
          <p className="text-gray-600 mt-1">Kelola informasi data diri administrator.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Data Diri</h2>
            <p className="text-sm text-gray-500">Informasi akun {user?.username}</p>
          </div>
        </div>

        <div className="p-6">
          <form action={updateProfilAdmin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="nama_lengkap"
                defaultValue={profil?.nama_lengkap || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. HP / WhatsApp</label>
              <input
                type="text"
                name="no_hp"
                defaultValue={profil?.no_hp || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                Simpan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
