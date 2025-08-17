import React, { useState } from 'react';
import { useWriteContract } from 'wagmi';
import axios from 'axios';
import { contractAddress, contractABI } from '../contract.js';

function ProfileForm() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [hobby, setHobby] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { alert('Please select an image.'); return; }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    let imageIpfsHash = '';
    
    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_API_KEY,
        },
      });
      imageIpfsHash = res.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Image upload failed.");
      setIsUploading(false);
      return;
    }
    setIsUploading(false);

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'createOrUpdateProfile',
      args: [name, bio, imageIpfsHash, hobby, Number(age)],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-gray-800 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center">Create Your Profile</h2>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-1 bg-gray-700 rounded-md border border-gray-600" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 mt-1 bg-gray-700 rounded-md border border-gray-600" required />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-2 mt-1 bg-gray-700 rounded-md border border-gray-600" required />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium">Hobby</label>
          <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full p-2 mt-1 bg-gray-700 rounded-md border border-gray-600" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Profile Picture</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm mt-1" required />
      </div>
      <button type="submit" disabled={isPending || isUploading} className="w-full py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
        {isUploading ? 'Uploading Image...' : isPending ? 'Saving to Blockchain...' : 'Create Profile'}
      </button>
      {isSuccess && <p className="text-green-400 mt-2 text-center">Profile saved! You will be redirected shortly.</p>}
      {error && <p className="text-red-400 mt-2 text-center">Error: {error.shortMessage}</p>}
    </form>
  );
}
export default ProfileForm;

