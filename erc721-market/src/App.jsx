import { useEffect, useState } from "react";

// import { ERC20Minter } from "./components/ERC20.jsx";
import { ERC721Minter } from "./components/ERC721Minter";
import { ERC721Checker } from "./components/ERC721Checker";
import { bunzz } from "bunzz-sdk";

const DAPP_ID = "894aa415-13c8-4e9a-91b7-7030b9b9d675";
const API_KEY = "d8e59bab-7498-4fc0-8a6d-39ae6cb99c39";

const App = () => {
  const [handler, setHandler] = useState();
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    setup()
  }, [])

  const setup = async () => {
    const handler = await bunzz.initializeHandler({
      dappId: DAPP_ID,
      apiKey: API_KEY,
    });

    const userAddress = await handler.getSignerAddress();

    console.log(userAddress);
    setUserAddress(userAddress);
    setHandler(handler);
  }

  return (
    <div className="center">
      <div>
        <ERC721Minter bunzz={handler} userAddress={userAddress} />
        <ERC721Checker bunzz={handler} userAddress={userAddress} />
      </div>
    </div>
  );
};

export default App;
