import {
  BellRing,
  Calendar,
  Combine,
  LayoutList,
  Link,
  LogIn,
  Share2,
  SquarePen,
  TableCellsMerge,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export const features = [
  {
    icon: Calendar,
    title: "Easy Meeting Setup",
    description:
      "Set up in-person or online meetings with all necessary details.",
  },
  {
    icon: Share2,
    title: "Quick Sharing",
    description:
      "Simply share the meeting by URL or QR so they can fill in their available times.",
  },
  {
    icon: TableCellsMerge,
    title: "View Common Free Time",
    description: "Easily see when everyone is available to make decision.",
  },
  {
    icon: LayoutList,
    title: "Manage Appointments",
    description: "Keep track of all your scheduled meetings effortlessly.",
  },
  {
    icon: LogIn,
    title: "Flexible Login",
    description:
      "Sign in with Google or as a guest. No stupid asking questions.",
  },
  {
    icon: FaGoogle,
    title: "Google Integration",
    description:
      "Sync with Google Calendar and People for enhanced user experience.",
  },
];

export const steps = [
  {
    title: "Create A Meeting",
    icon: SquarePen ,
    description: "Set up your meeting with all necessary details.",
  },
  {
    title: "Share With Participants",
    icon: Link,
    description: "Invite others to fill in their available times by URL or QR.",
  },
  {
    title: "Find Common Time",
    icon: Combine,
    description: "Easily view when everyone is available.",
  },
  {
    title: "Schedule and Notify",
    icon: BellRing,
    description: "Confirm the meeting time and notify all participants.",
  },
];

export const testimonials = [
  {
    quote:
      "1MIN2MEET has revolutionized how we schedule team meetings. It's so quick and efficient!",
    author: "Post MaLong",
    role: "Frontend developer at Facebook",
  },
  {
    quote:
      "The ease of use and Google Calendar integration make this tool indispensable for our organization.",
    author: "Isaac Leviethanh",
    role: "Unity developer at Kuro games",
  },
];
