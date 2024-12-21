"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IStatisticBlockProps } from "@/types/statistic-block";
import CountUp from "react-countup";

const StatisticBlock = ({
  icon,
  title,
  value,
  description,
}: IStatisticBlockProps) => {
  return (
    <Card className="p-4 flex-1">
      <CardHeader className="flex flex-row justify-between items-center font-semibold p-0 space-y-0">
        <span className="text-sm sm:text-base">{title}</span>
        <Button size="icon" variant="outline" className="text-muted-foreground">
          {icon}
        </Button>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          <CountUp end={Number(value)} duration={2.5} separator="," />
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticBlock;

