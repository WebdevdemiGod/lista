import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/api/backendApi"; // Import axiosInstance

interface Todo {
  item_id: number;
  item_name: string;
  item_description: string;
  status: string;
  user_id: number;
  timemodified: string;
}

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
  // Remove onSave prop since we handle save here now
  onUpdated: (updatedTodo: Todo) => void; // callback to update parent state
}

const EditTodoModal = ({
  isOpen,
  onClose,
  todo,
  onUpdated,
}: EditTodoModalProps) => {
  const [text, setText] = useState(todo.item_name);
  const [description, setDescription] = useState(todo.item_description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when todo changes (important when editing different todos)
  useEffect(() => {
    setText(todo.item_name);
    setDescription(todo.item_description || "");
    setError(null);
  }, [todo]);

  const handleSave = async () => {
    if (!text) {
      setError("Please enter a todo name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get user info from localStorage
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const user_id = user?.id || todo.user_id; // fallback to todo.user_id

      const payload = {
        item_id: todo.item_id,
        item_name: text,
        item_description: description,
        user_id,
      };

      const response = await axiosInstance.put(
        import.meta.env.VITE_API_UPDATE_TODO,
        payload
      );

      const data = response.data;

      console.log(response?.data); // <-- log response

      if (data.status === 200) {
        // If backend returns updated todo:
        if (data.data) {
          onUpdated(data.data);
        } else {
          // If backend does not return updated todo, update locally:
          onUpdated({
            ...todo,
            item_name: text,
            item_description: description,
            // optionally update timemodified if you want
          });
        }
        onClose();
      } else {
        setError(data.message || "Failed to update todo");
      }
    } catch (err) {
      setError("Network error while updating todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Edit todo..."
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Edit description (optional)"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoModal;
