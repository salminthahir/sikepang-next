import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* Left side - Login Form Container */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Right side - Background Image */}
      <div className="hidden lg:block lg:w-7/12 relative">
        <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply z-10" />
        <Image 
          src="/images/ternate-drone.png" 
          alt="Drone View of Kota Ternate" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-10 left-10 z-20 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">SiKepang Ternate</h2>
          <p className="text-lg font-medium opacity-90 drop-shadow-md">
            Sistem Informasi Ketahanan Pangan terpadu untuk memantau stabilitas harga dan stok pangan di Kota Ternate.
          </p>
        </div>
      </div>
    </div>
  )
}
