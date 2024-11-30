import { headers } from "next/headers";
import { auth } from "../api/auth/[...nextauth]/route";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Overview from "@/components/features/Dashboard/Overview";
import MeetingList from "@/components/features/Dashboard/MeetingList";

import { IMeetingData } from "@/types/dashboard";
import { TABLIST } from "./constant";
import PageTitle from "@/components/common/PageTitle";
import { LayoutDashboard } from "lucide-react";

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/meeting?userId=${session.user.id}`,
    {
      headers: {
        cookie: headers().get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const meetingData = await response.json();

  return (
    <div className="flex flex-col gap-6">
      <PageTitle name="Dashboard" icon={<LayoutDashboard />} />
      <Tabs defaultValue="overview">
        <TabsList>
          {TABLIST.map((tab, index) => (
            <TabsTrigger key={index} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Overview overviewData={meetingData} />
        </TabsContent>
        <TabsContent value="hostedMeeting">
          <MeetingList meetingListData={meetingData?.hostedMeeting || []} />
        </TabsContent>
        <TabsContent value="joinedMeeting">
          <MeetingList meetingListData={meetingData?.joinedMeeting || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
