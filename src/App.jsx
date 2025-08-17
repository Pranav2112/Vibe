import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import Notifications from './pages/Notifications';
import Connections from './pages/Connections';

// Import the central contract details
import { contractAddress, contractABI } from './contract.js';

// Import Pages and Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProfileSetup from './pages/ProfileSetup';
import Browse from './pages/Browse';
import MyProfile from './pages/MyProfile';

// This is a helper component to manage the core application logic and routing
function AppController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();

  // Hook to read the user's profile from the smart contract
  const { data: profile, isLoading, isSuccess } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'profiles',
    args: [address],
    query: { enabled: isConnected },
  });

  // This useEffect hook handles all the automatic navigation
  useEffect(() => {
    if (!isConnected) {
      // If user is not connected, always send them to the home page
      if (location.pathname !== '/') navigate('/');
      return;
    }

    // If we are waiting for the profile data from the blockchain, don't do anything yet
    if (isLoading) return;

    // Once we have a definitive answer from the contract...
    if (isSuccess) {
      // The `createdAt` timestamp is at index 5 in the returned array. It's > 0 if a profile exists.
      const hasProfile = profile && profile[5] > 0;

      if (hasProfile) {
        // If they HAVE a profile, their main experience is browsing.
        // Redirect them to /browse if they land on the home or setup page.
        if (location.pathname === '/' || location.pathname === '/setup') {
          navigate('/browse');
        }
      } else {
        // If they DON'T have a profile, they must go to the setup page.
        if (location.pathname !== '/setup') {
          navigate('/setup');
        }
      }
    }
  }, [isConnected, isLoading, isSuccess, profile, navigate, location.pathname]);

  // Show a loading message while we check the blockchain
  if (isLoading && isConnected) {
    return <div className="text-center text-xl font-semibold">Loading your on-chain profile...</div>;
  }

  // Render the pages based on the URL
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<ProfileSetup />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/notifications" element={<Notifications />} /> {/* NEW */}
      <Route path="/connections" element={<Connections />} /> {/* NEW */}
    </Routes>
  );
}


// This is the main App component that sets up the layout
function App() {
  // NOTE: The <BrowserRouter> must be in your `main.jsx` file, NOT here.
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <AppController />
      </main>
    </div>
  );
}

export default App;