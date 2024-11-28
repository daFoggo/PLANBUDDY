import StatisticBLock from "@/components/common/StatisticBlock";
import { Card } from "@/components/ui/card";
import { CalendarCheck, Combine, Crown, Handshake } from "lucide-react";

import { IOverviewProps } from "@/types/dashboard";

const Overview = ({ overviewData }: IOverviewProps) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="w-full grid grid-cols-4 gap-4">
        <StatisticBLock
          icon={<Combine className="size-4" />}
          title="Arranging"
          value={overviewData?.stats.arrangingMeeting.toString() || "N/A"}
          description="meetings are published and currently being arranged"
        />

        <StatisticBLock
          icon={<CalendarCheck className="size-4" />}
          title="Scheduled"
          value={overviewData?.stats.scheduledMeeting.toString() || "N/A"}
          description="meetings have been scheduled and are awaiting"
        />

        <StatisticBLock
          icon={<Crown className="size-4" />}
          title="Hosted"
          value={overviewData?.stats.hostedMeeting.toString() || "N/A"}
          description="meetings has been hosted by you"
        />
        <StatisticBLock
          icon={<Handshake className="size-4" />}
          title="Joined"
          value={overviewData?.stats.joinedMeeting.toString() || "N/A"}
          description="meetings has been joined"
        />
      </div>
    </div>
  );
};

export default Overview;
