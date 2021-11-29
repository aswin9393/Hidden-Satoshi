import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../helper/fetchMetadata";
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
        contractRes.map((item: any) => fetchMetadata(item, nftContract))
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
