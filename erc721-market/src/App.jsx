import { useState } from "react";
import { Center, Flex } from "@chakra-ui/react";

import { Setup } from "./components/Setup.jsx";
// import { ERC20Minter } from "./components/ERC20.jsx";
import { ERC721Minter } from "./components/ERC721Minter.jsx";
import { ERC721Checker } from "./components/ERC721Checker.jsx";

const App = () => {
  const [bunzz, setBunzz] = useState();
  const [userAddress, setUserAddress] = useState("");

  return (
    <Center>
      <Flex direction="column" justify="space-evenly">
        <Setup setUserAddress={setUserAddress} setBunzz={setBunzz} />
        <ERC721Minter bunzz={bunzz} userAddress={userAddress} />
        <ERC721Checker bunzz={bunzz} userAddress={userAddress} />
      </Flex>
    </Center>
  );
};

export default App;
