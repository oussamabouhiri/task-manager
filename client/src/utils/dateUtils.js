import {
  format,
  formatDistance,
  parseISO,
  isValid,
  differenceInDays,
} from "date-fns";

// Format date to display format
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date =
      typeof dateString === "string"
        ? parseISO(dateString)
        : new Date(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

// Format date to include time
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;

  if (!isValid(date)) return "Invalid date";

  return format(date, "PPp"); // e.g., April 29, 2023, 12:00 PM
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;

  if (!isValid(date)) return "Invalid date";

  return formatDistance(date, new Date(), { addSuffix: true });
};

// Check if a deadline is approaching (within 2 days)
export const isDeadlineApproaching = (deadlineString) => {
  if (!deadlineString) return false;

  const deadline =
    typeof deadlineString === "string"
      ? parseISO(deadlineString)
      : deadlineString;

  if (!isValid(deadline)) return false;

  const daysRemaining = differenceInDays(deadline, new Date());
  return daysRemaining >= 0 && daysRemaining <= 2;
};

// Check if a deadline is overdue
export const isDeadlineOverdue = (deadlineString) => {
  if (!deadlineString) return false;

  const deadline =
    typeof deadlineString === "string"
      ? parseISO(deadlineString)
      : deadlineString;

  if (!isValid(deadline)) return false;

  return deadline < new Date();
};

// Format deadline with status-based styling information
export const getDeadlineInfo = (deadlineString) => {
  if (!deadlineString) return { text: "No deadline", status: "none" };

  const deadline =
    typeof deadlineString === "string"
      ? parseISO(deadlineString)
      : deadlineString;

  if (!isValid(deadline)) return { text: "Invalid date", status: "none" };

  const now = new Date();
  const daysRemaining = differenceInDays(deadline, now);

  if (deadline < now) {
    return {
      text: `Overdue by ${Math.abs(daysRemaining)} days`,
      status: "overdue",
    };
  } else if (daysRemaining <= 2) {
    return {
      text: daysRemaining === 0 ? "Due today" : `Due in ${daysRemaining} days`,
      status: "approaching",
    };
  } else {
    return {
      text: format(deadline, "PPP"),
      status: "normal",
    };
  }
};
