import { ethers } from "ethers";
import { BunzzContractExtended } from "../../../../bunzz/bunzz-sdk/dist/domain/contract/bunzzContract";
import { Metadata } from "../types/type";

export const fetchMetadata = async (
  item: any,
  nftContract: BunzzContractExtended
): Promise<Metadata> => {
  const tokenId = Number(ethers.utils.formatUnits(item.tokenId._hex, 0));

  const { response: tokenUri } = await nftContract.tokenURI(tokenId);
  const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
  const res = await fetch(url);
  const data = await res.json();

  return {
    tokenId,
    name: data.name,
    description: data.description,
    image: data.base64,
  };
};
