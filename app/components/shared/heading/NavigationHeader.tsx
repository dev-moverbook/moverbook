"use client";
import { ArrowLeft, X } from "lucide-react";
import IconButton from "../IconButton";

interface HeaderProps {
  title: string;
  onBack: () => void;
  onClose: () => void;
}

const PageHeader: React.FC<HeaderProps> = ({ title, onBack, onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black text-white shadow">
      <IconButton variant="ghost" icon={<ArrowLeft className="w-5 h-5" />} />
      <h1 className="text-sm font-medium">{title}</h1>
      <IconButton
        variant="ghost"
        icon={<X className="w-5 h-5" />}
        onClick={onClose}
      />
    </div>
  );
};

export default PageHeader;
