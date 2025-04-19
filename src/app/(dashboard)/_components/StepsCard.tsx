"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordian";
import Typography from "./Typography";

interface Step {
  title: string;
  description: string;
  progress: number;
  max: number;
  subSteps?: string[];
  icon: React.ReactElement;
}

const StepsCard: React.FC<{ step: Step }> = ({ step }) => {
  const { title, description, progress, max, subSteps, icon } = step;

  return (
    <Accordion
      type="single"
      collapsible
      className="p-4 bg-white rounded-lg border border-solid border-t border-r border-b-[0.5px] border-l border-[#D0D5DD] shadow-[0px_9px_21px_9px_rgba(0,0,0,0.08)]"
    >
      <AccordionItem value="1">
        {/* Accordion Trigger */}
        <AccordionTrigger className="flex items-center justify-between p-4 bg-white border-b border-[#F2F4F7]  ">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center  ">
              {icon}
            </div>
            <div>
              <Typography
                variant="paragraph1"
                text={title}
                className="font-semibold text-gray-900"
              />
              <Typography
                variant="paragraph2"
                text={description}
                className="text-sm text-gray-500"
              />
            </div>
          </div>
          <Typography
            variant="paragraph3"
            text={`Step ${progress}/${max}`}
            className="text-sm text-gray-400"
          />
        </AccordionTrigger>

        {/* Accordion Content */}
        {subSteps && subSteps.length > 0 && (
          <AccordionContent className="mt-4  border border-[#D0D5DD] rounded-md">
            <div className="space-y-2">
              {subSteps.map((subStep, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2  "
                >
                  <Typography
                    variant="paragraph1"
                    text={subStep}
                    className="text-[#667085] font-[Mulish] font-semibold leading-[28.8px] text-left"
                  />
                  <button className="text-[#979FAF] hover:underline">→</button>
                </div>
              ))}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default StepsCard;
