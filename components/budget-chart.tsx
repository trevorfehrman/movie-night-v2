"use client";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
  Cell,
  // Tooltip,
} from "recharts";
import { TurnOffDefaultPropsWarning } from "./turn-off-default-props-warning";

export function BudgetChart({
  budget,
  revenue,
}: {
  budget: number;
  revenue: number;
}) {
  const data = [
    {
      name: "Budget",
      value: budget,
      color: "hsl(var(--primary))",
    },
    {
      name: "Revenue",
      value: revenue,
      color: "hsl(var(--foreground))",
    },
  ];
  return (
    <>
      <TurnOffDefaultPropsWarning />
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
        >
          <XAxis type="number" hide scale="linear" />
          <YAxis type="category" hide padding={{ bottom: 0, top: 0 }} />
          <Legend
            align="left"
            content={() => <CustomizedLegend data={data} />}
          />
          {/* <Tooltip /> */}
          <Bar
            dataKey="value"
            minPointSize={100}
            background={{ fill: "hsl(var(--secondary)" }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function CustomizedLegend({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <div>
      {data.map((entry) => (
        <div key={`cell-${entry.name}`} className="flex items-center gap-2">
          <div
            className={cn(
              "size-4",
              entry.name === "Budget" && "bg-primary",
              entry.name === "Revenue" && "bg-foreground",
            )}
          />
          <span>
            {entry.name} — {formatter.format(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
