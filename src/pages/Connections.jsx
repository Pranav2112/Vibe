import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import ProfileCard from '../components/ProfileCard';

function Connections() {
  const { address } = useAccount();

  const { data: connectedAddresses, isLoading } = useQuery({
    queryKey: ['connections', address],
    queryFn: () => axios.get(`/api/get-connections?userAddress=${address}`).then(res => res.data),
    enabled: !!address,
  });

  if (isLoading) return <p>Loading your connections...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Connections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {connectedAddresses?.map(addr => (
          <ProfileCard key={addr} userAddress={addr} />
        ))}
      </div>
    </div>
  );
}
export default Connections;