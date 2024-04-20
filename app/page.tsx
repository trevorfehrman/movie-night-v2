import { db } from "@/db";

export default async function Home() {
  // const user = await db.query.users.findMany();
  const movies = await db.query.movies.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  return (
    <main>
      <div className="flex flex-col gap-y-2">
        {movies.map((movie) => (
          <div key={movie.id}>
            <p>{movie.title}</p>
            <p>{movie.director}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
