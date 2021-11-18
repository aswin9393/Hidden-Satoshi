import { useState } from "react";
import { bunzz } from "bunzz-sdk";
import {
  Flex,
  Button,
  Input,
  Text,
  Center,
  CircularProgress,
  useToast,
} from "@chakra-ui/react";

export const Setup = ({ setUserAddress, setBunzz }) => {
  const [dappId, setDappId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [onGoing, setOnGoing] = useState(false);

  const toast = useToast();

  const setup = async () => {
    setOnGoing(true);
    try {
      const handler = await bunzz.initializeHandler({
        dappId,
        apiKey,
      });

      const userAddress = await handler.getSignerAddress();

      console.log(userAddress);
      setUserAddress(userAddress);
      setBunzz(handler);
      toast({
        title: "Succeeded to connect",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <Flex direction="column" margin="30px" justify="space-evenly">
      <Text fontSize="xl" marginTop="20px">
        Step1: Connect your Bunzz Account
      </Text>
      <Text fontSize="sm" marginBottom="5px">
        Generally, this process should be done in your code
      </Text>
      <Input
        value={dappId}
        placeholder="DApp ID"
        onChange={(e) => setDappId(e.target.value)}
        type="text"
      />
      <Input
        value={apiKey}
        placeholder="API Key"
        onChange={(e) => setDappId(e.target.value)}
        onChange={(e) => setApiKey(e.target.value)}
        type="text"
      />
      {onGoing ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <Button colorScheme="blue" onClick={setup}>
          setup
        </Button>
      )}
    </Flex>
  );
};
