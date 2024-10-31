"use client";

import Error from "next/error";

export default function GlobalError({ error }: { error: unknown }) {
  return (
    <html lang="en">
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}
