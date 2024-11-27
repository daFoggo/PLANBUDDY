"use client";
import ViewToggle from "@/components/common/ViewToggle";

import { IMeetingListProps } from "@/types/dashboard";
import { useState } from "react";

const MeetingList = ({ meetingListData }: IMeetingListProps) => {
  const [currentView, setCurrentView] = useState<"list" | "grid">("list");
  return (
    <div className="flex flex-col py-4">
      <div className="self-end">
        <ViewToggle onViewChange={setCurrentView} defaultView={currentView} />
      </div>
    </div>
  );
};

export default MeetingList;
