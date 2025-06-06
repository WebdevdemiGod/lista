import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import EditTodoModal from "@/components/EditTodoModal";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/components/Logo";

interface Todo {
  item_id: number;
  item_name: string;
  item_description: string;
  status: string;
  user_id: number;
  timemodified: string;
}

function getUpdatedUserFromLocalStorage() {
  const userString = localStorage.getItem("user");
  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
}

const CompletedTodos = () => {
  const USER_ID = getUpdatedUserFromLocalStorage()?.data?.id;
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://todo-list.dcism.org/getItems_action.php?status=inactive&user_id=${USER_ID}`
        );
        const data = await response.json();
        if (data.status === 200 && data.data) {
          const todosArray: Todo[] = Object.values(data.data);
          setCompletedTodos(todosArray);
        } else {
          setError(data.message || "Failed to fetch completed todos");
        }
      } catch (err) {
        setError("Network error while fetching completed todos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTodos();
  }, [USER_ID]);

  const deleteTodo = async (item_id: number) => {
    try {
      const response = await fetch(
        `https://todo-list.dcism.org/deleteItem_action.php`,
        {
          method: "POST", // Changed from DELETE to POST
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            item_id: item_id.toString(),
          }).toString(),
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        setCompletedTodos((prev) =>
          prev.filter((todo) => todo.item_id !== item_id)
        );
      } else {
        const errorMessage = data.message || "Failed to delete todo";
        alert(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(`Network error while deleting todo: ${errorMessage}`);
      console.error("Delete todo error:", err);
    }
  };

  // Open edit modal for selected todo
  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  // Update todo in local state after edit
  const handleTodoUpdated = (updatedTodo: Todo) => {
    setCompletedTodos((prev) =>
      prev.map((todo) =>
        todo.item_id === updatedTodo.item_id ? updatedTodo : todo
      )
    );
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  // Filter by search query
  const filteredTodos = completedTodos.filter((todo) =>
    todo.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add this toggle function inside CompletedTodos component

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
        setCompletedTodos((prev) =>
          prev.filter((todo) => todo.item_id !== item_id)
        );
      } else {
        alert(data.message || "Failed to update todo status");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(`Network error while updating todo status: ${errorMessage}`);
      console.error("Toggle todo status error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Completed Todos</h1>
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
            isCompleted={true}
            date={todo.timemodified}
            onToggle={() => toggleTodoStatus(todo.item_id, todo.status)} // <-- toggle status here
            onEdit={() => handleEditClick(todo)}
            onDelete={() => deleteTodo(todo.item_id)}
          />
        ))}

        {searchQuery && filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">No matches found</div>
        )}

        {!searchQuery && filteredTodos.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No completed todos yet.
          </div>
        )}
      </div>

      <BottomNav />

      {/* Edit Todo Modal */}
      {editingTodo && (
        <EditTodoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          todo={editingTodo}
          onUpdated={handleTodoUpdated}
        />
      )}
    </div>
  );
};

export default CompletedTodos;
