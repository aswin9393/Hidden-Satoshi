import { useState, useEffect } from "react";
// [step1]: import SDK
// import { bunzz } from "bunzz-sdk";

import "./App.css";

// [step2]: configuration
const DAPP_ID = "YOUR_DAPP_ID";
const API_KEY = "YOUR_API_KEY";

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

        // [step3]: Get your address from Metamask
        // const userAddress = await handler.getSignerAddress();

        // [step4]: Get a contract object
        // const contract = await handler.getContract("ERC20");

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
    //[step5]: Call a function of smart contract
    // await contract.mint(userAddress, value);
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
