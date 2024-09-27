import { useState, useEffect } from 'react'
import { ethers } from "ethers";
import './App.css'

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();  // Await the getSigner method
        const address = await signer.getAddress();  // Now this should work
        setWalletAddress(address);

        // Instantiate the contract
        // const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        // setContract(contractInstance);
        
      } catch (error) {
        console.error("Error connecting to wallet or contract:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

    // Function to change wallet manually
    const changeWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
          await connectWallet(); // Reconnect after changing wallets
        } catch (error) {
          console.error("Error changing wallet:", error);
        }
      }
    };

     // Listen to MetaMask account change events
    useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
          // setContract(null);
        }
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
      };
    }
  }, []);

  return (
    <>
      <div className="App">
        <h1>Connect Wallet</h1>
        {walletAddress ? (
          <>
            <p>Connected Wallet Address: {walletAddress}</p>
            <button onClick={changeWallet}>Change Wallet</button>
          </>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </>
  )
}

export default App
