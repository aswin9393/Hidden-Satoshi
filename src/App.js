import { useState, useEffect } from "react";
import { bunzz } from "bunzz-sdk";

import "./App.css";

// configuration
const API_KEY = "91965616-bf7e-4bde-97ea-a39c31980635";
const DAPP_ID = "d3779a9c-bf13-4842-b3e7-2328ffa2d7d4";

const init = async () => {
  const handler = await bunzz.initializeHandler({
    dappId: DAPP_ID,
    apiKey: API_KEY,
  });
  return handler;
};



// Application
const App = () => {
  const [contract, setContract] = useState();
  const [value, setValue] = useState(0);
  const [userAddress, setUserAddress] = useState("hoge");

  useEffect(() => {
    const setup = async () => {
      try {
        const handler = await init();
        const userAddress = await handler.getSignerAddress();
        setUserAddress(userAddress);
        setContract(handler.getContract("ERC20"));
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
      <input value={value} onChange={handleChange} type="text" />
      <button onClick={submit}>mint</button>
    </div>
  );
};

export default App;
