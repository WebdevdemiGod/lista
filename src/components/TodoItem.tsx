
import React from 'react';
import { Check, Trash2, Edit } from "lucide-react";

interface TodoItemProps {
  text: string;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoItem = ({ text, isCompleted, onToggle, onEdit, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span className={`flex-1 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {text}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDelete} className="p-1">
          <Trash2 className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={onEdit} className="p-1">
          <Edit className="w-5 h-5 text-gray-400" />
        </button>
        <button 
          onClick={onToggle} 
          className={`p-1 ${isCompleted ? 'bg-green-100 rounded-md' : ''}`}
        >
          <Check className={`w-5 h-5 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
