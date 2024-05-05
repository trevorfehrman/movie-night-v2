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
import { planescapeDataURL } from "@/lib/constants";
import { Routes } from "@/lib/routes";
import { getMovieDetails } from "@/lib/tmdb/get-movie-details";
import {
  createCrewMap,
  createShouldShowWatchProviders,
  getReadableDate,
  getTrailerId,
} from "@/lib/utils";
import imdbLogo from "@/public/imdb-logo.png";
import { Protect } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

type MovieSearchPageProps = {
  params: typeof Routes.movieDetails.params;
};

export default async function Page({ params }: MovieSearchPageProps) {
  const { userId } = auth();

  const movieDetails = await getMovieDetails({ movieId: params.movieId });
  const readableDate = getReadableDate(movieDetails?.release_date ?? "");
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
                <CardHeader className="mb-4 bg-muted/50">
                  <div className="mb-2 flex justify-between sm:m-0">
                    <CardTitle as="h1">{movieDetails.title}</CardTitle>
                    <Protect permission="org:movie:create">
                      {userId && (
                        <AddMovieButton
                          movieDetails={movieDetails}
                          userId={userId}
                        />
                      )}
                    </Protect>
                  </div>
                  <p className="dark:text-primary">
                    <Link
                      className="hover:underline"
                      href={`/talent-details/${crewMap?.director?.id}`}
                    >
                      {crewMap?.director?.name}
                    </Link>
                    {movieDetails.production_countries.length > 0 &&
                      " | " + movieDetails.production_countries[0].name}
                  </p>
                  <CardDescription>
                    {readableDate && `${readableDate} | `}
                    {movieDetails.runtime !== 0 && `${movieDetails.runtime}m`}
                  </CardDescription>
                  <CardDescription>{movieDetails.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="mt-2 flex gap-x-2">
                      {movieDetails.genres.map((genre) => (
                        <Badge key={genre.id}>{genre.name}</Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h2>Overview:</h2>
                      <blockquote className="text-balance border-l-2 border-primary pl-6 italic">
                        {movieDetails.overview}
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-between gap-y-2 bg-muted/50 pt-6 sm:flex-row">
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
                <Tabs defaultValue="cast">
                  <CardHeader className="flex flex-col gap-y-4 bg-muted/50">
                    <CardTitle>Credits</CardTitle>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="cast">Cast</TabsTrigger>
                      <TabsTrigger value="crew">Crew</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent className="p-0">
                    <TabsContent value="cast">
                      <CastTable cast={movieDetails.credits.cast} />
                    </TabsContent>
                    <TabsContent value="crew">
                      <CrewTable cast={movieDetails.credits.crew} />
                    </TabsContent>
                  </CardContent>
                </Tabs>
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
                  <CardHeader className="bg-muted/50">
                    <CardTitle>Budget </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4 h-60 w-full">
                    <BudgetChart
                      budget={movieDetails.budget}
                      revenue={movieDetails.revenue}
                    />
                  </CardContent>
                  <CardFooter className="min-h-8 bg-muted/50" />
                </Card>
              )}
              {shouldShowWatchProviders && (
                <Card>
                  <CardHeader className="bg-muted/50">
                    <CardTitle>
                      Watch Providers{" "}
                      <p className="text-sm dark:text-primary">
                        Powered by JustWatch
                      </p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-4 flex flex-col gap-4">
                    {movieDetails["watch/providers"].results.US?.flatrate && (
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
                                blurDataURL={planescapeDataURL}
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
                    {movieDetails["watch/providers"].results.US?.rent && (
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
                                  blurDataURL={planescapeDataURL}
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

                    {movieDetails["watch/providers"].results.US?.buy && (
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
                                  blurDataURL={planescapeDataURL}
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
                  <CardFooter className="min-h-8 bg-muted/50" />
                </Card>
              )}

              <Card>
                <CardHeader className="bg-muted/50">
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {movieDetails.keywords.keywords.map((keyword) => (
                    <span key={keyword.id}>{keyword.name}</span>
                  ))}
                </CardContent>
                <CardFooter className="min-h-8 bg-muted/50" />
              </Card>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
