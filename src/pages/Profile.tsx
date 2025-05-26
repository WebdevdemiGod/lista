import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from '@/components/BottomNav';
import { User, LogOut, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  status: number;
  data: {
    id: string;
    email: string;
    name?: string;
    profile_image?: string;
  };
  message: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        setUserData(user);
        setEmail(user.data.email || '');
        setProfileImage(user.data.profile_image || '');
      } catch (err) {
        console.error('Error parsing user data:', err);
        // If user data is corrupted, redirect to login
        navigate('/login');
      }
    } else {
      // No user data found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const handleSignOut = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.data.name) {
      return userData.data.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E69AB] mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Profile</h1>
      </header>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profileImage} />
            <AvatarFallback>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#7E69AB] text-white text-2xl font-semibold">
                  {getUserInitials()}
                </div>
              )}
            </AvatarFallback>
          </Avatar>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="profile-image-input"
            />
            <Button variant="outline" className="gap-2" asChild>
              <label htmlFor="profile-image-input" className="cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Change Photo
              </label>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-500">Email</label>
            <Input
              type="email"
              value={email}
              readOnly
              disabled
              className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
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