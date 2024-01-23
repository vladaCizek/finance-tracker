import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";

export const useUseSeletectedTimePeriod = (period) => {
  const current = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          from: startOfYear(new Date()),
          to: new Date(),
        };
      case "Monthly":
        return {
          from: startOfMonth(new Date()),
          to: new Date(),
        };
      case "Daily":
        return {
          from: startOfDay(new Date()),
          to: new Date(),
        };
    }
  });

  const previous = computed(() => {
    switch (period.value) {
      case "Yearly":
        return {
          from: startOfYear(new Date()),
          to: endOfYear(new Date()),
        };
      case "Monthly":
        return {
          from: startOfMonth(new Date()),
          to: endOfMonth(new Date()),
        };
      case "Daily":
        return {
          from: startOfDay(new Date()),
          to: endOfDay(new Date()),
        };
    }
  });

  return {
    current,
    previous,
  };
};
