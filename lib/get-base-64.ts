import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getPlaiceholder } from "./plaiceholder";

export async function getBase64(imgUrl: string | StaticImport) {
  if (typeof imgUrl !== "string") {
    return undefined;
  }
  try {
    const res = await fetch(imgUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch image");
    }
    const buffer = await res.arrayBuffer();
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    }
  }
}
