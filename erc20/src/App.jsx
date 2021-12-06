import { useState, useEffect } from "react";
import { bunzz } from "bunzz-sdk";

import "./App.css";

const DAPP_ID = "53335d55-1e83-4063-9765-328473944538";
const API_KEY = "96e30a94-7248-4ffe-94ce-3cf73c69b707";

const init = async () => {
  const handler = await bunzz.initializeHandler({
    dappId: DAPP_ID,
    apiKey: API_KEY,
  });
  return handler;
};

const App = () => {
  const [contract, setContract] = useState();
  const [value, setValue] = useState(0);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const setup = async () => {
      try {
        const handler = await init();

        const userAddress = await handler.getSignerAddress();
        const contract = await handler.getContract("Token (ERC20)");

        setUserAddress(userAddress);
        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    };

    setup();
  }, []);

  const handleChange = (e) => setValue(e.target.value);

  const submit = async () => {
    await contract.mint(userAddress, value);
    alert("Transaction was sent in success🎉");
  };

  return (
    <div className="App App-header">
      <p>You can mint your ERC20 if you're the owner</p>
      <input value={value} onChange={handleChange} type="text" />
      <button onClick={submit}>mint</button>
    </div>
  );
};

export default App;
