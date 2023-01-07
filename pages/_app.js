import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { themeChange } from "theme-change";
import { alchemyProvider } from "wagmi/providers/alchemy";
import React from "react";
import Layout from "../components/Layout";
import { mainnet } from "wagmi/chains";
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: "LQ0xqhSEYELkJL2ToAS0S02mh8LiT_iR" }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "Project",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [argentWallet({ chains }), trustWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const MyApp = ({ Component, pageProps }) => {
  console.log(
    "%c Made with \u2665 by AsakiPG %c %c %c https://twitter.com/AsakiPG/ %c %c ",
    "color: #fff; background: #e43333; padding:5px 0;",
    "background: #131419; padding:5px 0;",
    "background: #131419; padding:5px 0;",
    "color: #fff; background: #1c1c1c; padding:5px 0;",
    "background: #fff; padding:5px 0;",
    "color: #e43333; background: #fff; padding:5px 0"
  );
  React.useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);
  return (
    <div className="bg-cover bg-center min-h-screen">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
};

export default MyApp;
