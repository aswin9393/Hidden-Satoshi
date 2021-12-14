import { Box, Text } from "@chakra-ui/react";
import { VFC } from "react";
import Image from "next/image";
import { formatDate } from "../../utils/date";
import { Auction } from "../../types/type";

type Props = {
  item: Auction;
};

export const AuctionCard: VFC<Props> = ({ item }) => {
  return (
    <Box boxShadow="md" rounded="md" width="335px" minHeight="480px">
      <Image src={item.image} height="335px" width="335px" />
      <Box padding="10px">
        <Text fontWeight="bold">{item.name}</Text>
        <Text>{item.description}</Text>
        <Text fontSize="13px" marginTop="px">
          Starting Price: {item.startingPrice}
        </Text>
        <Text fontSize="13px">Buyout Price: {item.buyoutPrice}</Text>
        <Text fontSize="13px">
          End Date: {formatDate(item.endDate, "yyyy/MM/dd")}
        </Text>
      </Box>
    </Box>
  );
};
