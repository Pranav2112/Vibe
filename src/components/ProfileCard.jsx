import React from 'react';
import { useReadContract } from 'wagmi';
import { contractAddress, contractABI } from '../contract.js';

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

function ProfileCard({ userAddress }) {
  const { data: profile, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'profiles',
    args: [userAddress],
  });

  // --- A skeleton loader for a better loading experience ---
  if (isLoading) {
    return (
      <div className="w-full max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-xl animate-pulse h-[450px]"></div>
    );
  }
  if (!profile) return null;

  const [name, bio, imageIpfsHash, hobby, age] = profile;

  // A simple banner color to add some variety
  const bannerColor = `bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500`;

  return (
    // --- Main Card Container ---
    <div className="w-full max-w-sm mx-auto bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300 h-[450px]">
      
      {/* --- Banner and Overlapping Profile Image --- */}
      <div className="relative">
        {/* Banner */}
        <div className={`h-28 ${bannerColor}`}></div>
        {/* Profile Image */}
        <img 
          src={`${IPFS_GATEWAY}${imageIpfsHash}`} 
          alt={name} 
          className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full object-cover border-4 border-slate-900 shadow-lg" 
        />
      </div>

      {/* --- Content Section --- */}
      <div className="p-6 pt-20 text-center flex flex-col flex-grow">
        {/* Name and Age */}
        <h2 className="text-2xl font-bold text-white">{name}, {Number(age)}</h2>
        
        {/* Hobby */}
        <p className="text-blue-400 font-medium mt-1">{hobby}</p>

        {/* Bio (with limited height to prevent overflow) */}
        <p className="text-gray-400 mt-4 text-sm h-16 overflow-hidden flex-grow">
          {bio}
        </p>
      </div>

      {/* --- Trust Score Badge --- */}
      <div className="pb-6 px-6">
        <div className="bg-green-500/20 border border-green-500 text-green-300 text-sm font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Verified Trust Score: 85</span>
        </div>
      </div>
    </div>
  );
}
export default ProfileCard;