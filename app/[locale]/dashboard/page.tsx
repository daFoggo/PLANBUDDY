import { auth } from "@/auth";
import { headers } from "next/headers";

import MeetingList from "@/components/features/Dashboard/MeetingList";
import Overview from "@/components/features/Dashboard/Overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PageTitle from "@/components/common/PageTitle";
import { LayoutDashboard } from "lucide-react";
import { Metadata } from "next/types";
import { TABLIST } from "./constant";

export const metadata: Metadata = {
  title: 'Dashboard | 1min2meet',
  description: 'Manage your meetings and schedules',
  openGraph: {
    title: 'Dashboard | 1min2meet',
    description: 'Manage your meetings and schedules',
  }
}

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
      <Tabs
        defaultValue="overview"
        className="self-center sm:self-start sm:w-full"
      >
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
