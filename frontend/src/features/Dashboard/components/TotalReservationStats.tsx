import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy chart data using event and group reservation counts
const chartData = [
  { date: "2024-04-01", events: 50, groups: 20 },
  { date: "2024-04-02", events: 55, groups: 25 },
  { date: "2024-04-03", events: 48, groups: 22 },
  { date: "2024-04-04", events: 60, groups: 30 },
  { date: "2024-04-05", events: 65, groups: 35 },
  { date: "2024-04-06", events: 70, groups: 40 },
  { date: "2024-04-07", events: 68, groups: 38 },
  { date: "2024-04-08", events: 75, groups: 42 },
  { date: "2024-04-09", events: 80, groups: 45 },
  { date: "2024-04-10", events: 78, groups: 43 },
  // Additional data points as needed...
];

const chartConfig = {
  events: {
    label: "Event Reservations",
    color: "hsl(var(--primary))", // Uses your bg-primary color
  },
  groups: {
    label: "Group Reservations",
    color: "hsl(var(--muted))", // Uses your muted color
  },
} satisfies ChartConfig;

export default function ReservationAnalytics() {
  const [timeRange, setTimeRange] = React.useState("90d");

  // Dummy filtering based on time range
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-04-10"); // Adjust as needed
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Reservation Analytics</CardTitle>
          <CardDescription>
            Comparing event and group reservation counts
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="groups"
              type="natural"
              fill="hsl(var(--primary))" // Solid fill without gradient
              stroke="hsl(var(--muted))"
              stackId="a"
            />
            <Area
              dataKey="events"
              type="natural"
              fill="hsl(var(--muted))" // Solid fill without gradient
              stroke="hsl(var(--primary))"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
