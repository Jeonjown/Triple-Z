import { format } from "date-fns";

export const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  return format(date, "MMMM dd, yyyy"); // Custom format
};
