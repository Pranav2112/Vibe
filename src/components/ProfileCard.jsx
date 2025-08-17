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

  if (isLoading) return <div className="bg-gray-800 p-6 rounded-lg animate-pulse h-80"></div>;
  if (!profile) return null;

  const [name, bio, imageIpfsHash, hobby, age] = profile;

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg text-center flex flex-col h-full">
      <img 
        src={`${IPFS_GATEWAY}${imageIpfsHash}`} 
        alt={name} 
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500" 
      />
      <div className="flex-grow">
        <h3 className="text-2xl font-bold">{name}, {Number(age)}</h3>
        <p className="text-blue-400 font-semibold">{hobby}</p>
        <p className="text-gray-400 mt-2">{bio}</p>
      </div>
      <div className="mt-4 bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-full inline-block">
        Trust Score: 85
      </div>
    </div>
  );
}
export default ProfileCard;