
import React, { useState } from 'react';
import TodoItem from '@/components/TodoItem';
import BottomNav from '@/components/BottomNav';
import { Button } from "@/components/ui/button";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Clean dog pooper', isCompleted: false },
    { id: 2, text: 'Clean dog pooper', isCompleted: true },
    { id: 3, text: 'Clean dog pooper', isCompleted: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  const editTodo = (id: number) => {
    // Add edit logic
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Vincent Todo</h1>
      </header>
      <div className="p-6">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            isCompleted={todo.isCompleted}
            onToggle={() => toggleTodo(todo.id)}
            onEdit={() => editTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>
      <div className="fixed bottom-20 left-6 right-6">
        <Button
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
