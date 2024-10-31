import { SyncActiveOrganization } from "@/components/sync-active-organization";
import { auth } from "@clerk/nextjs/server";
import * as React from "react";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();
  return (
    <>
      <SyncActiveOrganization membership={sessionClaims?.membership} />
      {children}
    </>
  );
}
