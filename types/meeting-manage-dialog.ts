import { IMeeting } from "./dashboard";

export interface IMeetingManageDialogProps {
    manageType: string;
    meetingData?: IMeeting;
}