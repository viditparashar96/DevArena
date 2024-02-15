import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: any): string => {
  const now: any = new Date();
  const elapsedMilliseconds = now - createdAt;

  // Convert milliseconds to seconds
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  // Define time intervals in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (elapsedSeconds < 10) {
    return "just now";
  } else if (elapsedSeconds < minute) {
    return `${elapsedSeconds} seconds ago`;
  } else if (elapsedSeconds < 2 * minute) {
    return "a minute ago";
  } else if (elapsedSeconds < hour) {
    return `${Math.floor(elapsedSeconds / minute)} minutes ago`;
  } else if (elapsedSeconds < 2 * hour) {
    return "an hour ago";
  } else if (elapsedSeconds < day) {
    return `${Math.floor(elapsedSeconds / hour)} hours ago`;
  } else if (elapsedSeconds < 2 * day) {
    return "a day ago";
  } else if (elapsedSeconds < week) {
    return `${Math.floor(elapsedSeconds / day)} days ago`;
  } else if (elapsedSeconds < 2 * week) {
    return "a week ago";
  } else if (elapsedSeconds < month) {
    return `${Math.floor(elapsedSeconds / week)} weeks ago`;
  } else if (elapsedSeconds < 2 * month) {
    return "a month ago";
  } else if (elapsedSeconds < year) {
    return `${Math.floor(elapsedSeconds / month)} months ago`;
  } else if (elapsedSeconds < 2 * year) {
    return "a year ago";
  } else {
    return `${Math.floor(elapsedSeconds / year)} years ago`;
  }
};
export const formatNumber = (num: number): string => {
  if (typeof num !== "number") {
    throw new Error("Input must be a number");
  }

  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    const rounded = num / 1000;
    return rounded.toFixed(1) + "k";
  } else {
    const rounded = num / 1000000;
    return rounded.toFixed(1) + "M";
  }
};
export default function getJoinedDate(date: Date) {
  // Get the month and year from the Date object
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Join the month and year
  const joinedDate = `${month} ${year}`;

  return joinedDate;
}
