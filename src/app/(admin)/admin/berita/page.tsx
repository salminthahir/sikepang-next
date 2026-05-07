import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { FileText, Plus, Trash2, Edit } from "lucide-react"

export const dynamic = 'force-dynamic'

async function addBerita(formData: FormData) {
  "use server"
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const judul_berita = formData.get("judul_berita") as string
  const isi_berita = formData.get("isi_berita") as string
  const is_published = formData.get("is_published") === "on"
  // Generate slug from judul
  const slug = judul_berita.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  await prisma.berita.create({
    data: {
      judul: judul_berita,
      slug: slug,
      isi: isi_berita,
      gambar: null,
      penulis: session.user.name || "Admin",
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  
  revalidatePath("/admin/berita")
}

async function deleteBerita(formData: FormData) {
  "use server"
  const id = parseInt(formData.get("id_berita") as string)
  
  await prisma.berita.delete({
    where: { id }
  })
  
  revalidatePath("/admin/berita")
}

export default async function AdminBeritaPage() {
  const berita = await prisma.berita.findMany({
    orderBy: { created_at: 'desc' }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Berita & Informasi</h1>
        <p className="text-gray-600 mt-1">Sampaikan informasi terkini terkait kebijakan pangan ke publik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-indigo-50/50">
              <h2 className="text-lg font-bold text-indigo-900">Tulis Berita Baru</h2>
            </div>
            <div className="p-6">
              <form action={addBerita} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul Berita</label>
                  <input
                    type="text"
                    name="judul_berita"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Masukkan judul informasi..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Isi Konten</label>
                  <textarea
                    name="isi_berita"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Tulis informasi selengkapnya di sini..."
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="is_published"
                    name="is_published"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                    Langsung Publikasikan (Publish)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Simpan & Tulis Berita
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
                <FileText className="w-5 h-5 text-gray-500" />
                Daftar Berita ({berita.length})
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul & Waktu</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {berita.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">{item.judul}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ditulis oleh {item.penulis} pada {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Published</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <form action={deleteBerita}>
                          <input type="hidden" name="id_berita" value={item.id} />
                          <button type="submit" className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {berita.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        Belum ada berita yang dipublikasikan.
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
