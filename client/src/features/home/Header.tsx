import { BookOpen, TrendingUp } from "lucide-react";
import React from "react";
import { dummyIdioms } from "../../dummy/dummyIdioms";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Community Idioms
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Learn, share, and master English idioms with our growing community
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">{dummyIdioms.length} Idioms</span>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Growing Daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
