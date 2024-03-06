"use client";
import { Next13ProgressBar } from "next13-progressbar";
import React from "react";

const TopProgressBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar
        height="2px"
        color="#f53f70"
        options={{ showSpinner: false }}
        showOnShallow
      />
    </>
  );
};

export default TopProgressBar;
