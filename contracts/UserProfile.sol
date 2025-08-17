// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UserProfile
 * @dev A smart contract to store and manage decentralized user profiles on the Avalanche C-Chain.
 * It stores a user's IPFS hash for their profile image and includes premium functionality.
 *
 * This contract is designed to be lean and efficient for a hackathon environment.
 */
contract UserProfile {
    // --- State Variables ---

    // A struct to hold a user's profile information.
    // We are storing minimal data on-chain to keep gas costs low.
    struct Profile {
        string name;
        string bio;
        string imageIpfsHash;
        string hobby; // New field for user's hobby
        uint8 age;    // New field for user's age
        uint256 createdAt;
    }

    // Mapping from a user's wallet address to their Profile struct.
    // This allows for quick lookup of a specific user's profile.
    mapping(address => Profile) public profiles;

    // A list of all user addresses that have created a profile.
    // This is used to allow the frontend to easily fetch all profiles for browsing.
    address[] public userList;

    // A mapping to track the expiration timestamp of a user's premium membership.
    // A value of 0 means the user is not a premium member.
    mapping(address => uint256) public premiumExpiration;

    // --- Events ---

    // Emitted when a new profile is created or updated.
    // Events are crucial for off-chain indexing and monitoring.
    event ProfileCreated(address indexed userAddress);

    // Emitted when a user's premium status is updated.
    event PremiumStatusUpdated(address indexed userAddress, uint256 newExpirationTime);

    // --- Functions ---

    /**
     * @dev Allows a user to create or update their profile.
     * @param _name The user's display name.
     * @param _bio The user's short biography.
     * @param _imageIpfsHash The IPFS hash of the user's profile image.
     * @param _hobby The user's hobby.
     * @param _age The user's age.
     */
    function createOrUpdateProfile(
        string calldata _name,
        string calldata _bio,
        string calldata _imageIpfsHash,
        string calldata _hobby,
        uint8 _age
    ) external {
        // If the user is creating a profile for the first time, add them to the user list.
        if (profiles[msg.sender].createdAt == 0) {
            userList.push(msg.sender);
        }

        // Store or update the user's profile information.
        profiles[msg.sender] = Profile({
            name: _name,
            bio: _bio,
            imageIpfsHash: _imageIpfsHash,
            hobby: _hobby,
            age: _age,
            createdAt: block.timestamp
        });

        // Emit an event to signal that a profile was created or updated.
        emit ProfileCreated(msg.sender);
    }

    /**
     * @dev Allows a user to become a premium member by paying a fee of exactly 0.2 AVAX.
     * The fee is paid in AVAX and is sent to the contract.
     */
    function becomePremium() external payable {
        // A monthly premium is set to exactly 0.2 AVAX.
        uint256 monthlyFeeInWei = 2e17; // 0.2 * 10^18 Wei = 2 * 10^17 Wei
        
        // Ensure the user pays the exact amount.
        require(msg.value == monthlyFeeInWei, "Fee must be exactly 0.2 AVAX for a monthly premium.");
        
        // Calculate the new expiration time.
        uint256 thirtyDaysInSeconds = 30 days;
        uint256 newExpirationTime = block.timestamp + thirtyDaysInSeconds;
        
        // If the user's current premium is still valid, extend it from the current expiration time.
        if (premiumExpiration[msg.sender] > block.timestamp) {
            newExpirationTime = premiumExpiration[msg.sender] + thirtyDaysInSeconds;
        }

        // Update the user's premium status with the new expiration timestamp.
        premiumExpiration[msg.sender] = newExpirationTime;

        // Emit an event to signal the status change with the new expiration time.
        emit PremiumStatusUpdated(msg.sender, newExpirationTime);

        // NOTE: In a real app, the contract owner would be able to withdraw the funds.
        // For a hackathon, this simple logic is sufficient to demonstrate the concept.
    }

    /**
     * @dev A public view function to get the total number of users with a profile.
     * @return The number of users in the userList array.
     */
    function getUserCount() public view returns (uint256) {
        return userList.length;
    }

    /**
     * @dev A public view function to get the address of a user at a specific index.
     * @param _index The index of the user in the userList array.
     * @return The address of the user at the given index.
     */
    function getUserAddressByIndex(uint256 _index) public view returns (address) {
        require(_index < userList.length, "Index out of bounds");
        return userList[_index];
    }
}