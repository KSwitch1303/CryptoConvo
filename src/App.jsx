import React, { useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'

import * as web3 from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

require("@solana/wallet-adapter-react-ui/styles.css");

const endpoint = web3.clusterApiUrl("devnet");
const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

const App = () => {
  let base58Pubkey
  const [videocall, setVideocall] = useState(false)
  const [isHost, setHost] = useState(true)
  const [isPinned, setPinned] = useState(false)
  const [username, setUsername] = useState('')
  const [connected,setConnected] = useState(false)

  function Func() {
    const { publicKey, sendTransaction  } = useWallet();
    const { connection } = useConnection();
    if (publicKey != null) {
      base58Pubkey = publicKey.toBase58();
      console.log(base58Pubkey); 
      setConnected(true)
      setUsername(base58Pubkey)
      // console.log(balance);
    }else{
      setConnected(false)
    }
    
    }

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <h1 style={styles.heading}>Crypto Convo</h1>
        {videocall ? (
          <>
            <div style={styles.nav}>
              <p style={styles.btn} onClick={() => setHost(!isHost)}>
                Admin Panel
              </p>
              <p style={styles.btn} onClick={() => setPinned(!isPinned)}>
                Change Layout
              </p>
            </div>
            <AgoraUIKit
              rtcProps={{
                appId: '69c3c885e2ef4de5995793276cf21683',
                channel: 'main',
                token: '007eJxTYLiZa5jw7Owtl7vXZoYw+vZ58V7Z/6RrZTf3vjNu7eL6f+oVGMwsk42TLSxMU41S00xSUk0tLU3NLY2NzM2S04wMzSyMP969ktoQyMjgPX8CCyMDBIL4LAy5iZl5DAwAy/shQQ==',
                role: isHost ? 'host' : 'audience',
                layout: isPinned ? layout.pin : layout.grid,
                // enableScreensharing: true
              }}
              rtmProps={{ username: username || 'user', displayUsername: true }}
              callbacks={{
                EndCall: () => setVideocall(false)
              }}
            />
          </>
        ) : (
          <div style={styles.nav}>
            <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
              <WalletModalProvider>
                <WalletMultiButton />
                <Func />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
          {connected && (
            <>
            <h3 style={styles.btn} onClick={() => setVideocall(true)}>
              Start Call
            </h3>
            </>
          )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff22'
  },
  heading: { textAlign: 'center', marginBottom: 0 },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  } ,
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: {
    backgroundColor: '#007bff',
    cursor: 'pointer',
    borderRadius: 5,
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: 20
  },
  input: { display: 'flex', height: 24, alignSelf: 'center' } 
}

export default App