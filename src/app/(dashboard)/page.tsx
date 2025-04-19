import React from "react";

import MessagesIcon from "@/assets/MessagesIcon";
import ChatIcon from "@/assets/ChatIcon";
import ProfileIcon from "@/assets/ProfileIcon";
import HomeHeader from "./_components/HomeHeader";
import StepsCard from "./_components/StepsCard";

const HomePage = () => {
  const steps = [
    {
      title: "Connect with Slack",
      description: "To get your all notification at one place",
      progress: 1,
      max: 3,
      subSteps: [
        "Auto-update slack status with 🌴 when on leave",
        "Customise your personal Slack notifications",
      ],
      icon: <ChatIcon />,
    },
    {
      title: "Setup Google Calendar",
      description: "To get your all notification at one place",
      progress: 3,
      max: 3,
      subSteps: [
        "Auto-update slack status with 🌴 when on leave",
        "Customise your personal Slack notifications",
      ],
      icon: <MessagesIcon />,
    },
    {
      title: "Complete your Profile",
      description: "To get your all notification at one place",
      progress: 1,
      max: 2,
      subSteps: [
        "Auto-update slack status with 🌴 when on leave",
        "Customise your personal Slack notifications",
      ],
      icon: <ProfileIcon />,
    },
  ];

  return (
    <div
      className="flex  flex-col space-y-6 px-72"
      // style={{
      //   // Hug (876px)
      //   padding: "0px 320px", // Padding (0px top/bottom, 320px left/right)
      //   gap: "80px", // Gap between elements
      //  // Opacity set to 0
      // }}
    >
      <HomeHeader />
      <section className="space-y-6">
        {steps.map((step, index) => (
          <StepsCard key={index} step={step} />
        ))}
      </section>
    </div>
  );
};

export default HomePage;
