import { useEffect, useState } from "react";
import { bidsAtom, marketContractAtom, nftContractAtom } from "../store";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { fetchMetadata } from "../helper/fetchMetadata";
import { Bid, Auction, Metadata } from "../types/type";
import { ethers } from "ethers";

export const useItemDetails = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const router = useRouter();
  const tokenId =
    typeof router.query.tokenId === "string" ? router.query.tokenId : undefined;

  const [auction, setAuction] = useState<Auction>();
  const [bids, setBids] = useAtom(bidsAtom);

  useEffect(() => {
    fetchAuction();
    fetchBids();
  }, [tokenId, marketContract, nftContract]);

  const fetchAuction = async () => {
    if (!marketContract || !tokenId || !nftContract) return;

    const { response: contractRes } = await marketContract.getAuctionForTokenId(
      tokenId
    );
    const metadata = await fetchMetadata(contractRes, nftContract);
    const item = convertAuction(metadata, contractRes);

    setAuction(item);
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
    auction,
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

export const convertAuction = (metadata: Metadata, auction: any): Auction => {
  const buyoutPrice = Number(
    ethers.utils.formatUnits(auction.buyoutPrice._hex, "ether")
  );
  const startingPrice = Number(
    ethers.utils.formatUnits(auction.startingPrice._hex, "ether")
  );
  const endDateTS = ethers.utils.formatUnits(auction.auctionEndBlock._hex, 0);
  const startDateTS = ethers.utils.formatUnits(
    auction.auctionStartBlock._hex,
    0
  );
  const endDate = new Date(Number(endDateTS) * 1000);
  const startDate = new Date(Number(startDateTS) * 1000);

  return {
    ...metadata,
    buyoutPrice,
    startingPrice,
    endDate,
    startDate,
    sold: auction.sold,
  };
};
