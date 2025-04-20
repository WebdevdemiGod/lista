
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="flex justify-around items-center">
        <Link 
          to="/todos" 
          className={`flex flex-col items-center p-2 ${currentPath === '/todos' ? 'text-[#7E69AB]' : 'text-gray-400'}`}
        >
          <span className="text-xs">ToDo</span>
        </Link>
        <Link 
          to="/completed" 
          className={`flex flex-col items-center p-2 ${currentPath === '/completed' ? 'text-[#7E69AB]' : 'text-gray-400'}`}
        >
          <span className="text-xs">Completed</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 ${currentPath === '/profile' ? 'text-[#7E69AB]' : 'text-gray-400'}`}
        >
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
