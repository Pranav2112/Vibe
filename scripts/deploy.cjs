async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const UserProfile = await ethers.getContractFactory("UserProfile");
  const contract = await UserProfile.deploy();

  await contract.waitForDeployment(); // instead of contract.deployed()
  console.log("UserProfile deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
