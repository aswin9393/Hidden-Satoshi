import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useItemDetails } from "../../hooks/useItemDetails";
import Image from "next/image";
import { formatDate } from "../../utils/date";
import { OfferModal } from "../../components/modal/OfferModal";
import { useOffer } from "../../hooks/useOffer";

const Page: NextPage = () => {
  const { auction, bids } = useItemDetails();
  const offer = useOffer(auction?.tokenId || 0);

  return (
    <Flex justifyContent="center" marginY="40px">
      <OfferModal {...offer} />

      {auction ? (
        <Flex w="80%">
          <Box
            mr="60px"
            border="1px solid rgba(0,0,0,0.1)"
            borderRadius="8px"
            h="fit-content"
          >
            <Image src={auction.image} height="335px" width="335px" />
          </Box>

          <Box w="100%">
            <Box>
              <Text fontSize="4xl" fontWeight="bold" mb="10px">
                {auction.name}
              </Text>
              <Text fontSize="lg" mb="20px">
                {auction.description}
              </Text>
            </Box>
            <Box
              borderRadius="8px"
              border="1px solid rgba(0,0,0,0.1)"
              w="100%"
              p="10px 20px"
              mb="10px"
            >
              <Text fontSize="lg">
                Starting Price: {auction.startingPrice} ETH
              </Text>
              <Text fontSize="lg">Buyout Price: {auction.buyoutPrice} ETH</Text>
            </Box>

            <Box
              borderRadius="8px"
              border="1px solid rgba(0,0,0,0.1)"
              w="100%"
              p="10px 20px"
              mb="10px"
            >
              <Text fontSize="lg">
                Start Date: {formatDate(auction.startDate, "yyyy/MM/dd")}
              </Text>
              <Text fontSize="lg">
                End Date: {formatDate(auction.endDate, "yyyy/MM/dd")}
              </Text>
            </Box>

            <Box
              borderRadius="8px"
              border="1px solid rgba(0,0,0,0.1)"
              w="100%"
              p="10px 20px"
              bgColor="rgb(243 246 249)"
              textAlign="center"
            >
              <Button
                colorScheme="blue"
                size="lg"
                onClick={offer.makeOfferModal.onOpen}
                isDisabled={auction.sold}
              >
                {auction.sold ? "Sold out" : "Make offer"}
              </Button>
            </Box>

            <Box mt="20px">
              <Heading as="h3" size="md" mb="10px">
                Offers
              </Heading>

              {bids ? (
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Price</Th>
                      <Th>From</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bids.map((bid) => (
                      <Tr key={bid.amount + bid.proposer}>
                        <Td>{bid.amount} ETH</Td>
                        <Td>{bid.proposer}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Spinner />
              )}
            </Box>
          </Box>
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

export default Page;
