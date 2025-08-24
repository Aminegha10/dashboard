import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
}: MetricCardProps) {
  return (
    <Card
      className="bg-white  border-0"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#8C8C8C]">{title}</p>
            <div>
              <span className="text-2xl font-bold text-gray-900 mr-1">
                {value}
              </span>
              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 bg-teal-100 rounded-lg">
            <div className="text-teal-600">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectionCards() {
  const metrics = [
    {
      title: "Today's Money",
      value: "$53,000",
      change: "+55%",
      isPositive: true,
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      title: "Today's Users",
      value: "2,300",
      change: "+5%",
      isPositive: true,
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "New Clients",
      value: "+3,052",
      change: "-14%",
      isPositive: false,
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Total Sales",
      value: "$173,000",
      change: "+8%",
      isPositive: true,
      icon: <ShoppingCart className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isPositive={metric.isPositive}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
