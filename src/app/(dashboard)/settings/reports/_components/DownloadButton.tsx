import React from "react";

interface DownloadButtonProps {
  text: string;
  onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-lg shadow-md transition"
    >
      {text}
    </button>
  );
};

export default DownloadButton;