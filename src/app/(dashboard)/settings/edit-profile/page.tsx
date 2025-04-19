"use client";

import React from "react";
import ProfileDetailsHeader from "./_components/ProfileDetailsHeader";
import EditProfileForm from "./_components/EditProfileForm";

const ProfileDetailsPage = () => {
  return (
    <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-md flex">
      {/* Left Section: Profile Header */}
      <div className="w-1/3 pr-8">
        <ProfileDetailsHeader />
      </div>

      {/* Right Section: Edit Profile Form */}
     
      <div className="bg-white  rounded-lg border border-[#E5E7EB] shadow-sm">
      <EditProfileForm />
      </div>
        
     
    </div>
  );
};

export default ProfileDetailsPage;