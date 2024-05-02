import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MovieDetails, getMovieDetails } from "./tmdb/get-movie-details";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadableDate(date: string) {
  if (!date) return;

  try {
    const dateObj = new Date(date);
    return date
      ? new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(dateObj)
      : "";
  } catch (e) {
    console.error(e);
  }
}

export function getReadableDateTime(date: string) {
  try {
    const dateObj = new Date(date);
    return date
      ? new Intl.DateTimeFormat("en-US", {
          // year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour time without AM/PM
        }).format(dateObj)
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

type CrewMember = MovieDetails["credits"]["crew"][number];

type CrewMap = {
  director?: CrewMember;
  directorOfPhotography?: CrewMember;
  editors: CrewMember[];
  writers: CrewMember[];
  producers: CrewMember[];
  composer?: CrewMember;
};

export function createCrewMap(crew?: MovieDetails["credits"]["crew"]) {
  if (!crew) return;

  return crew.reduce(
    (acc, person) => {
      if (person.job.toLowerCase() === "director") {
        acc.director = person;
      } else if (person.job.toLowerCase() === "director of photography") {
        acc.directorOfPhotography = person;
      } else if (person.job.toLowerCase() === "editor") {
        acc.editors.push(person);
      } else if (
        person.job.toLowerCase() === "writer" ||
        person.job.toLowerCase() === "screenplay"
      ) {
        acc.writers.push(person);
      } else if (person.job.toLowerCase() === "producer") {
        acc.producers.push(person);
      } else if (person.job.toLowerCase() === "original music composer") {
        acc.composer = person;
      }
      return acc;
    },
    {
      director: undefined,
      directorOfPhotography: undefined,
      editors: [],
      writers: [],
      producers: [],
      composer: undefined,
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

  if (watchProviders.results.US?.flatrate) {
    shouldShowFlatRateProviders = watchProviders.results.US.flatrate.length > 0;
  }

  if (watchProviders.results.US?.rent) {
    shouldShowRentProviders = watchProviders.results.US.rent.length > 0;
  }

  if (watchProviders.results.US?.buy) {
    shouldShowBuyProviders = watchProviders.results.US.buy.length > 0;
  }

  return (
    shouldShowFlatRateProviders ||
    shouldShowRentProviders ||
    shouldShowBuyProviders
  );
}
