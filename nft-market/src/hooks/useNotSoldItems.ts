import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../helper/fetchMetadata";
import { marketContractAtom, nftContractAtom } from "../store";
import { Auction, Metadata } from "../types/type";
import { convertAuction } from "./useItemDetails";

export const useNotSoldItems = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [auctions, setAuctions] = useState<Auction[]>();

  useEffect(() => {
    fetchItems();
  }, [marketContract]);

  const fetchItems = async () => {
    if (!marketContract || !nftContract) return;

    try {
      const { response: contractRes } = await marketContract.getMarketItems();
      console.log(contractRes);

      const items: Auction[] = await Promise.all(
        contractRes.map(async (auction: any) => {
          const metadata = await fetchMetadata(auction, nftContract);
          const _auction = convertAuction(metadata, auction);
          return _auction;
        })
      );

      setAuctions(items);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    auctions,
  };
};
