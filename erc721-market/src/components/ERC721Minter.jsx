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
  useToast,
} from "@chakra-ui/react";
import { NFTStorage, File } from "nft.storage";

const nftStorage = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_KEY,
});

const store = async (name, description, data, type, base64) => {
  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], { type }),
    base64: base64,
  });
  console.log(metadata);
  return metadata;
};

export const ERC721Minter = ({ bunzz, userAddress }) => {
  const [blob, setBlob] = useState(null);
  const [base64, setBase64] = useState(null);
  const [onGoing, setOnGoing] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const toast = useToast();

  const select = (e) => {
    console.log("hello");
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      setType(file.type);
    }
  };

  const readAsBlob = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log(reader.result);
      setBlob(reader.result);
    };
  };

  const readAsBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setBase64(reader.result);
    };
  };

  const submit = async () => {
    setOnGoing(true);
    try {
      const metadata = await store(name, description, blob, type, base64);
      console.log("url", metadata.url);
      // const contract = await bunzz.getContract("ERC721 IPFS Mintable");
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");
      console.log(inputUrl);
      const tx = await contract.safeMint(userAddress, inputUrl);
      const ethersTx = tx.ethersTx;
      console.log(ethersTx);
      const receipt = await ethersTx.wait();
      const event = receipt.events[0];
      const _tokenId = event.args[2].toString();
      setTokenId(_tokenId);
      setBase64(null);
      toast({
        title: "Succeeded to mint",
        description: "Transaction was sent in success🎉",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <Flex direction="column" margin="30px" justify="space-evenly">
      <Text fontSize="xl" marginTop="20px">
        Step2: Mint your NFT with IPFS
      </Text>
      <Input
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
      />
      <Input type="file" accept="image/*" onChange={select} />
      {base64 ? (
        <Box boxSize="sm">
          <Image src={base64} alt="hoge" />
        </Box>
      ) : (
        <></>
      )}
      {onGoing ? (
        <Center>
          <CircularProgress isIndeterminate />
        </Center>
      ) : (
        <Button colorScheme="blue" onClick={submit}>
          mint
        </Button>
      )}
      {tokenId ? <Text>token ID: {tokenId}</Text> : <></>}
    </Flex>
  );
};
