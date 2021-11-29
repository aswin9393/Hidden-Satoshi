import { Flex, Grid } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { ItemCard } from "../components/itemCard/ItemCard";
import { useNotSoldItems } from "../hooks/useNotSoldItems";

const Page: NextPage = () => {
  const { items } = useNotSoldItems();

  return (
    <Flex justifyContent="center" marginTop="40px">
      <Grid templateColumns="repeat(3, 1fr)" gap="6" width="80%">
        {items?.map((item) => (
          <Link href={`/assets/${item.tokenId}`} key={item.tokenId}>
            <a>
              <ItemCard item={item} />
            </a>
          </Link>
        ))}
      </Grid>
    </Flex>
  );
};

export default Page;
