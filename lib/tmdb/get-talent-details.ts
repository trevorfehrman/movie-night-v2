import "server-only";
import { z } from "zod";
import { options } from "./movies";

const TalentDetailsPersonSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullish(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullish(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
  credit_id: z.string(),
});

const TalentDetailsCastSchema = TalentDetailsPersonSchema.merge(
  z.object({
    character: z.string(),
    order: z.number(),
  }),
);

const TalentDetailsCrewSchema = TalentDetailsPersonSchema.merge(
  z.object({
    department: z.string(),
    job: z.string(),
  }),
);

const TalentDetailsSchema = z.object({
  adult: z.boolean(),
  also_known_as: z.array(z.string()).nullish(),
  biography: z.string().nullish(),
  birthday: z.string().nullish(),
  deathday: z.string().nullish(),
  gender: z.number().nullish(),
  homepage: z.union([z.string().url(), z.null()]),
  id: z.number(),
  imdb_id: z.string(),
  known_for_department: z.string().nullish(),
  name: z.string(),
  place_of_birth: z.string().nullish(),
  popularity: z.number().nullish(),
  profile_path: z.string().nullish(),
  movie_credits: z.object({
    cast: z.array(TalentDetailsCastSchema),
    crew: z.array(TalentDetailsCrewSchema),
  }),
});

export type TalentDetails = z.infer<typeof TalentDetailsSchema>;

export async function getTalentDetails({ talentId }: { talentId?: string }) {
  if (!talentId) {
    return;
  }

  const talentDetailsUrl = new URL(
    `https://api.themoviedb.org/3/person/${talentId}?language=en-US`,
  );

  talentDetailsUrl.searchParams.set("append_to_response", "movie_credits");

  const response = await fetch(talentDetailsUrl, {
    ...options,
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();

  try {
    const validatedData = TalentDetailsSchema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Error validating data", error.issues);
    }
  }
}
