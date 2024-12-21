import StatisticBlock from "@/components/common/StatisticBlock";
import { IOverviewProps } from "@/types/dashboard";
import { CalendarCheck, Combine, Crown, Handshake } from 'lucide-react';

const Overview = ({ overviewData }: IOverviewProps) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticBlock
          icon={<Combine className="size-4" />}
          title="Arranging"
          value={overviewData?.stats.arrangingMeeting.toString() || "N/A"}
          description="meetings are published and currently being arranged"
        />

        <StatisticBlock
          icon={<CalendarCheck className="size-4" />}
          title="Scheduled"
          value={overviewData?.stats.scheduledMeeting.toString() || "N/A"}
          description="meetings have been scheduled and are awaiting"
        />

        <StatisticBlock
          icon={<Crown className="size-4" />}
          title="Hosted"
          value={overviewData?.stats.hostedMeeting.toString() || "N/A"}
          description="meetings has been hosted by you"
        />

        <StatisticBlock
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
