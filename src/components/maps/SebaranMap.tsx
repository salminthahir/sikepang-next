"use client"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

import { MapPin, MessageCircle, Package, Store } from "lucide-react"

// Custom Green Circle Marker (identik dengan CI4)
const customMarkerIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="
    width: 42px;
    height: 42px;
    background-color: #059669;
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    cursor: pointer;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/>
    </svg>
  </div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -21]
})

export type MitraLocation = {
  id: number
  nama_usaha: string | null
  kategori: string
  alamat: string | null
  lat: number
  lng: number
  kontak_hp?: string | null
}

export default function SebaranMap({ data }: { data: MitraLocation[] }) {
  useEffect(() => {
    // This is needed to fix some CSS issues with leaflet in React
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    })
  }, [])

  // Ternate Center
  const center: [number, number] = [0.7900, 127.3850]

  return (
    <div className="h-full w-full z-0 relative">
      <MapContainer 
        center={center} 
        zoom={12.5} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {data.map((mitra) => {
          const ruteLink = `https://www.google.com/maps/dir/?api=1&destination=${mitra.lat},${mitra.lng}`;
          let waLink = "";
          let cleanNumber = "";
          if (mitra.kontak_hp) {
              cleanNumber = mitra.kontak_hp.replace(/\D/g, '');
              if (cleanNumber.startsWith('0')) cleanNumber = '62' + cleanNumber.slice(1);
              waLink = `https://wa.me/${cleanNumber}?text=Halo%20${encodeURIComponent(mitra.nama_usaha || '')},%20saya%20ingin%20tanya%20stok%20pangan.`;
          }

          return (
            <Marker 
              key={mitra.id} 
              position={[mitra.lat, mitra.lng]}
              icon={customMarkerIcon}
            >
              <Popup className="custom-popup">
                <div className="min-w-[220px] font-sans">
                  <h6 className="font-bold mb-1 text-gray-900 text-sm">{mitra.nama_usaha || 'Mitra Pangan'}</h6>
                  <div className="mb-3 text-[11px] text-gray-500 leading-snug flex items-start gap-1">
                    <MapPin size={12} className="text-red-500 mt-[2px] flex-shrink-0" /> 
                    <span>{mitra.alamat || 'Alamat tidak tersedia'}</span>
                  </div>
                  <hr className="my-2 border-gray-100" />
                  <div className="grid gap-2">
                    <a href={ruteLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 !text-white text-[11px] font-bold py-1.5 px-2 rounded transition-colors" style={{textDecoration: 'none', color: 'white'}}>
                      <MapPin size={12} /> Penunjuk Rute
                    </a>
                    
                    {waLink ? (
                      <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-[#198754] hover:bg-[#157347] !text-white text-[11px] font-bold py-1.5 px-2 rounded transition-colors" style={{textDecoration: 'none', color: 'white'}}>
                        <MessageCircle size={12} /> Hubungi WhatsApp
                      </a>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-1.5 bg-gray-400 text-white text-[11px] font-bold py-1.5 px-2 rounded cursor-not-allowed">
                        <MessageCircle size={12} /> No WA Tidak Ada
                      </button>
                    )}

                    <a href={`/pangan?lokasi=${encodeURIComponent(mitra.nama_usaha || '')}`} className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[11px] font-bold py-1.5 px-2 rounded transition-colors" style={{textDecoration: 'none'}}>
                      <Package size={12} /> Cek Stok Pangan
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
