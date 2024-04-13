"use client";
import { ResponsiveBar } from "@nivo/bar";

export function BudgetChart({
  budget,
  revenue,
}: {
  budget: number;
  revenue: number;
}) {
  const data = [
    {
      id: "US Dollars",
      country: "US Dollars",
      Budget: budget,
      Revenue: revenue,
      budgetColor: "hsl(26, 70%, 50%)",
      revenueColor: "hsl(16, 70%, 50%)",
    },
  ];
  return (
    <ResponsiveBar
      data={data}
      // valueScale={{ type: "symlog" }}
      valueScale={{
        type:
          revenue / budget > 10 || budget / revenue > 10 ? "symlog" : "linear",
      }}
      margin={{ bottom: 10 }}
      groupMode="grouped"
      layout="horizontal"
      valueFormat={(e) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(e)
      }
      keys={["Budget", "Revenue"]}
      colors={{ scheme: "nivo" }}
      axisLeft={null}
      axisBottom={null}
      isInteractive={false}
      role="application"
      ariaLabel="Budget chart showing the amount of money spent on budget and revenue in US Dollars."
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in " + e.indexValue
      }
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-left",
          direction: "row",
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          symbolSize: 20,
          translateY: 10,
        },
      ]}
    />
  );
}
