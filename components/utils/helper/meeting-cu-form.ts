import {
  addDays,
  isBefore,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from "date-fns";

export const getCurrentWeekRange = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  return {
    start: weekStart,
    end: addDays(weekStart, 6),
  };
};

export const filterCurrentWeekDates = (dates: Date[]) => {
  const { start, end } = getCurrentWeekRange();
  return dates.filter(
    (date) =>
      isWithinInterval(date, { start, end }) &&
      !isBefore(date, startOfDay(new Date()))
  );
};

export const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};