import React from "react";
import { Check, Trash2, Edit } from "lucide-react";

interface TodoItemProps {
  text: string;
  isCompleted: boolean;
  date?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TodoItem = ({
  text,
  isCompleted,
  date,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span
          className={`flex-1 ${
            isCompleted ? "line-through text-gray-400" : ""
          }`}
        >
          {text}
          {date && <div className="text-xs text-gray-500 mt-1">{date}</div>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDelete} className="p-1" aria-label="Delete todo">
          <Trash2 className="w-5 h-5 text-gray-400" />
        </button>

        <button onClick={onEdit} className="p-1" aria-label="Edit todo">
          <Edit className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={onToggle}
          className={`p-1 ${isCompleted ? "bg-green-100 rounded-md" : ""}`}
          aria-label={isCompleted ? "Mark as active" : "Mark as completed"}
        >
          <Check
            className={`w-5 h-5 ${
              isCompleted ? "text-green-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
