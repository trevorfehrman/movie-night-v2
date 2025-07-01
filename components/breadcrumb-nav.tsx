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
import { Check, Clock, MousePointerClick, MoveRight } from "lucide-react";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const segmentPlusHome = ["/", ...segments];

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {segmentPlusHome.map((segment, index) => {
          let readableSegment: string | React.ReactElement = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const num = Number(readableSegment);
          if (!isNaN(num)) {
            readableSegment = `TMDB Id: ${num}`;
          }

          if (readableSegment === "/") {
            readableSegment = (
              <>
                <p className="sr-only">Home</p>
                <div className="flex items-center justify-center">
                  <Check className="h-4" /> <MoveRight className="h-4" />{" "}
                  <Clock className="h-4" />
                  <MousePointerClick className="h-4" />
                </div>
              </>
            );
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
