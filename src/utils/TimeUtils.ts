export const getDateRange = (selectedDate: Date, selectedTab: string): { start: number; end: number } => {
  let start: Date;
  let end: Date;

  switch (selectedTab) {
    case "Daily":
      start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0); // beginning of the day
      end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999); // end of the day
      break;

    case "Monthly":
      start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "Yearly":
      start = new Date(selectedDate.getFullYear(), 0, 1); // Jan 1
      end = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999); // Dec 31
      break;

    default:
      throw new Error(`Unsupported tab: ${selectedTab}`);
  }

  return {
    start: start.getTime(), // epoch ms
    end: end.getTime(),
  };
};

export const formatDateAndDay = (activeTab: string, selectedDate: Date): { formattedDate: string; dayName: string } => {
  let formattedDate = "";
  let dayName = "";

  if (activeTab === "Daily") {
    formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(selectedDate);

    dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  if (activeTab === "Monthly") {
    formattedDate = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(selectedDate);

    dayName = ""; // no weekday
  }

  if (activeTab === "Yearly") {
    formattedDate = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
    }).format(selectedDate);

    dayName = ""; // no weekday
  }

  return {
    formattedDate,
    dayName,
  };
}