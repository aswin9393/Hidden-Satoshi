import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";

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

const DAPP_ID = "0ee6666a-b0b6-4021-90f6-06beca3219af";
const API_KEY = "a4355b89-7a50-43c4-8acb-15ee4de7865d";

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
