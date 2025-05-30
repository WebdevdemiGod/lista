import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoItem from "@/components/TodoItem";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/components/Logo";
import EditTodoModal from "@/components/EditTodoModal";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Todo {
  item_id: number;
  item_name: string;
  item_description: string;
  status: string;
  user_id: number;
  timemodified: string;
}

const Todos = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<"active" | "inactive">(
    "active"
  );

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const USER_ID = user?.data?.id; // or user?.user_id depending on your API response

  // Add Todo form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://todo-list.dcism.org/getItems_action.php?status=${statusFilter}&user_id=${USER_ID}`
        );
        const data = await response.json();
        if (data.status === 200 && data.data) {
          const todosArray: Todo[] = Object.values(data.data);
          setTodos(todosArray);
        } else {
          setError(data.message || "Failed to fetch todos");
        }
      } catch (err) {
        setError("Network error while fetching todos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [statusFilter, USER_ID]);

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.item_id === updatedTodo.item_id ? updatedTodo : todo
      )
    );
    setEditingTodo(null); // close the modal
  };

  const filteredTodos = todos.filter((todo) =>
    todo.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addTodo = async () => {
    if (!newItemName.trim()) {
      setAddError("Item name is required");
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const payload = {
        item_name: newItemName.trim(),
        item_description: newItemDescription.trim(),
        user_id: USER_ID,
      };

      const response = await fetch(
        "https://todo-list.dcism.org/addItem_action.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.status === 200 && data.data) {
        setTodos((prev) => [...prev, data.data]);
        setIsAddingTodo(false);
        setNewItemName("");
        setNewItemDescription("");
      } else {
        setAddError(data.message || "Failed to add todo");
      }
    } catch (err) {
      setAddError("Network error while adding todo");
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.item_id === id
          ? {
              ...todo,
              status: todo.status === "active" ? "inactive" : "active",
            }
          : todo
      )
    );
  };

  const editTodo = (id: number) => {
    const todo = todos.find((t) => t.item_id === id);
    if (todo) {
      setEditingTodo(todo);
    }
  };

  const toggleTodoStatus = async (item_id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const payload = {
        status: newStatus,
        item_id,
      };

      const response = await fetch(
        "https://todo-list.dcism.org/statusItem_action.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.status === 200) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.item_id === item_id ? { ...todo, status: newStatus } : todo
          )
        );
        console.log(data);
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      alert("Network error while updating status" + err);
      console.error(err);
    }
  };

  const deleteTodo = async (item_id: number) => {
    try {
      const response = await fetch(
        `https://todo-list.dcism.org/deleteItem_action.php?item_id=${item_id}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        setTodos((prev) => prev.filter((todo) => todo.item_id !== item_id));
      } else {
        alert(data.message || "Failed to delete todo");
      }
    } catch (err) {
      alert("Network error while deleting todo");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Do Lista</h1>
        <Logo className="w-10 h-10" />
      </header>

      <div className="p-6">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {loading && (
          <div className="text-center text-gray-500 mb-4">Loading...</div>
        )}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.item_id}
            text={todo.item_name}
            isCompleted={todo.status !== "active"}
            date={todo.timemodified}
            onToggle={() => toggleTodoStatus(todo.item_id, todo.status)}
            onEdit={() => editTodo(todo.item_id)}
            onDelete={() => deleteTodo(todo.item_id)}
          />
        ))}

        {searchQuery && filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No matches found</div>
        )}

        {!searchQuery && filteredTodos.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No todos yet. Add one below!
          </div>
        )}
      </div>

      {/* Add Todo Sheet with inline form */}
      <div className="fixed bottom-20 left-6 right-6">
        <Sheet open={isAddingTodo} onOpenChange={setIsAddingTodo}>
          <SheetTrigger asChild>
            <Button className="w-full bg-[#7E69AB] hover:bg-[#6a5991] text-white py-3 rounded-lg">
              Add a todo
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px] p-6">
            <SheetHeader>
              <SheetTitle>Add New Todo</SheetTitle>
              <SheetDescription>
                Add a new task to your todo list
              </SheetDescription>
            </SheetHeader>

            {/* Inline Add Todo Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addTodo();
              }}
              className="flex flex-col gap-4 mt-4"
            >
              {addError && <p className="text-red-500 text-sm">{addError}</p>}

              <Input
                type="text"
                placeholder="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Item Description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingTodo(false)}
                  disabled={addLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {editingTodo && (
        <EditTodoModal
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          todo={editingTodo!}
          onUpdated={handleTodoUpdated}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Todos;
