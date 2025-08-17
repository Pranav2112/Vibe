import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ConnectWallet from './ConnectWallet';

const Navbar = () => {
  const { isConnected, address } = useAccount();

  const { data: notifications } = useQuery({
    queryKey: ['notifications', address],
    queryFn: async () => {
      const { data } = await axios.get(`/api/get-notifications?userAddress=${address}`);
      return data;
    },
    enabled: isConnected && !!address,
    refetchInterval: 5000,
  });

  // --- DEBUGGING LOG ---
  // This will show us what the `notifications` variable actually contains.
  console.log("Notifications data from API:", notifications);

  // --- THE FIX ---
  // We first check if `notifications` is an array before trying to filter it.
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => !n.isRead).length 
    : 0;

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-700">
      <Link to="/" className="text-xl md:text-2xl font-bold">❄️ Vibe</Link>
      
      {isConnected && (
        <div className="hidden md:flex items-center gap-8 font-semibold">
          <NavLink to="/browse" className={({ isActive }) => isActive ? "text-blue-400" : "text-white"}>Discover</NavLink>
          <NavLink to="/connections" className={({ isActive }) => isActive ? "text-blue-400" : "text-white"}>Connections</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-400" : "text-white"}>My Profile</NavLink>
          
          <NavLink to="/notifications" className="relative">
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                {unreadCount}
              </span>
            )}
          </NavLink>
        </div>
      )}

      <ConnectWallet />
    </nav>
  );
};

export default Navbar;