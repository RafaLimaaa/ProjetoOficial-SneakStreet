import Image from "next/image"

interface SneakStreetLogoProps {
  size?: number
}

export default function SneakStreetLogo({ size = 120 }: SneakStreetLogoProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image src="/logo.png" alt="SneakStreet Logo" fill className="object-contain" priority />
    </div>
  )
}
