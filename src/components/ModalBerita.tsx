"use client"
import { useState, useEffect } from "react"
import { X, Megaphone, Calendar } from "lucide-react"

interface Berita {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  createdAt: string;
}

export default function ModalBerita({ berita }: { berita: Berita | null }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show modal if there's news and user hasn't closed it in this session
    if (berita) {
      const hasSeen = sessionStorage.getItem(`seen_berita_${berita.id}`)
      if (!hasSeen) {
        // Small delay for better UX
        const timer = setTimeout(() => setIsOpen(true), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [berita])

  const handleClose = () => {
    if (berita) {
      sessionStorage.setItem(`seen_berita_${berita.id}`, 'true')
    }
    setIsOpen(false)
  }

  if (!isOpen || !berita) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-[#155724] px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Megaphone size={20} className="text-[#ffc107]" />
            Pengumuman Terbaru
          </h3>
          <button 
            onClick={handleClose}
            className="text-green-100 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {berita.gambar && (
          <div className="w-full h-48 bg-gray-100">
            <img 
              src={`/uploads/berita/${berita.gambar}`} 
              alt="Berita" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="text-xs font-bold text-[#198754] flex items-center gap-1 mb-2">
            <Calendar size={14} />
            {new Date(berita.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-3">{berita.judul}</h4>
          
          <div 
            className="text-gray-600 text-sm leading-relaxed max-h-48 overflow-y-auto mb-6 pr-2 custom-scrollbar"
            dangerouslySetInnerHTML={{ __html: berita.isi }}
          />

          <div className="flex justify-end">
            <button 
              onClick={handleClose}
              className="bg-[#198754] hover:bg-[#157347] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  )
}
