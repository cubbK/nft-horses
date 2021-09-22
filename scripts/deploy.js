var fs = require("fs");

async function main() {
  const user1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const user2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const atgUser = "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65";
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy();
  console.log("Contract deployed to address:", myNFT.address);

  await hre.ethernal.push({
    name: "MyNFT",
    address: myNFT.address,
  });

  fs.writeFileSync(
    "./src/contractMetadata.json",
    JSON.stringify({
      address: myNFT.address,
      user1,
      user2,
      atgUser,
    }),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  await myNFT.mintNFT(
    user1,
    "https://gateway.pinata.cloud/ipfs/QmZTANcaGBNDkxjgrwYibeSzGwa4nCKKAvCRHf45tK87PV/horse1-metadata.json"
  );

  await myNFT.mintNFT(
    user1,
    "https://gateway.pinata.cloud/ipfs/QmZTANcaGBNDkxjgrwYibeSzGwa4nCKKAvCRHf45tK87PV/horse2-metadata.json"
  );

  await myNFT.mintNFT(
    user2,
    "https://gateway.pinata.cloud/ipfs/QmZTANcaGBNDkxjgrwYibeSzGwa4nCKKAvCRHf45tK87PV/horse3-metadata.json"
  );

  // const winner = await myNFT.doTheRace();
  // console.log("The winner is:", Number(winner));
  // const get = await myNFT.getAllNFTs();
  // console.log("GetAll", get);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
