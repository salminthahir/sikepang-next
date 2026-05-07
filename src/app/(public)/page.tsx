import Link from "next/link"
import { ArrowRight, BarChart3, Map, ShoppingCart, Calendar, Megaphone } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic";

export default async function Home() {
  const beritaTerbaru = await prisma.berita.findMany({
    orderBy: { created_at: 'desc' },
    take: 5
  });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-body-bg)]">
      {/* Hero Section */}
      <section className="relative hero-gradient pt-28 pb-32 lg:pt-36 lg:pb-40 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-lg">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ letterSpacing: '-1px' }}>
              Ketahanan Pangan <span className="text-[#ffc107]">Ternate</span>
            </h1>
            <p className="text-lg md:text-xl text-green-50 opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Portal resmi pemantauan harga dan ketersediaan stok pangan Kota Ternate. Dikelola langsung oleh Dinas Ketahanan Pangan untuk memastikan stabilitas pasar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/pangan"
                className="flex items-center justify-center gap-2 bg-[#ffc107] hover:bg-[#e0a800] text-[#1a1c20] px-8 py-3.5 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-[0_8px_20px_rgba(255,193,7,0.3)]"
              >
                Cek Harga
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/sebaran"
                className="flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white border border-[rgba(255,255,255,0.3)] px-8 py-3.5 rounded-full font-semibold text-lg transition-all"
              >
                <Map className="w-5 h-5" />
                Peta Lokasi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards - Offset upwards to overlap Hero */}
      <section className="relative z-20 -mt-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="card-clean p-8 border-b-4 border-blue-500">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring Stok</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Pantau pergerakan stok komoditas dari berbagai distributor dan pasar secara real-time.
              </p>
            </div>

            <div className="card-clean p-8 border-b-4 border-green-500">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Harga Pangan</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Informasi harga jual rata-rata komoditas pokok di Kota Ternate hari ini.
              </p>
            </div>

            <div className="card-clean p-8 border-b-4 border-orange-500">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                <Map className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Peta Sebaran</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Temukan lokasi pasar, agen, dan distributor bahan pangan terdekat dari Anda.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* News / Berita Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[#155724] font-bold tracking-wider text-sm uppercase mb-2 block flex items-center gap-2">
                <Megaphone size={16} /> Update Terkini
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">Berita Ketahanan Pangan</h2>
            </div>
            <div className="hidden sm:block">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#155724] transition-colors" aria-label="Previous">
                  ←
                </button>
                <button className="w-10 h-10 rounded-full bg-[#155724] flex items-center justify-center text-white hover:bg-[#0c4128] transition-colors" aria-label="Next">
                  →
                </button>
              </div>
            </div>
          </div>

          {beritaTerbaru.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">Belum ada berita yang diterbitkan saat ini.</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {beritaTerbaru.map((berita) => (
                <div key={berita.id} className="min-w-[300px] md:min-w-[380px] max-w-[400px] snap-start flex-shrink-0 card-clean shadow-sm border border-gray-100 flex flex-col h-full group">
                  <div className="h-48 bg-gray-200 w-full overflow-hidden relative">
                    {berita.gambar ? (
                      <img src={`/uploads/berita/${berita.gambar}`} alt={berita.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <ShoppingCart size={40} className="opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#155724] flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(berita.created_at || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#155724] transition-colors">
                      {berita.judul}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                      {berita.isi?.replace(/<[^>]*>?/gm, '')}
                    </p>
                    <button className="text-[#155724] font-semibold text-sm flex items-center gap-1 mt-auto group-hover:gap-2 transition-all">
                      Baca Selengkapnya <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}
