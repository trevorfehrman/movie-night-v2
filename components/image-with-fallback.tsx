"use client";
import * as React from "react";
import Image from "next/image";
import fallbackImage from "../public/next-image-fallback.webp";

export function ImageWithFallback(
  props: React.ComponentProps<typeof Image> & {
    height: number;
    width: number;
    src: string;
    alt: string;
    blurDataURL: string;
  },
) {
  const { alt, src, height, width, blurDataURL } = props;
  const [error, setError] = React.useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      onError={setError}
      {...props}
      alt={alt}
      src={error ? fallbackImage : src}
      height={height}
      width={width}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}
