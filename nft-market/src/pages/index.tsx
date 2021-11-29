import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ItemCard } from "../components/itemCard/ItemCard";
import { useNotSoldItems } from "../hooks/useNotSoldItems";

const Page: NextPage = () => {
  const { items } = useNotSoldItems();

  return (
    <Flex justifyContent="center" marginTop="40px">
      <Grid templateColumns="repeat(5, 1fr)" gap="6" width="80%">
        {items?.map((item) => (
          <ItemCard item={item} key={item.tokenId} />
        ))}
      </Grid>
    </Flex>
  );
};

export default Page;
