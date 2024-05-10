import { AdminMoveTable } from "@/components/tables/admin-movie-table";
import { Card } from "@/components/ui/card";
import { db } from "@/db";

export default async function Page() {
  const movies = await db.query.movies.findMany({
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    with: {
      user: {
        columns: {
          firstName: true,
        },
      },
    },
  });

  const users = await db.query.users.findMany();

  return (
    <main className="w-full max-w-screen-2xl p-4">
      <Card>
        <AdminMoveTable movies={movies} users={users} />
      </Card>
    </main>
  );
}
