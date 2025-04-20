
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoItem from '@/components/TodoItem';
import BottomNav from '@/components/BottomNav';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from 'lucide-react';
import Logo from '@/components/Logo';

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date?: string;
}

const Todos = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Clean dog pooper', isCompleted: false, date: 'Jun 10, 2024' },
    { id: 2, text: 'Clean dog pooper', isCompleted: true, date: 'Jun 10, 2024' },
    { id: 3, text: 'Clean dog pooper', isCompleted: true, date: 'Jun 10, 2024' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const editTodo = (id: number) => {
    navigate(`/todos/edit/${id}`);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vincent Todo</h1>
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            isCompleted={todo.isCompleted}
            date={todo.date}
            onToggle={() => toggleTodo(todo.id)}
            onEdit={() => editTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>

      <div className="fixed bottom-20 left-6 right-6">
        <Button
          onClick={() => navigate('/todos/add')}
          className="w-full bg-[#7E69AB] hover:bg-[#6a5991] text-white py-3 rounded-lg"
        >
          Add a todo
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Todos;
