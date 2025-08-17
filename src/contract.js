// This is your final, live contract address from the deployment
export const contractAddress = '0xCCe923b6AE451cB72F3E4e1B5387Ea130d2Ae59C';

// This is the ABI from your `UserProfile.json` artifact file
export const contractABI = [
  {
    "anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "userAddress", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "newExpirationTime", "type": "uint256"}], "name": "PremiumStatusUpdated", "type": "event"
  },
  {
    "anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "userAddress", "type": "address"}], "name": "ProfileCreated", "type": "event"
  },
  {
    "inputs": [], "name": "becomePremium", "outputs": [], "stateMutability": "payable", "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_bio", "type": "string"}, {"internalType": "string", "name": "_imageIpfsHash", "type": "string"}, {"internalType": "string", "name": "_hobby", "type": "string"}, {"internalType": "uint8", "name": "_age", "type": "uint8"}], "name": "createOrUpdateProfile", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_index", "type": "uint256"}], "name": "getUserAddressByIndex", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [], "name": "getUserCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "premiumExpiration", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "profiles", "outputs": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "bio", "type": "string"}, {"internalType": "string", "name": "imageIpfsHash", "type": "string"}, {"internalType": "string", "name": "hobby", "type": "string"}, {"internalType": "uint8", "name": "age", "type": "uint8"}, {"internalType": "uint256", "name": "createdAt", "type": "uint256"}], "stateMutability": "view", "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "userList", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"
  }
];