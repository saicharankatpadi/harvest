
import { useState } from "react";
import { InfoIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const HowItWorks = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium ml-2">
          How it works?
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white text-black p-4 rounded-lg border border-gray-200 shadow-lg">
        <ul className="space-y-2 text-xs">
          <li className="flex items-start">
            <span className="text-black font-medium mr-2">•</span>
            See your capital gains for FY 2024-25 in the left card
          </li>
          <li className="flex items-start">
            <span className="text-black font-medium mr-2">•</span>
            Check boxes for assets you plan on selling to reduce your tax liability
          </li>
          <li className="flex items-start">
            <span className="text-black font-medium mr-2">•</span>
            See how you can reduced tax liability in the right card
          </li>
          <li className="flex items-start">
            <span className="text-black font-medium mr-2">•</span>
            Pro tip: Experiment with different combinations of your holdings to optimize your tax liability
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default HowItWorks;
