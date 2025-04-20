
import React, { useState } from 'react';
import TodoItem from '@/components/TodoItem';
import BottomNav from '@/components/BottomNav';
import Logo from '@/components/Logo';

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date?: string;
}

const CompletedTodos = () => {
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const handleRestore = (id: number) => {
    setCompletedTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    // You would also need to move this back to active todos in the parent component
  };

  const handleDelete = (id: number) => {
    setCompletedTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Completed Todos</h1>
        <Logo className="w-10 h-10" />
      </header>
      
      <div className="p-6">
        {completedTodos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            isCompleted={true}
            date={todo.date}
            onToggle={() => handleRestore(todo.id)}
            onDelete={() => handleDelete(todo.id)}
            onEdit={() => {}}
          />
        ))}
        
        {completedTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No completed todos
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default CompletedTodos;
