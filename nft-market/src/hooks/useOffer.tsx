import { useDisclosure, UseDisclosureReturn, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useState } from "react";
import { marketContractAtom } from "../store";

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

  const makeOffer = async () => {
    if (!marketContract) return;

    try {
      setIsOfferLoading(true);
      const _ether = ethers.utils.parseEther(String(ether));
      const tx = await marketContract.addBid(tokenId, { value: _ether });
      await tx.wait();
      setError("");
      makeOfferModal.onClose();
      toast({
        status: "success",
        title: "Success to make offer!",
        position: "top-right",
        isClosable: true,
      });
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
