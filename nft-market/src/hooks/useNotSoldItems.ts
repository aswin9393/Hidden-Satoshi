import { ethers } from "ethers";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { marketContractAtom, nftContractAtom } from "../store";

export type Item = {
  tokenId: number;
  buyoutPrice: number;
  startingPrice: number;
  name: string;
  description: string;
  image: string;
  endDate: Date;
  startDate: Date;
};

export const useNotSoldItems = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {
    fetchItems();
  }, [marketContract]);

  const fetchItems = async () => {
    if (!marketContract || !nftContract) return;

    try {
      const { response: contractRes } = await marketContract._getMarketItems();
      console.log(contractRes);

      const items: Item[] = await Promise.all(
        contractRes.map(async (item: any) => {
          const buyoutPrice = ethers.utils.formatUnits(
            item.buyoutPrice._hex,
            "ether"
          );
          const startingPrice = ethers.utils.formatUnits(
            item.startingPrice._hex,
            "ether"
          );
          const tokenId = ethers.utils.formatUnits(item.tokenId._hex, 0);
          const endDateTS = ethers.utils.formatUnits(
            item.auctionEndBlock._hex,
            0
          );
          const startDateTS = ethers.utils.formatUnits(
            item.auctionStartBlock._hex,
            0
          );
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
        })
      );

      setItems(items);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    items,
  };
};
