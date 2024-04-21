import type { ImageProps } from "next/image";
import { getBase64 } from "@/lib/get-base-64";
import { ImageWithFallback } from "./image-with-fallback";
import { planescapeDataURL } from "@/lib/constants";
export async function ImageWithDataUrl(props: ImageProps) {
  const { src } = props;

  const blurDataURL = await getBase64(src);

  return (
    <ImageWithFallback
      {...props}
      placeholder="blur"
      blurDataURL={blurDataURL || planescapeDataURL}
    />
  );
}
