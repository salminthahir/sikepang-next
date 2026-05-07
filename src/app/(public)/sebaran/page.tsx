import { prisma } from "@/lib/prisma"
import MapWrapper from "@/components/maps/MapWrapper"

export const dynamic = 'force-dynamic'

export default async function SebaranPage() {
  // Fetch Mitra data that has coordinates
  const mitraList = await prisma.profilMitra.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    }
  })

  const mapData = mitraList.map(m => ({
    id: m.id_mitra,
    nama_usaha: m.nama_usaha,
    kategori: m.kategori_usaha,
    alamat: m.alamat,
    lat: m.latitude as number,
    lng: m.longitude as number,
    kontak_hp: m.kontak_hp
  }))

  return (
    <div className="relative w-full h-[calc(100vh-74px)] bg-[#f3f4f6] overflow-hidden">
      {/* Map Container - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <MapWrapper data={mapData} />
      </div>

      {/* Floating Info Panel - Desktop (Top Left) & Mobile (Bottom Slide Up) */}
      <div className="absolute top-5 left-5 w-[360px] max-h-[calc(100%-40px)] bg-white rounded-xl shadow-lg z-10 flex flex-col hidden md:flex">
        {/* Panel Head */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
          <div>
            <h5 className="font-bold text-gray-900 mb-0 text-lg">Peta Sebaran</h5>
            <p className="text-gray-500 font-medium text-xs mb-0">Kota Ternate</p>
          </div>
        </div>

        {/* Panel Body */}
        <div className="p-5 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-center">
              <div className="text-3xl font-extrabold text-[#059669] leading-none mb-1">{mitraList.length}</div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Lokasi</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 text-center">
              <div className="text-3xl font-extrabold text-[#059669] leading-none mb-1 flex justify-center items-center h-[30px]">
                <span className="w-4 h-4 bg-[#059669] rounded-full animate-ping"></span>
              </div>
              <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-[2px]">Live</div>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-3 mb-6 px-1">
            <div className="flex items-center gap-3">
              <div className="w-[15px] h-[15px] rounded-full bg-[#198754] border-2 border-white shadow-sm flex-shrink-0"></div>
              <span className="font-semibold text-gray-800 text-sm">Pasar Tradisional / Modern</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[15px] h-[15px] rounded-full bg-[#ffc107] border-2 border-white shadow-sm flex-shrink-0"></div>
              <span className="font-semibold text-gray-800 text-sm">Distributor / Toko Tani</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[15px] h-[15px] rounded-full bg-blue-500 border-2 border-white shadow-sm flex-shrink-0"></div>
              <span className="font-semibold text-gray-800 text-sm">Penyosoh Padi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Panel Warning (Simplified) */}
      <div className="md:hidden absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] z-10 p-5 transform transition-transform">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="font-bold text-gray-900 mb-0 text-lg">Peta Sebaran</h5>
            <p className="text-gray-500 font-medium text-xs mb-0">Kota Ternate</p>
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            {mitraList.length} Lokasi
          </div>
        </div>
        <div className="space-y-2 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#198754] border border-white shadow-sm flex-shrink-0"></div>
              <span className="font-medium text-gray-700 text-xs">Pasar Tradisional / Modern</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ffc107] border border-white shadow-sm flex-shrink-0"></div>
              <span className="font-medium text-gray-700 text-xs">Distributor / Toko Tani</span>
            </div>
        </div>
      </div>

    </div>
  )
}
