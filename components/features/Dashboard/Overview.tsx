import StatisticBlock from "@/components/common/StatisticBlock";
import { IOverviewProps } from "@/types/dashboard";
import { CalendarCheck, Combine, Crown, Handshake } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Overview = async ({ overviewData }: IOverviewProps) => {
  const t = await getTranslations("Dashboard.Overview");

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="w-full flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticBlock
          icon={<Combine className="size-4" />}
          title={t("arranging.title")}
          value={overviewData?.stats.arrangingMeeting.toString() || "N/A"}
          description={t("arranging.description")}
        />

        <StatisticBlock
          icon={<CalendarCheck className="size-4" />}
          title={t("scheduled.title")}
          value={overviewData?.stats.scheduledMeeting.toString() || "N/A"}
          description={t("scheduled.description")}
        />

        <StatisticBlock
          icon={<Crown className="size-4" />}
          title={t("hosted.title")}
          value={overviewData?.stats.hostedMeeting.toString() || "N/A"}
          description={t("hosted.description")}
        />

        <StatisticBlock
          icon={<Handshake className="size-4" />}
          title={t("joined.title")}
          value={overviewData?.stats.joinedMeeting.toString() || "N/A"}
          description={t("joined.description")}
        />
      </div>
    </div>
  );
};

export default Overview;
