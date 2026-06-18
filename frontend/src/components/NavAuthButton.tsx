import React from "react";

interface NavAuthButtonProps {
  text: string;
  onClick: () => void;
}

const NavAuthButton = ({ text, onClick }: NavAuthButtonProps) => {
  return (
    <button
      className="bg-secondary text-accent p-2 rounded-xl cursor-pointer hover:bg-red-700 active:bg-red-800"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NavAuthButton;