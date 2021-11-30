import { useEffect, useState } from "react";
import { bidsAtom, marketContractAtom, nftContractAtom } from "../store";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { fetchMetadata } from "../helper/fetchMetadata";
import { Bid, Item } from "../types/type";
import { ethers } from "ethers";

export const useItemDetails = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const router = useRouter();
  const tokenId =
    typeof router.query.tokenId === "string" ? router.query.tokenId : undefined;

  const [item, setItem] = useState<Item>();
  const [bids, setBids] = useAtom(bidsAtom);

  useEffect(() => {
    fetchItem();
    fetchBids();
  }, [tokenId, marketContract, nftContract]);

  const fetchItem = async () => {
    if (!marketContract || !tokenId || !nftContract) return;

    const { response: contractRes } = await marketContract.getAuctionForTokenId(
      tokenId
    );
    const item = await fetchMetadata(contractRes, nftContract);
    setItem(item);
  };

  const fetchBids = async () => {
    if (!marketContract || !tokenId || !nftContract) return;

    const { response: contractRes } = await marketContract.getAuctionBids(
      tokenId
    );
    const bids = convertBids(contractRes);
    setBids(bids);
  };

  return {
    item,
    bids,
  };
};

const convertBids = (bids: any): Bid[] => {
  let _bids: Bid[] = [];
  for (let i = 0; i < bids.bidAmount.length; i++) {
    _bids[i] = {
      amount: Number(ethers.utils.formatUnits(bids.bidAmount[i])),
      proposer: bids.bidProposer[i],
    };
  }
  return _bids;
};
