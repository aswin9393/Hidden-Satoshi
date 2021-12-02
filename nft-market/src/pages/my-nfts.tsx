import { Box, Grid, Heading, Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { ItemCard } from "../components/itemCard/ItemCard";
import { useMyNFTs } from "../hooks/useMyNFTs";

const Page: NextPage = () => {
  const { items } = useMyNFTs();

  return (
    <Box marginY="40px">
      <Box width="80%" margin="0 auto" mb="70px">
        <Heading mb="10px">My NFTs</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap="6">
          {items ? (
            items.map((item) => <ItemCard item={item} key={item.id} />)
          ) : (
            <Spinner />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Page;
