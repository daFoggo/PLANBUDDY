import { IMeeting } from "./dashboard";

export interface IAddGoogleCalendarProps {
  meeting: IMeeting;
  availability: Array<{
    time: string;
    status: string[];
  }>;
  proposedDates: Date[];
  onSelectionStart: () => void;
  onSelectionEnd: () => void;
  selection: {
    start: { row: number; col: number } | null;
    end: { row: number; col: number } | null;
  };
  isSelectionValid: boolean;
}
