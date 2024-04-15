import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getMovieDetails } from "./tmdb/get-movie-details";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadableDate(release_date?: string) {
  if (!release_date) return;

  try {
    const date = new Date(release_date);
    return date
      ? new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date)
      : "";
  } catch (e) {
    console.error(e);
  }
}

type Videos = NonNullable<
  Awaited<ReturnType<typeof getMovieDetails>>
>["videos"]["results"];

export function getTrailerId(videos?: Videos) {
  if (!videos) return;

  const officialTrailerId = videos.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true,
  )?.key;

  if (officialTrailerId) return officialTrailerId;

  const backupTrailerId = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  )?.key;

  if (backupTrailerId) return backupTrailerId;

  return undefined;
}
