import { useDisclosure, UseDisclosureReturn, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useState } from "react";
import { bidsAtom, marketContractAtom, userAddressAtom } from "../store";

export type UseOfferReturns = {
  isOfferLoading: boolean;
  makeOfferModal: UseDisclosureReturn;
  ether: number;
  error: string;
  makeOffer: () => void;
  setEther: Dispatch<SetStateAction<number>>;
};

export const useOffer = (tokenId: number): UseOfferReturns => {
  const [marketContract] = useAtom(marketContractAtom);
  const [isOfferLoading, setIsOfferLoading] = useState(false);
  const makeOfferModal = useDisclosure();
  const [ether, setEther] = useState(0);
  const [error, setError] = useState("");
  const toast = useToast();
  const [, setBids] = useAtom(bidsAtom);
  const [userAddress] = useAtom(userAddressAtom);

  const makeOffer = async () => {
    if (!marketContract) return;

    try {
      setIsOfferLoading(true);
      const _ether = ethers.utils.parseEther(String(ether));
      const { response: contractRes } =
        await marketContract.getAuctionForTokenId(tokenId);
      const buyoutPrice = Number(
        ethers.utils.formatUnits(contractRes.buyoutPrice._hex, "ether")
      );

      const tx = await marketContract.addBid(tokenId, { value: _ether });
      await tx.wait();
      setError("");
      setBids((bids) => [...bids, { amount: ether, proposer: userAddress }]);
      makeOfferModal.onClose();

      if (buyoutPrice === ether) {
        toast({
          status: "success",
          title: "You got this NFT🎉",
          position: "top-right",
          isClosable: true,
        });
      } else {
        toast({
          status: "success",
          title: "Success to make offer!",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      setError(error.data.message);
      console.error(error);
    } finally {
      setIsOfferLoading(false);
    }
  };

  return {
    isOfferLoading,
    makeOfferModal,
    ether,
    error,
    makeOffer,
    setEther,
  };
};
