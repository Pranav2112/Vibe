import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAccount } from 'wagmi';

function Notifications() {
  const { address } = useAccount();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', address],
    queryFn: () => axios.get(`/api/get-notifications?userAddress=${address}`).then(res => res.data),
    enabled: !!address,
  });

  if (isLoading) return <p>Loading notifications...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications.map(noti => (
            <div key={noti.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              {noti.type === 'NEW_LIKE' && (
                <p>
                  Someone is interested in you!{' '}
                  <Link to={`/profile/${noti.actorAddress}`} className="text-blue-400 font-semibold hover:underline">
                    View their profile.
                  </Link>
                </p>
              )}
              {noti.type === 'NEW_MATCH' && (
                <p>
                  🎉 You have a new match! You can now chat with them in your{' '}
                  <Link to="/connections" className="text-green-400 font-semibold hover:underline">
                    Connections.
                  </Link>
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">You have no new notifications.</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;