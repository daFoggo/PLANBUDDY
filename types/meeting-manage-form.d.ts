import { IMeeting } from "./dashboard";

export interface IMeetingManageForm {
  onClose: () => void;
  meetingData?: IMeeting;
}
