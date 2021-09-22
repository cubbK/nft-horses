import * as React from "react";
import { ethers } from "ethers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MyNFT from "./artifacts/contracts/MyNFT.sol/MyNFT.json";
import Button from "@mui/material/Button";
import RaceTrack from "./RaceTrack";
import { breedHorse } from "./breedHorse";

const metadata = require("./contractMetadata.json");

export async function fetchContract() {
  await window.ethereum.enable();
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(metadata.address, MyNFT.abi, signer);
    return contract;
  }
}
async function computeRaceResult() {
  const contract = await fetchContract();
  await contract.doTheRace();
  const winner = Number(await contract.getRaceResult());

  // post winner to node app after a small timeout
  setTimeout(async () => {
    console.log(winner + 1);
    fetch("http://localhost:3001/finishRace?winner=" + (winner + 1));
  }, 5000);

  return winner;
}

async function fetchNFTsMetadata() {
  const contract = await fetchContract();

  const allNFTs = await contract.getAllNFTs();
  console.log({ allNFTs });
  const arrOfPromises = allNFTs.map((nft) =>
    fetch(nft).then((response) => {
      console.log("fetching nft" + nft);
      return response.json();
    })
  );
  return Promise.all(arrOfPromises);
}

function App() {
  const [data, setData] = React.useState(undefined);
  const [winner, setWinner] = React.useState(undefined);

  async function getRaceResult() {
    const raceResult = await computeRaceResult();
    setWinner(Number(raceResult));
  }

  React.useEffect(() => {
    fetchNFTsMetadata().then((response) => setData(response));
  }, []);

  if (!data) {
    return null;
  }
  console.log(data);
  return (
    <div className="App">
      <RaceTrack winner={winner} data={data} />
      <Button onClick={getRaceResult}>Race</Button>
      <Button onClick={() => breedHorse(1, 2)}>BreedHorse</Button>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <Typography variant="h4" component="div" gutterBottom>
          Horse NFTs
        </Typography>
        {data.map((horseMetadata) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={horseMetadata.image} />
              </ListItemAvatar>
              <ListItemText
                primary={`Age: ${horseMetadata.age}, Fitness: ${horseMetadata.fitness}`}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {horseMetadata.name}
                    </Typography>
                    {` — ${horseMetadata.description}`}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </div>
  );
}

export default App;
