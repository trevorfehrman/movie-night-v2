import { AddMovieButton } from "@/components/add-movie-button";
import { BackButtonWithText } from "@/components/back-button-with-text";
import { BudgetChart } from "@/components/budget-chart";
import { ImageWithDataUrl } from "@/components/image-with-data-url";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { CastTable } from "@/components/tables/cast-table";
import { CrewTable } from "@/components/tables/crew-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Routes } from "@/lib/routes";
import { getMovieDetails } from "@/lib/tmdb/get-movie-details";
import {
  createCrewMap,
  createShouldShowWatchProviders,
  getReadableDate,
  getTrailerId,
} from "@/lib/utils";
import imdbLogo from "@/public/imdb-logo.png";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

type MovieSearchPageProps = {
  params: typeof Routes.movieDetails.params;
};

export default async function Page({ params }: MovieSearchPageProps) {
  const { userId } = auth();

  const movieDetails = await getMovieDetails({ movieId: params.movieId });
  const readableDate = getReadableDate(movieDetails?.release_date);
  const trailerId = getTrailerId(movieDetails?.videos.results);

  const crewMap = createCrewMap(movieDetails?.credits.crew);

  const shouldShowWatchProviders = createShouldShowWatchProviders(
    movieDetails?.["watch/providers"],
  );

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
                    <div className="mb-2 flex justify-between sm:m-0">
                      <CardTitle as="h1">{movieDetails.title}</CardTitle>
                      {/* {userId && (
                        <AddMovieButton
                          movieDetails={movieDetails}
                          userId={userId}
                        />
                      )} */}
                    </div>
                    <p className="dark:text-primary">
                      {crewMap?.director?.name}
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
                      <CastTable cast={movieDetails.credits.cast} />
                    </TabsContent>
                    <TabsContent value="crew">
                      <CrewTable cast={movieDetails.credits.crew} />
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
              {shouldShowWatchProviders && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Watch Providers{" "}
                      <p className="text-sm dark:text-primary">
                        Powered by JustWatch
                      </p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {movieDetails["watch/providers"].results.US.flatrate && (
                      <div>
                        <p className="mb-2">Streaming</p>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails[
                            "watch/providers"
                          ].results.US.flatrate.map((provider) => (
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
                              {provider.provider_id}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {movieDetails["watch/providers"].results.US.rent && (
                      <div>
                        <p className="mb-2">Rent</p>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails["watch/providers"].results.US.rent.map(
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
                                {provider.provider_id}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {movieDetails["watch/providers"].results.US.buy && (
                      <div>
                        <p className="mb-2">Buy</p>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails["watch/providers"].results.US.buy.map(
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
                                {provider.provider_id}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
        </div>
      )}
    </main>
  );
}
