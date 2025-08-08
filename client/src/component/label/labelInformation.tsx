"use client";
import React from "react";

type LabelInformationProps = {
  title: string; // Title text for the account overview
  content: string; // Content or description
};

const LabelInformation: React.FC<LabelInformationProps> = ({
  title,
  content,
}) => {
  return (
    <div className="flex flex-col w-full">
      <p className="text-primary-100 text-lg font-medium">{title}</p>
      <p className=" dark:text-dark-400 text-light-200">{content}</p>
    </div>
  );
};

export default LabelInformation;
