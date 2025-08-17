import React from 'react';

function Home() {
  return (
    <div className="text-center mt-20">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Vibe!</h2>
      <p className="text-lg text-gray-400 mb-8">A decentralized, secure, and transparent platform.<br/>Connect your wallet to begin your journey.</p>
      {/* The ConnectWallet button is in the Navbar */}
    </div>
  );
}
export default Home;