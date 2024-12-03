import { SLOT_STATUS } from "@/components/utils/constant";

export const getStatusColor = (
  status: SLOT_STATUS,
  inDragSelection: boolean
) => {
  const baseColors = {
    [SLOT_STATUS.AVAILABLE]: {
      drag: "bg-green-500/30 dark:bg-green-500/20",
      base: "bg-green-500/70 dark:bg-green-500/50",
    },
    [SLOT_STATUS.IFNEEDED]: {
      drag: "bg-yellow-500/30 dark:bg-yellow-500/20",
      base: "bg-yellow-500/70 dark:bg-yellow-500/50",
    },
    [SLOT_STATUS.UNAVAILABLE]: {
      drag: "bg-red-500/30 dark:bg-red-500/20",
      base: "bg-red-500/70 dark:bg-red-500/50",
    },
  };

  const colorSet = baseColors[status];
  return inDragSelection ? colorSet.drag : colorSet.base;
};

export const getHourDecimal = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":");
  return Number(hours) + Number(minutes) / 60;
};
