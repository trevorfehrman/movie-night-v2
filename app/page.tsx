import { db } from "@/db";

export default async function Home() {
  const user = await db.query.users.findMany();
  return (
    <main>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}
