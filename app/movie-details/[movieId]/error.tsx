"use client"; // Error components must be Client Components

import { ErrorWithReset } from "@/components/error-with-reset";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorWithReset error={error} reset={reset} />;
}
