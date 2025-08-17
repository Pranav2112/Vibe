import { useState, useEffect } from 'react';
// THE FIX IS ON THIS LINE: Added `useReadContract`
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { contractAddress, contractABI } from '../contract.js';

/**
 * This custom hook manages all the logic for fetching and filtering profiles.
 * @returns {{profiles: string[], isLoading: boolean}} An object containing the list of other user addresses and a loading state.
 */
export function useProfiles() {
  const { address: myAddress } = useAccount();
  const [otherUserAddresses, setOtherUserAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. First, get the total count of users
  const { data: userCountResult } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getUserCount',
  });
  const userCount = userCountResult ? Number(userCountResult) : 0;

  // 2. Based on the count, create an array of contract calls to get all addresses by their index.
  const userListContracts = [];
  for (let i = 0; i < userCount; i++) {
    userListContracts.push({
      address: contractAddress,
      abi: contractABI,
      functionName: 'getUserAddressByIndex',
      args: [i],
    });
  }
  
  // 3. Fetch all addresses in a single, efficient batch call.
  const { data: results, isSuccess } = useReadContracts({
    contracts: userListContracts,
    query: { enabled: userCount > 0 },
  });

  // 4. This effect runs once the addresses are fetched, to filter them.
  useEffect(() => {
    if (isSuccess && myAddress && results) {
      const allUserAddresses = results.map(result => result.result);
      
      const filteredAddresses = allUserAddresses.filter(
        addr => addr && addr.toLowerCase() !== myAddress.toLowerCase()
      );
      
      setOtherUserAddresses(filteredAddresses);
      setIsLoading(false);
    } else if (userCount === 0) {
      setIsLoading(false);
    }
  }, [results, isSuccess, myAddress, userCount]);

  return { profiles: otherUserAddresses, isLoading };
}