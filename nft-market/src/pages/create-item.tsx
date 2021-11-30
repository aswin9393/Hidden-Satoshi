import {
  Box,
  Button,
  Center,
  CircularProgress,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useCreateItem } from "../hooks/useCreateItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/Home.module.css";

const Page: NextPage = () => {
  const {
    name,
    description,
    base64,
    isLoading,
    buyoutPrice,
    startingPrice,
    startDate,
    endDate,
    tokenId,
    setName,
    setDescription,
    setStartingPrice,
    setBuyoutPrice,
    setStartDate,
    setEndDate,
    select,
    submit,
    sell,
  } = useCreateItem();

  return (
    <VStack direction="column" margin="40px auto" spacing="20px" w="500px">
      <Heading as="h1" mb="40px">
        Create new item
      </Heading>

      <Box w="100%">
        <FormLabel>Token Name</FormLabel>
        <Input
          placeholder="My NFT"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </Box>
      <Box w="100%">
        <FormLabel>Description</FormLabel>
        <Input
          placeholder="My NFT's description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        />
      </Box>
      <Box w="100%">
        <FormLabel>Starting Price</FormLabel>
        <Input
          placeholder="Starting Price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(Number(e.target.value))}
          type="number"
          min={0}
        />
      </Box>
      <Box w="100%">
        <FormLabel>Buyout Price</FormLabel>
        <Input
          placeholder="Buyout Price"
          value={buyoutPrice}
          onChange={(e) => setBuyoutPrice(Number(e.target.value))}
          type="number"
          min={0}
        />
      </Box>

      <Box w="100%">
        <FormLabel>Start Date</FormLabel>
        <DatePicker
          className={styles.date_picker}
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
        />
      </Box>

      <Box w="100%">
        <FormLabel>End Date</FormLabel>
        <DatePicker
          className={styles.date_picker}
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          minDate={new Date()}
        />
      </Box>

      <Box w="100%">
        <FormLabel>Image</FormLabel>
        <Input type="file" accept="image/*" onChange={select} />
        {base64 && (
          <Box boxSize="sm" w="200px">
            <img src={base64} width="200px" alt="NFTの画像" />
          </Box>
        )}
      </Box>
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
