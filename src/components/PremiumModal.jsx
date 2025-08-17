import React from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { contractAddress, contractABI } from '../contract.js';

function PremiumModal({ isOpen, onClose }) {
  const { writeContract, isPending } = useWriteContract();

  const handleUpgrade = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'becomePremium',
      value: parseEther('0.2'),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg text-center max-w-sm">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Upgrade to Premium!</h2>
        <p className="text-gray-300 mb-6">You've reached your daily swipe limit. Upgrade to Premium for unlimited swipes and more features.</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-600 rounded-lg font-semibold">Maybe Later</button>
          <button onClick={handleUpgrade} disabled={isPending} className="px-6 py-2 bg-yellow-500 text-black rounded-lg font-bold disabled:bg-gray-500">
            {isPending ? 'Processing...' : 'Upgrade (0.2 AVAX)'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default PremiumModal;