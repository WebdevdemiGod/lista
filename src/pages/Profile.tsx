import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from '@/components/BottomNav';
import { User, LogOut, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [email, setEmail] = useState('user@example.com');

  const handleSignOut = () => {
    // Will be implemented with Supabase
    console.log('Sign out clicked');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Profile</h1>
      </header>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="w-12 h-12 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Change Photo
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full bg-[#7E69AB] hover:bg-[#6a5991]"
            onClick={() => console.log('Save changes')}
          >
            Save Changes
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full gap-2 text-red-500 hover:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
