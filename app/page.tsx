import { db } from "@/db";

export default async function Home() {
  const user = await db.query.users.findMany();
  const data = await db.query.movies.findMany({
    where: (movies, { eq }) => eq(movies.id, String(597)),
    with: {
      actors: {
        columns: {},
        with: {
          actor: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
  return (
    <main>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
