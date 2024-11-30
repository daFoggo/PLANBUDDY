import { IMeeting } from "./dashboard";

export interface IMeetingCUForm {
  onClose: () => void;
  meetingData?: IMeeting;
}
