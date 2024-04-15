"use client";
import * as React from "react";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const segmentPlusHome = ["/", ...segments];

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {segmentPlusHome.map((segment, index) => {
          let readableSegment = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const num = Number(readableSegment);
          if (!isNaN(num)) {
            readableSegment = `TMDB Id: ${num}`;
          }

          if (readableSegment === "/") {
            readableSegment = "👌 🟢 ⌛ 🖱️";
          }

          return (
            <React.Fragment key={segment}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${segmentPlusHome.slice(1, index + 1).join("/")}`}
                    className="outline-ring"
                  >
                    {readableSegment}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== segmentPlusHome.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
