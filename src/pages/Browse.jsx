// import React from 'react';
// import { useReadContract } from 'wagmi';
// import ProfileCard from '../components/ProfileCard';
// import { contractAddress, contractABI } from '../contract.js';

// function Browse() {
//   const { data: userCount, isLoading: isCountLoading } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'getUserCount',
//   });

//   if (isCountLoading) {
//     return <div className="text-center">Loading users...</div>;
//   }
  
//   const totalUsers = Number(userCount || 0);
//   const userIndexes = Array.from({ length: totalUsers }, (_, i) => i);

//   return (
//     <div>
//       <h2 className="text-3xl font-bold mb-8 text-center">Browse Profiles</h2>
//       {totalUsers === 0 ? (
//         <p className="text-center text-gray-400">No profiles created yet. Be the first!</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {userIndexes.map(index => (
//             <UserFetcher key={index} index={index} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function UserFetcher({ index }) {
//   const { data: userAddress } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'getUserAddressByIndex',
//     args: [index],
//   });

//   return userAddress ? <ProfileCard userAddress={userAddress} /> : null;
// }
// export default Browse;


// import React, { useState, useEffect, useMemo } from 'react';
// import { useAccount, useReadContract } from 'wagmi';
// import TinderCard from 'react-tinder-card';
// import ProfileCard from '../components/ProfileCard';
// import PremiumModal from '../components/PremiumModal'; // We'll create this
// import { contractAddress, contractABI } from '../contract.js';

// function Browse() {
//   const { address: myAddress } = useAccount();
//   const [profiles, setProfiles] = useState([]);
//   const [showPremiumModal, setShowPremiumModal] = useState(false);
  
//   // Fetch all user addresses from the contract
//   const { data: allUserAddresses, isLoading } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'userList',
//   });

//   // Filter out the current user's address and set the profiles
//   useEffect(() => {
//     if (allUserAddresses) {
//       const otherUsers = allUserAddresses.filter(addr => addr.toLowerCase() !== myAddress?.toLowerCase());
//       setProfiles(otherUsers);
//     }
//   }, [allUserAddresses, myAddress]);

//   const onSwipe = async (direction, swipedAddress) => {
//     try {
//       const response = await fetch('/api/record-like', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           likerAddress: myAddress, 
//           likedAddress: swipedAddress, 
//           direction 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (response.status === 403) { // Swipe limit reached
//           setShowPremiumModal(true);
//         }
//         throw new Error(data.error || 'Failed to record swipe');
//       }

//       if (data.match) {
//         alert("It's a Match!"); // In a real app, you'd show a nice notification
//       }
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const onCardLeftScreen = (address) => {
//     setProfiles(prev => prev.filter(p => p !== address));
//   };
  
//   if (isLoading) return <p className="text-center">Finding potential matches...</p>;

//   return (
//     <>
//       <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
//       <div className="w-full max-w-md mx-auto flex flex-col items-center">
//         <h1 className="text-3xl font-bold mb-4">Discover</h1>
//         <div className="w-full h-[60vh] relative">
//           {profiles.length > 0 ? (
//             profiles.map((userAddress) => (
//               <TinderCard
//                 className="absolute"
//                 key={userAddress}
//                 onSwipe={(dir) => onSwipe(dir, userAddress)}
//                 onCardLeftScreen={() => onCardLeftScreen(userAddress)}
//                 preventSwipe={['up', 'down']}
//               >
//                 <ProfileCard userAddress={userAddress} />
//               </TinderCard>
//             ))
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-center text-gray-400">No more profiles to show. Check back later!</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
// export default Browse;




import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useProfiles } from '../hooks/useProfiles'; // Import our new hook
import ProfileCard from '../components/ProfileCard';
import PremiumModal from '../components/PremiumModal';

function Browse() {
  const { address: myAddress } = useAccount();
  // 1. Get the clean, filtered list of profiles from our custom hook.
  const { profiles: initialProfiles, isLoading } = useProfiles();
  
  const [profiles, setProfiles] = useState([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // 2. When the initial profiles are loaded, set them into our local state for manipulation (removing swiped cards).
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const handleAction = async (direction, likedAddress) => {
    // 3. After an action, remove the top card from the deck to show the next one.
    setProfiles(prevProfiles => prevProfiles.slice(1));
    
    // 4. If it was a 'like', send the data to our backend API.
    if (direction === 'right') {
      try {
        const response = await fetch('/api/record-like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            likerAddress: myAddress, 
            likedAddress: likedAddress, 
            direction: 'right' 
          }),
        });

        const data = await response.json();
        if (!response.ok && response.status === 403) {
          setShowPremiumModal(true); // Show premium modal if swipe limit is reached
          return;
        }
        if (data.match) {
          // The backend found a mutual match!
          alert("🎉 It's a Match! You can see them in your Connections. 🎉");
        }
      } catch (error) { console.error("Failed to record like:", error); }
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-400">Finding potential matches...</p>;
  }

  // Get the profile at the top of the deck.
  const currentProfileAddress = profiles[0];

  return (
    <>
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Discover</h1>
        <div className="w-full h-[60vh] relative flex items-center justify-center">
          {currentProfileAddress ? (
            <ProfileCard userAddress={currentProfileAddress} />
          ) : (
            <div className="text-center text-gray-400">
              <p>No more profiles to show.</p>
              <p>Check back later!</p>
            </div>
          )}
        </div>
        
        {currentProfileAddress && (
          <div className="flex gap-8 mt-8">
            <button onClick={() => handleAction('left', currentProfileAddress)} className="bg-white text-red-500 border-2 border-red-500 rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold transition transform hover:scale-110">❌</button>
            <button onClick={() => handleAction('right', currentProfileAddress)} className="bg-white text-green-500 border-2 border-green-500 rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold transition transform hover:scale-110">💚</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Browse;