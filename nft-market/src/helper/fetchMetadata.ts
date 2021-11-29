import { ethers } from "ethers";
import { BunzzContractExtended } from "../../../../bunzz/bunzz-sdk/dist/domain/contract/bunzzContract";
import { Item } from "../hooks/useNotSoldItems";

export const fetchMetadata = async (
  item: any,
  nftContract: BunzzContractExtended
): Promise<Item> => {
  const buyoutPrice = Number(
    ethers.utils.formatUnits(item.buyoutPrice._hex, "ether")
  );
  const startingPrice = Number(
    ethers.utils.formatUnits(item.startingPrice._hex, "ether")
  );
  const tokenId = Number(ethers.utils.formatUnits(item.tokenId._hex, 0));
  const endDateTS = ethers.utils.formatUnits(item.auctionEndBlock._hex, 0);
  const startDateTS = ethers.utils.formatUnits(item.auctionStartBlock._hex, 0);
  const endDate = new Date(Number(endDateTS) * 1000);
  const startDate = new Date(Number(startDateTS) * 1000);
  const { response: tokenUri } = await nftContract.tokenURI(tokenId);
  const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
  const res = await fetch(url);
  const data = await res.json();

  return {
    tokenId,
    buyoutPrice,
    startingPrice,
    startDate,
    endDate,
    name: data.name,
    description: data.description,
    image: data.base64,
  };
};
