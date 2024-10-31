import Image from "next/image";
import Link from "next/link";
import imdbLogo from "@/public/imdb-logo.png";
import { BackButtonWithText } from "@/components/back-button-with-text";
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
import { getTalentDetails } from "@/lib/tmdb/get-talent-details";
import { ImageWithDataUrl } from "@/components/image-with-data-url";
import { TalentCastTable } from "@/components/tables/talent-cast-table";
import { TalentCrewTable } from "@/components/tables/talent-crew-table";

type TalentDetailsPageProps = {
  params: Promise<typeof Routes.talentDetails.params>;
};
export default async function Page({ params }: TalentDetailsPageProps) {
  const { talentId } = await params;
  const talentDetails = await getTalentDetails({ talentId });
  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {talentDetails && (
        <div className="mx-auto grid w-full auto-rows-max gap-4">
          <BackButtonWithText />
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <div>
                    <div className="mb-2 flex justify-between sm:m-0">
                      <CardTitle as="h1">{talentDetails.name}</CardTitle>
                    </div>
                    <p className="dark:text-primary">
                      {talentDetails.place_of_birth}
                    </p>
                    <CardDescription>
                      {talentDetails.birthday &&
                        `Born: ${talentDetails.birthday}`}
                      {talentDetails.deathday &&
                        `Died: ${talentDetails.deathday}`}
                    </CardDescription>
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-4">
                      {talentDetails.also_known_as &&
                        talentDetails.also_known_as.map((alias) => (
                          <Badge className="min-w-fit" key={alias}>
                            {alias}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h2>Biography:</h2>
                      <blockquote className="text-balance">
                        {talentDetails.biography}
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {talentDetails.imdb_id && (
                    <Link
                      className="outline-ring hover:opacity-30"
                      href={`https://www.imdb.com/name/${talentDetails.imdb_id}`}
                    >
                      <Image
                        src={imdbLogo}
                        alt="Imdb Logo"
                        sizes={"auto"}
                        className="size-10 grayscale dark:invert"
                      />
                    </Link>
                  )}
                </CardFooter>
              </Card>
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
                      <TalentCastTable
                        talentCast={talentDetails.movie_credits.cast}
                      />
                    </TabsContent>
                    <TabsContent value="crew">
                      <TalentCrewTable
                        talentCrew={talentDetails.movie_credits.crew}
                      />
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="overflow-hidden">
                <CardContent className="pt-6">
                  <ImageWithDataUrl
                    alt={`Poster of ${talentDetails.name}`}
                    className="aspect-movie-poster h-auto w-full rounded-md object-cover"
                    src={`https://image.tmdb.org/t/p/w500/${talentDetails.profile_path}`}
                    width={300}
                    height={444}
                    priority
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
