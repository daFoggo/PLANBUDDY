import { IMeeting } from "./dashboard";

export interface IMeetingCUDialogProps {
    manageType: string;
    meetingData?: IMeeting;
    isOwner: boolean;
}