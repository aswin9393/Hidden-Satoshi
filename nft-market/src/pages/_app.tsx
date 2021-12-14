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

const DAPP_ID = "fb7fffb1-aa34-4927-a64b-6cfc6f4af2bb";
const API_KEY = "f18fd752-ae6a-4c96-b63c-082570f513a7";

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
