import { useState } from "react";
import { Flex, Button, Input, Text } from "@chakra-ui/react";

export const ERC20Minter = ({ bunzz, userAddress }) => {
  const [value, setValue] = useState(0);

  const submit = async () => {
    console.log(userAddress);
    const contract = await bunzz.getContract("ERC20");
    await contract.mint(userAddress, value);
    alert("Transaction was sent in success🎉");
  };

  return (
    <Flex direction="column" margin="30px" justify="space-evenly">
      <Text>You can mint your ERC20 if you're the owner</Text>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
      />
      <Button onClick={submit}>mint</Button>
    </Flex>
  );
};
