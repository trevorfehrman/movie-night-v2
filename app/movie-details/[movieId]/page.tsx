import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Routes } from "@/lib/routes";
import { getMovieDetails } from "@/lib/tmdb/movies";
import { ImageWithDataUrl } from "@/components/image-with-data-url";
import { getReadableDate, getTrailerId } from "@/lib/utils";
import { BackButtonWithText } from "@/components/back-button-with-text";
import { BudgetChart } from "@/components/budget-chart";

type MovieSearchPageProps = {
  params: typeof Routes.movieDetails.params;
};
export default async function Page({ params }: MovieSearchPageProps) {
  const movieDetails = await getMovieDetails({ movieId: params.movieId });
  const readableDate = getReadableDate(movieDetails?.release_date);
  const trailerId = getTrailerId(movieDetails?.videos.results);

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {movieDetails && (
        <div className="mx-auto grid w-full auto-rows-max gap-4">
          <BackButtonWithText />
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
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
                    </p>
                    <CardDescription>
                      {readableDate && `${readableDate} | `}
                      {movieDetails.runtime !== 0 && `${movieDetails.runtime}m`}
                    </CardDescription>
                    <CardDescription>{movieDetails.tagline}</CardDescription>
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
                <CardFooter>
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
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger
                          id="category"
                          aria-label="Select category"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="subcategory">
                        Subcategory (optional)
                      </Label>
                      <Select>
                        <SelectTrigger
                          id="subcategory"
                          aria-label="Select subcategory"
                        >
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t-shirts">T-Shirts</SelectItem>
                          <SelectItem value="hoodies">Hoodies</SelectItem>
                          <SelectItem value="sweatshirts">
                            Sweatshirts
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardContent className="pt-6">
                  <ImageWithDataUrl
                    alt="Product image"
                    className="aspect-movie-poster h-auto w-full rounded-md object-cover"
                    src={`https://image.tmdb.org/t/p/w342/${movieDetails.poster_path}`}
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
                  <CardTitle>Archive Product</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="secondary">
                    Archive Product
                  </Button>
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
