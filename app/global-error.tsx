"use client";

import Error from "next/error";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}
