import { IAvailableSlot } from "@/types/dashboard";

export const findCommonAvailableSlot = (availableSlots: IAvailableSlot[]) => {
  const slotGroups: Record<string, IAvailableSlot[]> = availableSlots.reduce(
    (acc: Record<string, IAvailableSlot[]>, slot) => {
      const key = `${slot.date.toISOString().split("T")[0]}_${slot.startTime}_${
        slot.endTime
      }`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(slot);
      return acc;
    },
    {}
  );

  // Find the slot with the most participants
  const mostCommonSlotKey = Object.entries(slotGroups).reduce<{
    key: string | null;
    count: number;
  }>(
    (max, [key, slots]) =>
      slots.length > max.count ? { key, count: slots.length } : max,
    { key: null, count: 0 }
  );

  if (mostCommonSlotKey.key) {
    const [date, startTime, endTime] = mostCommonSlotKey.key.split("_");
    return {
      date: new Date(date),
      startTime,
      endTime,
    };
  }

  return null;
};
