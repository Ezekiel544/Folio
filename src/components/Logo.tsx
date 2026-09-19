import type { CSSProperties } from "react";

type LogoProps = {
  size?: number;
  style?: CSSProperties;
  alt?: string;
};

export default function Logo({
  size = 50,
  style,
  alt = "Folio",
}: LogoProps) {
  return (
    <img
      src="/folio-logo.png"
      alt={alt}
      width={300}
      height={400}
      style={{
        width: 180,
        height: 60,
        objectFit: "cover",
        borderRadius: Math.round(size * 0.22),
        display: "block",
        ...style,
      }}
    />
  );
}