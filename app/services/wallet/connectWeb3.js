// src/connectWeb3.js
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    appName: 'hello-wallet',
    chains: [mainnet, polygon, optimism, arbitrum],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [optimism.id]: http(),
      [arbitrum.id]: http(),
    },
  })
);
