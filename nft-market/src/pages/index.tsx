import { Box, Center, Flex, Grid, Heading, Spinner } from "@chakra-ui/react";
import type { NextPage } from "next";
import Link from "next/link";
import { AuctionCard } from "../components/auctionCard/AuctionCard";
import { useFinishedAuctions } from "../hooks/useFinishedAuctions";
import { useNotSoldItems } from "../hooks/useNotSoldItems";

const Page: NextPage = () => {
  const { auctions: sellingAuctions } = useNotSoldItems();
  const { auctions: finishedAuctions } = useFinishedAuctions();

  return (
    <Box marginY="40px">
      <Box width="80%" margin="0 auto" mb="70px">
        <Heading mb="10px">Selling now</Heading>

        {sellingAuctions ? (
          <Grid templateColumns="repeat(3, 1fr)" gap="6">
            {sellingAuctions.map((item) => (
              <Link href={`/assets/${item.tokenId}`} key={item.tokenId}>
                <a>
                  <AuctionCard item={item} />
                </a>
              </Link>
            ))}
          </Grid>
        ) : (
          <Center w="100%">
            <Spinner />
          </Center>
        )}
      </Box>

      <Box width="80%" margin="0 auto">
        <Heading mb="10px">Finished selling</Heading>

        {finishedAuctions ? (
          <Grid templateColumns="repeat(3, 1fr)" gap="6">
            {finishedAuctions.map((item) => (
              <Link href={`/assets/${item.tokenId}`} key={item.tokenId}>
                <a>
                  <AuctionCard item={item} />
                </a>
              </Link>
            ))}
          </Grid>
        ) : (
          <Center w="100%">
            <Spinner />
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default Page;
