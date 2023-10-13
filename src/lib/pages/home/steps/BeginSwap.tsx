import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

// @ts-ignore
import calculatingAnimation from "lib/assets/gif/calculating.gif";
// @ts-ignore
import {
  usePioneer,
  AssetSelect,
  BlockchainSelect,
  WalletSelect,
  // @ts-ignore
} from "@pioneer-sdk/pioneer-react";

// @ts-ignore
const BeginSwap = ({ setRoute }) => {
  const { state } = usePioneer();
  const {
    api,
    app,
    context,
    assetContext,
    outboundAssetContext,
    blockchainContext,
    pubkeyContext,
  } = state;
  const [showGif, setShowGif] = useState(true);
  const [routes, setRoutes] = useState({});
  const [amountOut, setAmountOut] = useState("");
  const [path, setPath] = useState("");
  //build swap
  const buildSwap = async function () {
    try {
      //onDone
      setShowGif(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    buildSwap();
  }, []);

  return (
    <Box>
      {showGif ? (
        <Box>
          Calculating Best Route...
          <img src={calculatingAnimation} alt="calculating" />
        </Box>
      ) : (
        <Box border="1px" borderRadius="md" p={4} boxShadow="lg">
          <Text fontWeight="bold">Rate</Text>
          <Text fontWeight="bold">Slippage</Text>
          <Box as="span">Path: {path}</Box>

          <Box border="1px" borderRadius="md" p={4} mb={2} boxShadow="lg">
            You will receive {amountOut}
          </Box>
          <Box border="1px" borderRadius="md" p={4} boxShadow="lg">
            {outboundAssetContext.address} ({outboundAssetContext.symbol})
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BeginSwap;
