
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddTodoProps {
  onAdd: (text: string, date: Date) => void;
  onClose: () => void;
}

const AddTodo = ({ onAdd, onClose }: AddTodoProps) => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a todo name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const USER_ID = user?.data?.id;

      const payload = {
        item_name: text.trim(),
        item_description: description.trim(),
        user_id: USER_ID,
      };

      const response = await fetch("https://todo-list.dcism.org/addItem_action.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === 200) {
        setText('');
        setDescription('');
        onClose();
      } else {
        setError(data.message || "Failed to add todo");
      }
    } catch (err) {
      setError("Network error while adding todo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What needs to be done?"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description (optional)"
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" onClick={onClose} variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Todo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodo;
