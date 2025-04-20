
import React from 'react';
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const AuthInput = ({ type, placeholder, value, onChange, onClear }: AuthInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg border-none"
      />
      {value && (
        <button 
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default AuthInput;
