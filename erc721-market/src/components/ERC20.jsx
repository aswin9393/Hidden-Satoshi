import { useState } from "react";

export const ERC20Minter = ({ bunzz, userAddress }) => {
  const [value, setValue] = useState(0);

  const submit = async () => {
    console.log(userAddress);
    const contract = await bunzz.getContract("ERC20");
    await contract.mint(userAddress, value);
    alert("Transaction was sent in success🎉");
  };

  return (
    <div className="wrapper">
      <p>You can mint your ERC20 if you're the owner</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
      />
      <button onClick={submit}>mint</button>
    </div>
  );
};
