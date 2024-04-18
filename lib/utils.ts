import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MovieDetails, getMovieDetails } from "./tmdb/get-movie-details";

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

type CrewMap = {
  director?: string;
  directorOfPhotography?: string;
  editors: string[];
  writers: string[];
  producers: string[];
  composer?: string;
};

export function createCrewMap(crew?: MovieDetails["credits"]["crew"]) {
  if (!crew) return;

  return crew.reduce(
    (acc, person) => {
      if (person.job.toLowerCase() === "director") {
        acc.director = person.name;
      } else if (person.job.toLowerCase() === "director of photography") {
        acc.directorOfPhotography = person.name;
      } else if (person.job.toLowerCase() === "editor") {
        acc.editors.push(person.name);
      } else if (
        person.job.toLowerCase() === "writer" ||
        person.job.toLowerCase() === "screenplay"
      ) {
        acc.writers.push(person.name);
      } else if (person.job.toLowerCase() === "producer") {
        acc.producers.push(person.name);
      } else if (person.job.toLowerCase() === "original music composer") {
        acc.composer = person.name;
      }
      return acc;
    },
    {
      director: "",
      directorOfPhotography: "",
      editors: [],
      writers: [],
      producers: [],
      composer: "",
    } as CrewMap,
  );
}

export function createShouldShowWatchProviders(
  watchProviders?: MovieDetails["watch/providers"],
) {
  if (!watchProviders) return;
  let shouldShowFlatRateProviders;
  let shouldShowRentProviders;
  let shouldShowBuyProviders;

  if (watchProviders.results.US.flatrate) {
    shouldShowFlatRateProviders = watchProviders.results.US.flatrate.length > 0;
  }

  if (watchProviders.results.US.rent) {
    shouldShowRentProviders = watchProviders.results.US.rent.length > 0;
  }

  if (watchProviders.results.US.buy) {
    shouldShowBuyProviders = watchProviders.results.US.buy.length > 0;
  }

  return (
    shouldShowFlatRateProviders ||
    shouldShowRentProviders ||
    shouldShowBuyProviders
  );
}
