import {
  DATE_TYPE,
  MEETING_STATUS,
  MEETING_TYPE,
  PARTICIPANT_ROLE,
  RESPONSE_STATUS,
  SLOT_STATUS,
  USER_TYPE,
} from "@/components/utils/constant";

export interface IMeeting {
  id: string;
  title: string;
  description: string?;
  meetingType: MEETING_TYPE;
  location: string?;
  note: string?;

  dateType: DATE_TYPE;
  proposedDates: Date[];
  finalDate: Date?;

  status: MEETING_STATUS;

  participants: IMeetingParticipant[];
  availableSlots: IAvailableSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMeetingParticipant {
  id: string;
  role: PARTICIPANT_ROLE;
  responseStatus: RESPONSE_STATUS;

  user: IUser;
  meetingId: string;
}

export interface IAvailableSlot {
  id: string;
  meetingId: string;
  userId: string;

  date: Date;
  startTime: string;
  endTime: string;
  timeZone: string;
  status: SLOT_STATUS;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  image: string;
  timeZone: string;
  userType: USER_TYPE;
  meetings: IMeeting[];
  availableSlots: IAvailableSlot[];
}

export interface IMeetingData {
  hostedMeeting: IMeeting[];
  joinedMeeting: IMeeting[];
  stats: {
    hostedMeeting: number;
    joinedMeeting: number;
    totalMeeting: number;
    scheduleMeeting: number;
  };
}

export interface IMeetingListProps {
  meetingListData: IMeeting[];
}