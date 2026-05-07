import Link from "next/link"
import { GeoAlt, TelephoneFill, EnvelopeFill, ClockFill, Facebook, Instagram, Youtube } from "react-bootstrap-icons"

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark-footer)] text-[#b0b3b8] pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1 */}
          <div className="mb-6 md:mb-0">
            <h5 className="uppercase font-bold text-[#198754] mb-4 text-lg">SiKepang Malut</h5>
            <p className="text-sm opacity-75 leading-[1.6]">
              Sistem Informasi Ketahanan Pangan (SiKepang) adalah portal resmi yang dikelola untuk memantau stabilitas harga, stok, dan distribusi bahan pokok di wilayah Maluku Utara dan Kota Ternate.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          {/* Kolom 2 */}
          <div className="mb-6 md:mb-0">
            <h5 className="uppercase font-bold text-[#198754] mb-4 text-lg">Hubungi Kami</h5>
            <ul className="space-y-4 text-sm opacity-75">
              <li className="flex items-start gap-3">
                <GeoAlt className="text-[#198754] mt-1 flex-shrink-0" size={18} />
                <span>
                  <strong>Dinas Ketahanan Pangan Kota Ternate</strong><br />
                  Jl. Jati III Permai No. 2, Kelurahan Jati,<br />
                  Kecamatan Ternate Selatan, Kota Ternate
                </span>
              </li>
              <li className="flex items-center gap-3">
                <TelephoneFill className="text-[#198754]" size={18} />
                <span>(0921) 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeFill className="text-[#198754]" size={18} />
                <span>ketahananpangan@malutprov.go.id</span>
              </li>
              <li className="flex items-center gap-3">
                <ClockFill className="text-[#198754]" size={18} />
                <span>Senin - Jumat (08:00 - 16:00 WIT)</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3 */}
          <div>
            <h5 className="uppercase font-bold text-[#198754] mb-4 text-lg">Lokasi Kantor</h5>
            <div className="rounded-lg overflow-hidden border border-gray-700 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0651324567!2d127.37854!3d0.77654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x329cad60388e6323%3A0x6e765593883a4567!2sJl.%20Jati%20III%20Permai%2C%20Kelurahan%20Jati%2C%20Ternate%20Selatan%2C%20Kota%20Ternate!5e0!3m2!1sid!2sid!4v1738550000000!5m2!1sid!2sid"
                width="100%" height="200" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div className="mt-3">
              <a href="https://www.google.com/maps/search/Dinas+Ketahanan+Pangan+Kota+Ternate/@0.77654,127.37854,15z"
                target="_blank" rel="noopener noreferrer" className="block text-center w-full border border-[#198754] text-[#198754] hover:bg-[#198754] hover:text-white transition-colors py-2 rounded text-sm font-medium">
                <GeoAlt className="inline-block mr-1" size={14} /> Buka di Google Maps
              </a>
            </div>
          </div>
          
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs opacity-50">
          <div className="text-center md:text-left mb-2 md:mb-0">
            © {new Date().getFullYear()} Dinas Ketahanan Pangan Provinsi Maluku Utara. All Rights Reserved.
          </div>
          <div className="text-center md:text-right">
            Powered by <strong>SiKepang v.2.0</strong>
          </div>
        </div>
      </div>
    </footer>
  )
}
