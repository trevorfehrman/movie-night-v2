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
    <div className="aspect-movie-poster relative h-20">
      <Image
        onError={setError}
        {...props}
        alt={alt}
        src={error ? fallbackImage : src}
        sizes="auto"
        fill
        className=" rounded-md object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA7AGkDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDAQQG/8QAGhABAQEBAQEBAAAAAAAAAAAAAAECEhEDE//EABgBAQEBAQEAAAAAAAAAAAAAAAECAAME/8QAFxEBAQEBAAAAAAAAAAAAAAAAABEBEv/aAAwDAQACEQMRAD8A9Oys9Za8L0xlJo1pNVoqEpKa0lpgAhfRKYVZT5RlUzWK0PEpTSsIoPS+j0phOmdJ9M6aOvKl0TWi3SetmGG1pO6Lrad2YmKdDpG7HbQOiaPnTmmzzbRWY6po805Zs820VHR0Okeh0YOSdsu0Oy3a+XRa7T1tK7T19GidV1sl2jr6J36NEavdjtzfo2bMZ1TZ5tyTZ5s8qx1zZ5tyzZps8rx1dt7c3Y7bkl6LdMLVxDNaT1puktJ3BrNbTuxolCTdtmkjQ4cWmlM6QyplcUtNHmkoeGFTodFDM//Z"
      />
    </div>
  );
}
