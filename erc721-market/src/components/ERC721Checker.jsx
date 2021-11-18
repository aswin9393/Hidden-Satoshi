import { useState } from "react";
import {
  Flex,
  Button,
  Input,
  Text,
  Box,
  Image,
  Center,
  CircularProgress,
} from "@chakra-ui/react";

export const ERC721Checker = ({ bunzz, userAddress }) => {
  const [base64, setBase64] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [onGoing, setOnGoing] = useState(false);

  const submit = async () => {
    setOnGoing(true);
    const contract = await bunzz.getContract("ERC721 IPFS Mintable");
    const { response: tokenUri } = await contract.tokenURI(tokenId);
    console.log(tokenUri);
    const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setBase64(data.base64);
    setName(data.name);
    setDescription(data.description);
    setOnGoing(false);
  };

  return (
    <Flex direction="column" margin="30px" justify="space-evenly">
      <Text fontSize="xl" marginTop="20px">Step3: Get your NFT</Text>
      <Input
        placeholder="token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        type="text"
      />
      {onGoing ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <Button colorScheme="blue" onClick={submit}>get</Button>
      )}
      {base64 ? (
        <Box boxSize="sm">
          <Image src={base64} alt="hoge" />{" "}
        </Box>
      ) : (
        <></>
      )}
      {name ? <Text>Name: {name}</Text> : <></>}
      {description ? <Text>Description: {description}</Text> : <></>}
    </Flex>
  );
};
