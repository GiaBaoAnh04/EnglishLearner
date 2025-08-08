"use client";
import React from "react";
import clsx from "clsx"; // Nếu bạn đang dùng clsx để xử lý className động

type RowLabelInformationProps = {
  title: string;
  content: string;
  containerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
};

const RowLabelInformation: React.FC<RowLabelInformationProps> = ({
  title,
  content,
  containerClassName,
  titleClassName,
  contentClassName,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-row w-full gap-2 items-center text-xs sm:text-lg",
        containerClassName
      )}
    >
      <p
        className={clsx(
          "dark:text-dark-400 text-light-200 md:text-lg  text-xs sm:text-base"
        )}
      >
        {title}
        <span
          className={clsx(
            "dark:text-dark-400 text-light-200 font-bold",
            contentClassName
          )}
        >
          {" "}
          {content}
        </span>
      </p>
    </div>
  );
};

export default RowLabelInformation;
