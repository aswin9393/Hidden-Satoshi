import { useEffect, useState } from "react";
import { marketContractAtom, nftContractAtom } from "../store";
import { Item } from "./useNotSoldItems";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { fetchMetadata } from "../helper/fetchMetadata";

export const useItemDetails = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [item, setItem] = useState<Item>();
  const router = useRouter();
  const tokenId =
    typeof router.query.tokenId === "string" ? router.query.tokenId : undefined;

  useEffect(() => {
    fetchItem();
  }, [tokenId, marketContract, nftContract]);

  const fetchItem = async () => {
    if (!marketContract || !tokenId || !nftContract) return;

    const { response: contractRes } = await marketContract.getAuctionForTokenId(
      tokenId
    );
    const item = await fetchMetadata(contractRes, nftContract);
    setItem(item);
  };

  return {
    item,
  };
};
