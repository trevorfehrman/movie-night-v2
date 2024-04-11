import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ChevronLeft } from "lucide-react";
import { ImageWithDataUrl } from "@/components/image-with-data-url";

type MovieSearchPageProps = {
  params: typeof Routes.movieDetails.params;
};
export default async function Page({ params }: MovieSearchPageProps) {
  const movieDetails = await getMovieDetails({ movieId: params.movieId });

  let readableDate;
  try {
    const date = movieDetails ? new Date(movieDetails.release_date) : "";
    readableDate = date
      ? new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date)
      : "";
  } catch (e) {
    console.error(e);
  }

  const officialTrailerId = movieDetails?.videos.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true,
  )?.key;

  const backupTrailerId = movieDetails?.videos.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  )?.key;

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {movieDetails && (
        <div className="mx-auto grid w-full auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Movie Details:
            </h1>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle as="h2">{movieDetails.title}</CardTitle>
                    <h3 className="dark:text-primary">
                      {
                        movieDetails.credits.crew.find(
                          (person) => person.job.toLowerCase() === "director",
                        )?.name
                      }
                    </h3>
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
                      <h4>Overview:</h4>
                      <blockquote className="text-balance border-l-2 pl-6 italic dark:border-primary">
                        {movieDetails.overview}
                      </blockquote>
                    </div>
                    <div className="flex gap-4 rounded-md p-4 md:justify-end">
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
                  </div>
                </CardContent>
              </Card>
              {(officialTrailerId || backupTrailerId) && (
                <Card className="overflow-hidden">
                  <iframe
                    title={`Trailer for ${movieDetails.title}`}
                    src={`https://www.youtube.com/embed/${officialTrailerId || backupTrailerId}`}
                    allowFullScreen
                    className="aspect-video w-full"
                  />
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
                  <div className="grid gap-4">
                    <ImageWithDataUrl
                      alt="Product image"
                      className="aspect-movie-poster h-auto w-full rounded-md object-cover"
                      src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                      width={300}
                      height={444}
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
