import Image from "next/image";

interface BrandLogoProps {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export default function BrandLogo({ compact = false, inverse = false, className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/satu-kenangan-logo-stacked.svg"
      alt="Satu Kenangan"
      width={400}
      height={400}
      priority
      className={`${compact ? "h-20 w-20" : "h-32 w-32"} object-contain ${inverse ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
