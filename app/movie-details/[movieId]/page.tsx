import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Routes } from "@/lib/routes";
import { ImageWithDataUrl } from "@/components/image-with-data-url";
import { getReadableDate, getTrailerId } from "@/lib/utils";
import { BackButtonWithText } from "@/components/back-button-with-text";
import { BudgetChart } from "@/components/budget-chart";
import { Badge } from "@/components/ui/badge";
import imdbLogo from "../../../public/imdb-logo.png";
import { CastTable } from "@/components/tables/cast-table";
import { getBase64 } from "@/lib/get-base-64";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrewTable } from "@/components/tables/crew-table";
import { getMovieDetails } from "@/lib/tmdb/get-movie-details";
import { ImageWithFallback } from "@/components/image-with-fallback";

type MovieSearchPageProps = {
  params: typeof Routes.movieDetails.params;
};
export default async function Page({ params }: MovieSearchPageProps) {
  const movieDetails = await getMovieDetails({ movieId: params.movieId });
  const readableDate = getReadableDate(movieDetails?.release_date);
  const trailerId = getTrailerId(movieDetails?.videos.results);

  const castProfilePaths =
    movieDetails?.credits.cast.map((castMember) => castMember.profile_path) ||
    [];

  const castProfilePathPromises = castProfilePaths.map((profilePath) =>
    getBase64(`https://image.tmdb.org/t/p/w92/${profilePath}` || ""),
  );
  const castBlurDataURLs = await Promise.all(castProfilePathPromises);

  const crewProfilePaths =
    movieDetails?.credits.crew.map((crewMember) => crewMember.profile_path) ||
    [];

  const crewProfilePathPromises = crewProfilePaths.map((profilePath) =>
    getBase64(`https://image.tmdb.org/t/p/w92/${profilePath}` || ""),
  );
  const crewBlurDataURLs = await Promise.all(crewProfilePathPromises);

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {movieDetails && (
        <div className="mx-auto grid w-full auto-rows-max gap-4">
          <BackButtonWithText />
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle as="h1">{movieDetails.title}</CardTitle>
                    <p className="dark:text-primary">
                      {
                        movieDetails.credits.crew.find(
                          (person) => person.job.toLowerCase() === "director",
                        )?.name
                      }
                      {movieDetails.production_countries.length > 0 &&
                        " | " + movieDetails.production_countries[0].name}
                    </p>
                    <CardDescription>
                      {readableDate && `${readableDate} | `}
                      {movieDetails.runtime !== 0 && `${movieDetails.runtime}m`}
                    </CardDescription>
                    <CardDescription>{movieDetails.tagline}</CardDescription>
                    <div className="mt-2 flex gap-x-2">
                      {movieDetails.genres.map((genre) => (
                        <Badge key={genre.id}>{genre.name}</Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h2>Overview:</h2>
                      <blockquote className="text-balance border-l-2 border-primary pl-6 italic">
                        {movieDetails.overview}
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-between gap-y-2 sm:flex-row">
                  <div className="flex gap-4">
                    {movieDetails.production_companies
                      .filter((company) => Boolean(company.logo_path))
                      .map((company) => (
                        <div key={company.id} className="relative size-14">
                          <ImageWithDataUrl
                            alt={company.name}
                            src={`https://image.tmdb.org/t/p/w500/${company.logo_path}`}
                            className="object-contain grayscale dark:invert"
                            fill
                            sizes="auto"
                          />
                        </div>
                      ))}
                  </div>
                  {movieDetails.imdb_id && (
                    <Link
                      className="outline-ring hover:opacity-30"
                      href={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                    >
                      <Image
                        src={imdbLogo}
                        alt="Imdb Logo"
                        sizes={"auto"}
                        className="size-10 self-end grayscale dark:invert"
                      />
                    </Link>
                  )}
                </CardFooter>
              </Card>
              {trailerId && (
                <Card>
                  <CardContent className="pt-6">
                    <iframe
                      title={`Trailer for ${movieDetails.title}`}
                      src={`https://www.youtube.com/embed/${trailerId}`}
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="cast">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="cast">Cast</TabsTrigger>
                      <TabsTrigger value="crew">Crew</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cast">
                      <CastTable
                        cast={movieDetails.credits.cast}
                        castBlurDataURLs={castBlurDataURLs}
                      />
                    </TabsContent>
                    <TabsContent value="crew">
                      <CrewTable
                        cast={movieDetails.credits.crew.sort(
                          (a, b) => b.popularity - a.popularity,
                        )}
                        castBlurDataURLs={crewBlurDataURLs}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden">
                <CardContent className="pt-6">
                  <ImageWithDataUrl
                    alt={`Poster of ${movieDetails.title}`}
                    className="aspect-movie-poster h-auto w-full rounded-md object-cover"
                    src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                    width={300}
                    height={444}
                    priority
                  />
                </CardContent>
              </Card>
              {movieDetails.budget > 0 && movieDetails.revenue > 0 && (
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>Budget </CardTitle>
                  </CardHeader>
                  <CardContent className=" h-60 w-full">
                    <BudgetChart
                      budget={movieDetails.budget}
                      revenue={movieDetails.revenue}
                    />
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Watch Providers</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-4 gap-y-2">
                  {movieDetails["watch/providers"].results.US.flatrate.map(
                    (provider) => (
                      <div
                        key={provider.provider_id}
                        className="relative aspect-square h-10"
                      >
                        <ImageWithFallback
                          alt={`Logo for ${provider.provider_name}`}
                          src={`https://image.tmdb.org/t/p/w92/${provider.logo_path}`}
                          placeholder="blur"
                          blurDataURL={
                            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA7AGkDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDAQQG/8QAGhABAQEBAQEBAAAAAAAAAAAAAAECEhEDE//EABgBAQEBAQEAAAAAAAAAAAAAAAECAAME/8QAFxEBAQEBAAAAAAAAAAAAAAAAABEBEv/aAAwDAQACEQMRAD8A9Oys9Za8L0xlJo1pNVoqEpKa0lpgAhfRKYVZT5RlUzWK0PEpTSsIoPS+j0phOmdJ9M6aOvKl0TWi3SetmGG1pO6Lrad2YmKdDpG7HbQOiaPnTmmzzbRWY6po805Zs820VHR0Okeh0YOSdsu0Oy3a+XRa7T1tK7T19GidV1sl2jr6J36NEavdjtzfo2bMZ1TZ5tyTZ5s8qx1zZ5tyzZps8rx1dt7c3Y7bkl6LdMLVxDNaT1puktJ3BrNbTuxolCTdtmkjQ4cWmlM6QyplcUtNHmkoeGFTodFDM//Z"
                          }
                          sizes="auto"
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-4 gap-y-2">
                  {movieDetails.keywords.keywords.map((keyword) => (
                    <span key={keyword.id}>{keyword.name}</span>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Product</Button>
          </div>
        </div>
      )}
    </main>
  );
}
