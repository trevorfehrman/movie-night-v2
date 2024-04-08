"use client";
import * as React from "react";
import Image from "next/image";
import fallbackImage from "../public/next-image-fallback.webp";

export function ImageWithFallback(
  props: React.ComponentProps<typeof Image> & {
    alt: string;
  },
) {
  const { alt, src } = props;
  const [error, setError] = React.useState<React.SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <div className="relative h-[64px] w-auto">
      <Image
        onError={setError}
        loader={({ src }) => src}
        unoptimized
        {...props}
        alt={alt}
        src={error ? fallbackImage : src}
        sizes="auto"
        fill
        className=" rounded-md object-cover"
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      />
    </div>
  );
}
