import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { NFTStorage } from "nft.storage";
import { ChangeEventHandler, useState } from "react";
import {
  handlerAtom,
  marketContractAtom,
  nftContractAtom,
  userAddressAtom,
} from "../store";

const nftStorage = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY ?? "",
});

const store = async (
  name: string,
  description: string,
  data: ArrayBuffer,
  type: File["type"],
  base64: string
) => {
  const metadata = await nftStorage.store({
    name,
    description,
    base64,
    image: new File([data], name, { type }),
  });
  console.log("metadata", metadata);
  return metadata;
};

export const useCreateItem = () => {
  const [blob, setBlob] = useState<ArrayBuffer>();
  const [base64, setBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [type, setType] = useState<File["type"]>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [handler] = useAtom(handlerAtom);
  const [userAddress] = useAtom(userAddressAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [marketContract] = useAtom(marketContractAtom);

  const toast = useToast();

  const select: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    console.log("file", file);
    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      setType(file.type);
    }
  };

  const readAsBlob = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) return;

      console.log(reader.result);
      setBlob(reader.result);
    };
  };

  const readAsBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      console.log(reader.result);
      setBase64(reader.result);
    };
  };

  const submit = async () => {
    setIsLoading(true);
    try {
      if (
        !blob ||
        !type ||
        !base64 ||
        !handler ||
        !nftContract ||
        !marketContract
      ) {
        return;
      }

      // Create NFT
      const metadata = await store(name, description, blob, type, base64);
      const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");
      let tx = await nftContract.safeMint(userAddress, inputUrl);
      const ethersTx = tx.ethersTx;
      const receipt = await ethersTx.wait();
      // const receipt = await tx.wait();
      const event = receipt.events[0];
      const _tokenId = event.args[2].toString();
      setTokenId(_tokenId);
      setBase64("");
      tx = await nftContract.approve(
        marketContract.etherContract.address,
        _tokenId
      );
      await tx.wait();
      tx = await nftContract["safeTransferFrom(address,address,uint256)"](
        userAddress,
        marketContract.etherContract.address,
        _tokenId
      );
      await tx.wait();

      toast({
        title: "Succeeded to mint",
        description: "Transaction was sent in success🎉",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sell = async () => {
    try {
      if (!handler || !marketContract) return;

      // Sell NFT to marketplace
      const buyoutPrice = ethers.utils.parseUnits("1", "ether");
      const startingPrice = ethers.utils.parseUnits("0.4", "ether");
      const auctionStartDateTS = new Date("2021-11-28").getTime() / 1000;
      const auctionEndDateTS = new Date("2021-11-30").getTime() / 1000;
      const tx = await marketContract.createAuction(
        tokenId,
        buyoutPrice,
        startingPrice,
        auctionStartDateTS,
        auctionEndDateTS
      );
      await tx.wait();

      toast({
        title: "Succeeded to exhabit",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return {
    name,
    description,
    isLoading,
    base64,
    tokenId,
    setName,
    setDescription,
    select,
    submit,
    sell,
  };
};
