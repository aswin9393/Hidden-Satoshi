import {
  Box,
  Button,
  Center,
  CircularProgress,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useCreateItem } from "../hooks/useCreateItem";

const Page: NextPage = () => {
  const {
    name,
    description,
    base64,
    isLoading,
    tokenId,
    setName,
    setDescription,
    select,
    submit,
    sell,
  } = useCreateItem();

  return (
    <VStack direction="column" margin="100px auto" spacing="20px" w="500px">
      <Input
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
      />
      <Input type="file" accept="image/*" onChange={select} />
      {base64 ? (
        <Box boxSize="sm" w="200px">
          <img src={base64} width="200px" alt="NFTの画像" />
        </Box>
      ) : (
        <></>
      )}
      {isLoading ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <Button colorScheme="blue" w="100%" onClick={submit}>
          Mint
        </Button>
      )}
      {tokenId && (
        <Button w="100%" onClick={sell}>
          Sell
        </Button>
      )}
      {tokenId ? <Text>token ID: {tokenId}</Text> : <></>}
    </VStack>
  );
};

export default Page;
