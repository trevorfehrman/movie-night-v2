import { BackButtonWithText } from "@/components/back-button-with-text";
import { ImageWithDataUrl } from "@/components/image-with-data-url";
import { MovieNightTable } from "@/components/tables/movie-night-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { Routes } from "@/lib/routes";

type RouzerDetailsPageProps = {
  params: typeof Routes.rouzerDetails.params;
};
export default async function Page({ params }: RouzerDetailsPageProps) {
  const rouzerDetails = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, params.rouzerId),
  });

  const rouzerMovies = await db.query.movies.findMany({
    where: (movie, { eq }) => eq(movie.userId, params.rouzerId),
    with: {
      user: {
        columns: {
          firstName: true,
        },
      },
    },
  });

  const poolNickNameMap = {
    trevor: {
      alias: "The Sniper",
      description: "One shot, one kill",
      biography:
        "Raised by a pack of sniper wolves, he learned to shoot before he could walk.",
    },
    tony: {
      alias: "The Surgeon",
      description: `"I just need to make one little cut.  Don't worry, you won't feel a thing."`,
      biography: "From the mean streets of the ER to the mean streets of life.",
    },
    andy: {
      alias: "The Weasel",
      description: "Uh-oh.  Looks like we got a weasel on our hands.",
      biography: "Half man, half mad man, all weasel.",
    },
    meghan: {
      alias: "The Girl",
      description: "Don't underestimate her just because she's a girl.",
      biography: "???",
    },
    renee: {
      alias: "The Velvet Glove",
      description: "A soft touch, but a hard punch.",
      biography:
        "Trained in the art of the velvet glove by characters from Dangerous Liaisons.",
    },
    steve: {
      alias: "The Dancer",
      description: "The dancer glides across the pool hall like a phantom.",
      biography:
        "Was taught the cruel lessons of life's ballet before he was 5.  It was dance or die.  He chose dance.",
    },
  } as const;

  type PoolNickname = keyof typeof poolNickNameMap;

  function isPoolNickName(firstName: string): firstName is PoolNickname {
    return firstName in poolNickNameMap;
  }

  function getPoolPersonaDetails(firstName: string) {
    const sanitizedFirstName = firstName.toLowerCase();
    if (isPoolNickName(sanitizedFirstName)) {
      return poolNickNameMap[sanitizedFirstName];
    }
    return {
      alias: "Unknown",
      description: "Who is this person?",
      biography: "What's up with them?",
    };
  }

  return (
    <main className="grid w-full max-w-screen-2xl flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div>
        {rouzerDetails && (
          <div className="mx-auto grid w-full auto-rows-max gap-4">
            <BackButtonWithText />
            <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <div>
                      <div className="mb-2 flex justify-between sm:m-0">
                        <CardTitle as="h1">{rouzerDetails.firstName}</CardTitle>
                      </div>
                      <p className="dark:text-primary">
                        {getPoolPersonaDetails(rouzerDetails.firstName).alias}
                      </p>
                      <CardDescription>
                        {
                          getPoolPersonaDetails(rouzerDetails.firstName)
                            .description
                        }
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h2>Biography:</h2>
                        <blockquote className="text-balance">
                          {
                            getPoolPersonaDetails(rouzerDetails.firstName)
                              .biography
                          }
                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <MovieNightTable movies={rouzerMovies} />
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card className="overflow-hidden">
                  <CardContent className="pt-6">
                    <ImageWithDataUrl
                      alt={`Poster of ${rouzerDetails.firstName}`}
                      className="aspect-movie-poster h-auto w-full rounded-md object-cover"
                      src={rouzerDetails.imgUrl}
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
      </div>
    </main>
  );
}
