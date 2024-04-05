import { Dashboard } from "@/components/dashboard";
import { db } from "@/db";

export default async function Home() {
  const usersData = await db.query.users.findMany();
  return (
    <main>
      {JSON.stringify(usersData)}
      <Dashboard />
    </main>
  );
}
