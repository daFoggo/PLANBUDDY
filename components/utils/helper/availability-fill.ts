import { SLOT_STATUS } from "@/components/utils/constant";

export const getStatusColor = (
  status: SLOT_STATUS,
  inDragSelection: boolean
) => {
  const baseColors = {
    [SLOT_STATUS.AVAILABLE]: {
      drag: "bg-green-500/40 dark:bg-green-500/30",
      base: "bg-green-500/60 dark:bg-green-500/50",
    },
    [SLOT_STATUS.TENTATIVE]: {
      drag: "bg-yellow-500/40 dark:bg-yellow-500/30",
      base: "bg-yellow-500/60 dark:bg-yellow-500/50",
    },
    [SLOT_STATUS.UNAVAILABLE]: {
      drag: "bg-red-500/40 dark:bg-red-500/30",
      base: "bg-red-500/60 dark:bg-red-500/50",
    },
  };

  const colorSet = baseColors[status];
  return inDragSelection ? colorSet.drag : colorSet.base;
};
