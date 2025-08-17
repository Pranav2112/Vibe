import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi'
import { parseEther } from 'viem';
import { contractAddress, contractABI } from '../contract.js';

function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, isPending: isUpgrading } = useWriteContract();

  const coreConnector = connectors.find(c => c.id === 'core');

  const handleUpgrade = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'becomePremium',
      value: parseEther('0.2'), // Send 0.2 AVAX
    });
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="px-3 py-2 text-xs md:text-sm font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-500"
        >
          {isUpgrading ? 'Upgrading...' : 'Go Premium'}
        </button>
        <p className="px-3 py-2 text-xs md:text-sm font-semibold text-white bg-gray-700 rounded-lg">
          {address.slice(0, 5)}...{address.slice(-4)}
        </p>
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 text-xs md:text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      disabled={!coreConnector || isConnecting}
      onClick={() => connect({ connector: coreConnector })}
      className="px-4 py-2 text-md font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-500"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
export default ConnectWallet;