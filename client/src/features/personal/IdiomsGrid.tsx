import React from "react";
import { IdiomCard } from "../home/EdiomCard";
import { Idiom } from "../../types/idiom";

interface IdiomsGridProps {
  idioms: Idiom[];
  activeTab: "my-idioms" | "liked-idioms";
  onClickIdiom: (id: string) => void;
}

export default function IdiomsGrid({
  idioms,
  activeTab,
  onClickIdiom,
}: IdiomsGridProps) {
  if (idioms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          {activeTab === "my-idioms"
            ? "No idioms created yet"
            : "No liked idioms yet"}
        </div>
        <p className="text-gray-400">
          {activeTab === "my-idioms"
            ? "Start creating your first idiom!"
            : "Start exploring and like some idioms!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {idioms.map((idiom) => (
        <div key={idiom._id} className="relative">
          <IdiomCard
            idiom={idiom}
            className="hover:shadow-lg transition-shadow"
            onClick={() => onClickIdiom(idiom._id)}
          />
        </div>
      ))}
    </div>
  );
}
