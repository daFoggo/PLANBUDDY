"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Overview from "@/components/features/Dashboard/Overview";
import MeetingList from "@/components/features/Dashboard/MeetingList";

import { IMeetingData } from "@/types/dashboard";
import { TABLIST } from "./constant";
import PageTitle from "@/components/common/PageTitle";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const [meetingData, setMeetingData] = useState<IMeetingData>();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      handleGetMeetingData();
    }
  }, [session]);

  const handleGetMeetingData = async () => {
    try {
      const res = await fetch(
        `/api/meeting?userId=${session?.user?.id ? session.user.id : ""}`
      );
      const data = await res.json();
      setMeetingData(data);
    } catch (error) {
      console.error(error);
    }
  };

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
          <MeetingList meetingListData={meetingData?.hostedMeeting} />
        </TabsContent>
        <TabsContent value="joinedMeeting">
          <MeetingList meetingListData={meetingData?.joinedMeeting} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
