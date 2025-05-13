import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Logo from "@/components/Logo";
import { axiosInstance } from "@/api/backendApi";

interface Todo {
  item_id: number;
  item_name: string;
  item_description: string;
  status: string;
  user_id: number;
  timemodified: string;
}

const userString = localStorage.getItem("user");
const user = userString ? JSON.parse(userString) : null;
const USER_ID = user?.data?.id; // or user?.user_id depending on your API response

const CompletedTodos = () => {
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          import.meta.env.VITE_API_GET_TODO,
          {
            params: {
              status: "inactive",
              user_id: USER_ID,
            },
          }
        );
        const data = response.data;
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
  }, []);

  // Filter by search query
  const filteredTodos = completedTodos.filter((todo) =>
    todo.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            // You can add onToggle/onEdit/onDelete here if you want to allow actions on completed todos
            onToggle={() => {}} // Optional: implement re-activate if desired
            onEdit={() => {}} // Optional: implement edit if desired
            onDelete={() => {}} // Optional: implement delete if desired
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
    </div>
  );
};

export default CompletedTodos;
