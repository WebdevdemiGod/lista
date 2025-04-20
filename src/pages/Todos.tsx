import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoItem from '@/components/TodoItem';
import BottomNav from '@/components/BottomNav';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import Logo from '@/components/Logo';
import AddTodo from '@/components/AddTodo';
import EditTodoModal from '@/components/EditTodoModal';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date?: string;
}

const Todos = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Load todos from localStorage when component mounts
  useEffect(() => {
    const savedTodos = localStorage.getItem('activeTodos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('activeTodos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter(todo => 
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTodo = (id: number) => {
    // Find the todo we're completing
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;

    if (!todoToToggle.isCompleted) {
      // If marking as complete, move to completed todos
      const completedTodos = JSON.parse(localStorage.getItem('completedTodos') || '[]');
      const updatedTodo = { ...todoToToggle, isCompleted: true };
      localStorage.setItem('completedTodos', JSON.stringify([...completedTodos, updatedTodo]));
      
      // Remove from active todos
      setTodos(todos.filter(todo => todo.id !== id));
    } else {
      // If marking as active, just update the state
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      ));
    }
  };

  const editTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
    }
  };

  const handleSaveEdit = (id: number, text: string, date: Date) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            text,
            date: date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          }
        : todo
    ));
    setEditingTodo(null);
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = (text: string, date: Date) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      isCompleted: false,
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
    setTodos([...todos, newTodo]);
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

        {searchQuery && filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No matches found
          </div>
        )}

        {!searchQuery && filteredTodos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No todos yet. Add one below!
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-6 right-6">
        <Sheet open={isAddingTodo} onOpenChange={setIsAddingTodo}>
          <SheetTrigger asChild>
            <Button
              className="w-full bg-[#7E69AB] hover:bg-[#6a5991] text-white py-3 rounded-lg"
            >
              Add a todo
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px]">
            <SheetHeader>
              <SheetTitle>Add New Todo</SheetTitle>
              <SheetDescription>
                Add a new task to your todo list
              </SheetDescription>
            </SheetHeader>
            <AddTodo
              onAdd={addTodo}
              onClose={() => setIsAddingTodo(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
      
      {editingTodo && (
        <EditTodoModal
          isOpen={true}
          onClose={() => setEditingTodo(null)}
          todo={editingTodo}
          onSave={handleSaveEdit}
        />
      )}
      
      <BottomNav />
    </div>
  );
};

export default Todos;