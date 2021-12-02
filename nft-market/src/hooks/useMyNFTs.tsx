import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { fetchMetadata } from "../helper/fetchMetadata";
import { marketContractAtom, nftContractAtom } from "../store";
import { Item, Metadata } from "../types/type";

export const useMyNFTs = () => {
  const [marketContract] = useAtom(marketContractAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [items, setItems] = useState<Item[]>();

  useEffect(() => {
    fetchMyNFTs();
  }, [marketContract]);

  const fetchMyNFTs = async () => {
    if (!marketContract || !nftContract) return;

    const { response: contractRes } = await marketContract.getMyNFTs();
    const items: Item[] = await Promise.all(
      contractRes.map(async (item: any) => {
        const metadata = await fetchMetadata(item, nftContract);
        const _item = convertItem(metadata, item);
        return _item;
      })
    );

    console.log(items);
    setItems(items);
  };

  return {
    items,
  };
};

export const convertItem = (metadata: Metadata, item: any): Item => {
  return {
    ...metadata,
    id: metadata.tokenId,
    owner: item.owner,
  };
};
