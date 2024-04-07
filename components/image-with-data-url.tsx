import Image from "next/image";
import { ImageWithFallback } from "./image-with-fallback";
import { getBase64 } from "@/lib/get-base-64";
export async function ImageWithDataUrl(
  props: React.ComponentProps<typeof Image> & {
    height: number;
    width: number;
    src: string;
    alt: string;
  },
) {
  const { alt, src, height, width } = props;

  const blurDataURL = await getBase64(src);

  return (
    <ImageWithFallback
      {...props}
      alt={alt}
      src={src}
      height={height}
      width={width}
      placeholder="blur"
      blurDataURL={
        blurDataURL ||
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      }
    />
  );
}
