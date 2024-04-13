"use client";
import * as React from "react";

// https://github.com/recharts/recharts/issues/3615

export function TurnOffDefaultPropsWarning() {
  React.useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && /defaultProps/.test(args[0])) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
