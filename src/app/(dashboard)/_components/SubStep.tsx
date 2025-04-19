import React from "react";

const SubStep = ({ text }) => {
  return (
    <div className="flex items-center justify-between border rounded-lg px-4 py-2 bg-gray-50">
      <span className="text-gray-600 text-sm">{text}</span>
      <button className="text-blue-500">→</button>
    </div>
  );
};

export default SubStep;