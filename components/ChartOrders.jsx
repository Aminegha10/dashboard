"use client"

import { useState, useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetLeadDataQuery } from "@/features/dataApi"

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
}

export function ChartOrders() {
  const { data: leadsData, isLoading, isError } = useGetLeadDataQuery()
  const [selectedTeam, setSelectedTeam] = useState("All")

  // Process data for the radar chart
  const chartData = useMemo(() => {
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const defaultData = MONTHS.map((month) => ({ month, leads: 0, orders: 0 }))

    if (!leadsData?.data?.leads) return defaultData

    const leadsArray = leadsData.data.leads
    if (!leadsArray?.length) return defaultData

    // Filter by team and ensure leads are valid objects
    const filtered = leadsArray.filter(
      (lead) => lead && (selectedTeam === "All" || lead.team?.label === selectedTeam)
    )

    // Initialize data for each month of the current year
    const currentYear = new Date().getFullYear()
    const monthlyData = defaultData

    // Aggregate leads/orders per month, but only for the current year
    filtered.forEach((lead) => {
      const leadDate = new Date(lead.createdAt)
      const leadYear = leadDate.getFullYear()
      
      // Only process leads from any month of the current year
      if (leadYear === currentYear) {
        const monthIndex = leadDate.getMonth()
        monthlyData[monthIndex].leads += 1
        // Consider a lead as an order if it has price and is marked as 'commande'
        const hasPrice = Number(lead.prixttc) > 0
        const isOrder = lead.pipeline?.label?.toLowerCase() === 'commande'
        monthlyData[monthIndex].orders += (hasPrice && isOrder) ? 1 : 0
      }
    })

    return monthlyData
  }, [leadsData, selectedTeam])

  // Extract unique teams for filter dropdown
  const teams = useMemo(() => {
    if (!leadsData?.data?.leads) return ["All"]
    const leadsArray = leadsData.data.leads
    const list = Array.from(new Set(
      leadsArray
        .filter(Boolean)
        .map((l) => l.team?.label)
        .filter(Boolean)
    ))
    list.unshift("All")
    return list
  }, [leadsData])

  if (isLoading) return <p>Loading chart...</p>
  if (isError) return <p>Error loading data</p>

  return (
    <Card>
      <CardHeader className="items-center pb-4 flex-col md:flex-row md:justify-between">
        <div>
          <CardTitle>Leads & Orders Distribution</CardTitle>
          <CardDescription>Monthly summary of leads and orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedTeam} defaultValue="All">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="month"
              tick={({ x, y, textAnchor, value, index, ...props }) => {
                const data = chartData[index]
                return (
                  <text
                    x={x}
                    y={index === 0 ? y - 10 : y}
                    textAnchor={textAnchor}
                    fontSize={13}
                    fontWeight={500}
                    {...props}
                  >
                    <tspan>{data.leads}</tspan>
                    <tspan className="fill-muted-foreground">/</tspan>
                    <tspan>{data.orders}</tspan>
                    <tspan
                      x={x}
                      dy={"1rem"}
                      fontSize={12}
                      className="fill-muted-foreground"
                    >
                      {data.month}
                    </tspan>
                  </text>
                )
              }}
            />
            <PolarGrid />
            <Radar
              name="Leads"
              dataKey="leads"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.6}
            />
            <Radar
              name="Orders"
              dataKey="orders"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          <span className="inline-flex items-center">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4 ml-1" />
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          {selectedTeam === "All" ? "All Teams" : selectedTeam} - {new Date().getFullYear()}
        </div>
      </CardFooter>
    </Card>
  )
}


