import { YoutubeIcon } from "../icons/YoutubeItem";
import { SidebarItem } from "./SidebarItem";
import { TwitterIcon } from "../icons/TwitterIcon";
import { Logo } from "../icons/Logo";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onFilterChange: (filter: string) => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [_filter, setFilter] = useState("All");
  const router = useNavigate();

  // Fetch user on load
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(`${BACKEND_URL}/api/v1/me`, {
          headers: { Authorization: token },
        });
        console.log("User data:", response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, []);

  const handleFilterClick = (type: string) => {
    setFilter(type); 
    onFilterChange(type); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router("/signin");
  };

  return (
    <div className="bg-white h-screen w-72 border-r fixed top-0 left-0 flex flex-col p-4">
      {/* Logo */}
      <div className="text-2xl flex items-center mb-6">
        <div className="pr-2 text-purple-400"><Logo size="lg" /></div> Brainly
      </div>

      {/* Filters */}
      <div className="flex-1 space-y-2">
        <SidebarItem
          text="YouTube"
          icon={<YoutubeIcon size="md" />}
          onClick={() => handleFilterClick("youtube")}
        />
        <SidebarItem
          text="Twitter"
          icon={<TwitterIcon size="md" />}
          onClick={() => handleFilterClick("twitter")}
        />
        <SidebarItem text="All" onClick={() => handleFilterClick("all")} />
      </div>

    
      <div className="mb-10">
        <button
          onClick={handleLogout}
          className="w-full bg-gray-200  text-black text-white py-2 px-4 rounded hover:bg-gray-400 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
