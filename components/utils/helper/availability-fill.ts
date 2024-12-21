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

export const isInSelection = (
  rowIndex: number,
  colIndex: number,
  start: { row: number; col: number } | null,
  end: { row: number; col: number } | null
) => {
  if (!start || !end) return false;

  const startRow = Math.min(start.row, end.row);
  const endRow = Math.max(start.row, end.row);
  const startCol = Math.min(start.col, end.col);
  const endCol = Math.max(start.col, end.col);

  return (
    rowIndex >= startRow &&
    rowIndex <= endRow &&
    colIndex >= startCol &&
    colIndex <= endCol
  );
};
