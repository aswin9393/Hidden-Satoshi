import React, { VFC } from "react";
import { Item } from "../../types/type";
import Image from "next/image";
import { Box, Text } from "@chakra-ui/layout";

type Props = {
  item: Item;
};

export const ItemCard: VFC<Props> = ({ item }) => {
  return (
    <Box boxShadow="md" rounded="md" width="335px" minHeight="400px">
      <Image src={item.image} height="335px" width="335px" />
      <Box padding="10px">
        <Text fontWeight="bold">{item.name}</Text>
        <Text>{item.description}</Text>
      </Box>
    </Box>
  );
};
