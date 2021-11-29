import { Box, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useItemDetails } from "../../hooks/useItemDetails";
import Image from "next/image";
import { formatDate } from "../../utils/date";

const Page: NextPage = () => {
  const { item } = useItemDetails();

  return (
    <Flex justifyContent="center" marginTop="40px">
      {item ? (
        <Flex w="80%">
          <Box mr="60px" border="1px solid rgba(0,0,0,0.1)" borderRadius="8px">
            <Image src={item.image} height="335px" width="335px" />
          </Box>

          <Box w="100%">
            <Box>
              <Text fontSize="4xl" fontWeight="bold" mb="10px">
                {item.name}
              </Text>
              <Text fontSize="lg" mb="20px">
                {item.description}
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
                Starting Price: {item.startingPrice} ETH
              </Text>
              <Text fontSize="lg">Buyout Price: {item.buyoutPrice} ETH</Text>
            </Box>

            <Box
              borderRadius="8px"
              border="1px solid rgba(0,0,0,0.1)"
              w="100%"
              p="10px 20px"
              mb="10px"
            >
              <Text fontSize="lg">
                Start Date: {formatDate(item.startDate, "yyyy/MM/dd")}
              </Text>
              <Text fontSize="lg">
                End Date: {formatDate(item.endDate, "yyyy/MM/dd")}
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
              <Button colorScheme="blue" size="lg">
                Make offer
              </Button>
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
