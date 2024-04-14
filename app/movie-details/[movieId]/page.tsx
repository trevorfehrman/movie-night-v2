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
import { getMovieDetails } from "@/lib/tmdb/movies";
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
              <Card x-chunk="dashboard-07-chunk-2">
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
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
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
                <Card x-chunk="dashboard-07-chunk-3">
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
              <Card x-chunk="dashboard-07-chunk-5">
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
