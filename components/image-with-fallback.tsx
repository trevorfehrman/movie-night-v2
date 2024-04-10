"use client";
import * as React from "react";
import Image from "next/image";
import type { ImageProps } from "next/image";
import fallbackImage from "../public/next-image-fallback.webp";

export function ImageWithFallback(props: ImageProps) {
  const { src } = props;
  const [error, setError] = React.useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image onError={setError} {...props} src={error ? fallbackImage : src} />
  );
}
