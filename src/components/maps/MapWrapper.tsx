"use client"

import dynamic from "next/dynamic"
import { MitraLocation } from "./SebaranMap"

const SebaranMap = dynamic(() => import("./SebaranMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center border border-gray-200">
      <p className="text-gray-500 font-medium">Memuat Peta...</p>
    </div>
  )
})

export default function MapWrapper({ data }: { data: MitraLocation[] }) {
  return <SebaranMap data={data} />
}
