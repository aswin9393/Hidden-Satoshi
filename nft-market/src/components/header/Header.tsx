import React, { VFC } from "react";
import { Flex, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export const Header: VFC = () => {
  return (
    <nav>
      <Flex justify="space-between" p="10px 20px">
        <Text>NFT Marketplace</Text>
        <HStack mt="4px" spacing="30px">
          <NextLink href="/">
            <Link fontWeight="bold">Home</Link>
          </NextLink>
          <NextLink href="/create-item">
            <Link fontWeight="bold">Sell Digital Asset</Link>
          </NextLink>
          <NextLink href="/my-nfts">
            <Link fontWeight="bold">My NFTs</Link>
          </NextLink>
        </HStack>
      </Flex>
    </nav>
  );
};
