import type { CSSProperties } from "react";

export function Img({
  src,
  alt,
  className = "",
  style,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
