import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractABI } from '../contract.js';

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

function MyProfile() {
  const { address, isConnected } = useAccount();

  const { data: profile, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'profiles',
    args: [address],
    query: { enabled: isConnected },
  });

  if (!isConnected) return <p className="text-center">Please connect your wallet to see your profile.</p>;
  if (isLoading) return <p className="text-center">Loading your profile...</p>;
  if (!profile || profile[5] === 0) return <p className="text-center">You haven't created a profile yet.</p>;

  const [name, bio, imageIpfsHash, hobby, age] = profile;

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-lg">
      <div className="flex flex-col items-center">
        <img 
          src={`${IPFS_GATEWAY}${imageIpfsHash}`} 
          alt={name} 
          className="w-40 h-40 rounded-full object-cover border-4 border-blue-500" 
        />
        <h2 className="text-4xl font-bold mt-4">{name}, {Number(age)}</h2>
        <p className="text-blue-400 text-lg font-semibold mt-1">{hobby}</p>
        <p className="text-gray-300 mt-4 text-center">{bio}</p>
        <div className="mt-6 bg-green-500 text-white text-sm font-bold py-1 px-4 rounded-full">
          Trust Score: 85
        </div>
        <button className="mt-4 px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
export default MyProfile;