import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "../components/header/Header";
import { bunzz } from "bunzz-sdk";
import { useAtom } from "jotai";
import {
  handlerAtom,
  marketContractAtom,
  nftContractAtom,
  userAddressAtom,
} from "../store";

const DAPP_ID = "8e604c6a-4da3-4996-b3ca-7c6639a5f202";
const API_KEY = "b2d998ac-36d5-45a1-83fa-0ecbd21fb53a";

function MyApp({ Component, pageProps }: AppProps<{ userAddress: string }>) {
  const [, setUserAddress] = useAtom(userAddressAtom);
  const [, setHandler] = useAtom(handlerAtom);
  const [, setNftContract] = useAtom(nftContractAtom);
  const [, setMarketContract] = useAtom(marketContractAtom);

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    const handler = await bunzz.initializeHandler({
      dappId: DAPP_ID,
      apiKey: API_KEY,
    });

    const userAddress = await handler.getSignerAddress();
    const nftContract = handler.getContract("NFT (IPFS Mintable)");
    const marketContract = handler.getContract("Marketplace (For NFT2)");

    setNftContract(nftContract);
    setMarketContract(marketContract);
    setUserAddress(userAddress);
    setHandler(handler);
  };

  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
