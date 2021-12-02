import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../helper/fetchMetadata";
import { marketContractAtom, nftContractAtom } from "../store";
import { Auction } from "../types/type";
import { convertAuction } from "./useItemDetails";

export const useFinishedAuctions = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [auctions, setAuctions] = useState<Auction[]>();

  useEffect(() => {
    fetch();
  }, [marketContract]);

  const fetch = async () => {
    if (!marketContract || !nftContract) return;

    const { response: contractRes } = await marketContract.getFinishedItems();
    const items: Auction[] = await Promise.all(
      contractRes.map(async (auction: any) => {
        const metadata = await fetchMetadata(auction, nftContract);
        const _auction = convertAuction(metadata, auction);
        return _auction;
      })
    );

    setAuctions(items);
  };

  return {
    auctions,
  };
};
