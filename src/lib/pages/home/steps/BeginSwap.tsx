import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Grid,
  Heading,
  Input,
  Spinner,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Avatar,
  HStack,
  Progress,
  Button,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { QuoteRoute, SwapKitApi } from "@pioneer-platform/swapkit-api";
// @ts-ignore
import calculatingAnimation from "lib/assets/gif/calculating.gif";
import { FeeOption } from "@pioneer-platform/types";
// @ts-ignore
import {
  usePioneer,
  AssetSelect,
  BlockchainSelect,
  WalletSelect,
  // @ts-ignore
} from "@pioneer-sdk/pioneer-react";
import {
  Amount,
  AmountType,
  AssetAmount,
} from "@pioneer-platform/swapkit-entities";

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
  const [amountOut, setAmountOut] = useState("");
  const [path, setPath] = useState("");
  const [assetsSelected, setAssetsSelected] = useState(false);
  const [buttonText, setButtonText] = useState("Continue");
  const [loading, setLoading] = useState(false);
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0); // New state for current route index
  const [inputAmount, setInputAmount] = useState<Amount | undefined>();
  const [amount, setAmount] = useState(0);
  const [routes, setRoutes] = useState<QuoteRoute[]>([]);

  const handlePreviousRoute = () => {
    if (currentRouteIndex > 0) {
      setCurrentRouteIndex(currentRouteIndex - 1);
    }
  };

  const handleNextRoute = () => {
    if (currentRouteIndex < routes.length - 1) {
      setCurrentRouteIndex(currentRouteIndex + 1);
    }
  };

  const fetchQuote = useCallback(async () => {
    console.log("fetchQuote: ", fetchQuote);
    if (!assetContext || !outboundAssetContext || !app || !app.swapKit)
      alert("unable to get quote! app in poor state!");
    setLoading(true);
    setRoutes([]);

    //default = max amount
    console.log("balance: ", assetContext.assetAmount.toString());

    //YOLO balance as amount?
    const amountSelect = parseFloat(assetContext.assetAmount.toString());
    console.log("amountSelect: ", amountSelect);
    const amountSelectAsset = Amount.fromNormalAmount(amountSelect);
    setInputAmount(amountSelectAsset);
    const senderAddress = app.swapKit.getAddress(assetContext.asset.L1Chain);
    const recipientAddress = app.swapKit.getAddress(
      outboundAssetContext.asset.L1Chain
    );
    console.log("assetContext: ", assetContext);
    console.log("outboundAssetContext: ", outboundAssetContext);

    try {
      const entry = {
        sellAsset: assetContext.asset.toString(),
        sellAmount: amountSelectAsset.assetAmount.toString(),
        buyAsset: outboundAssetContext.asset.toString(),
        senderAddress,
        recipientAddress,
        slippage: "3",
      };
      console.log("entry: ", entry);
      const { routes } = await SwapKitApi.getQuote(entry);
      console.log("routes: ", routes);
      setRoutes(routes || []);
    } catch (e) {
      console.error("ERROR: ", e);
      // @ts-ignore
      alert("Failed to get quote! " + e.message);
      setLoading(false);
    }
  }, [inputAmount, assetContext, outboundAssetContext, app, app?.swapKit]);

  //wait for routes
  useEffect(() => {
    if (routes && routes.length > 0) {
      setShowGif(false);
    }
    setShowGif(false);
  }, []);

  //build swap
  const buildSwap = async function () {
    try {
      fetchQuote();
      //onDone
      //setShowGif(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    buildSwap();
  }, []);

  const handleSwap = useCallback(
    async (route: QuoteRoute) => {
      const inputChain = assetContext?.asset.L1Chain;
      const outputChain = outboundAssetContext?.asset.L1Chain;
      if (!assetContext || !outboundAssetContext || !app || !app?.swapKit)
        return;

      const address = app?.swapKit.getAddress(outputChain);

      const txHash = await app?.swapKit.swap({
        route,
        recipient: address,
        feeOptionKey: FeeOption.Fast,
      });

      window.open(
        app?.swapKit.getExplorerTxUrl(inputChain, txHash as string),
        "_blank"
      );
    },
    [
      assetContext?.asset.L1Chain,
      outboundAssetContext?.asset.L1Chain,
      app?.swapKit,
    ]
  );

  return (
    <Box>
      {showGif ? (
        <Box>
          Calculating Best Route...
          <img src={calculatingAnimation} alt="calculating" />
        </Box>
      ) : (
        <Box>
          {routes && routes.length > 0 && (
            <Card key={currentRouteIndex} mb={5}>
              <CardHeader>
                <Heading size="md">
                  Route: {routes[currentRouteIndex].path || "N/A"}
                </Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {/* Expected Output */}
                  {routes[currentRouteIndex].expectedOutput && (
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Expected Output
                      </Heading>
                      <Text>{routes[currentRouteIndex].expectedOutput}</Text>
                    </Box>
                  )}

                  {/* Fees */}
                  {routes[currentRouteIndex].fees &&
                    routes[currentRouteIndex].fees.THOR && (
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Fees
                        </Heading>
                        {routes[currentRouteIndex].fees.THOR.map(
                          (fee, feeIndex) => (
                            <Text key={feeIndex}>
                              Type: {fee.type}, Asset: {fee.asset}, Total Fee:{" "}
                              {fee.totalFeeUSD} USD
                            </Text>
                          )
                        )}
                      </Box>
                    )}

                  {/* Meta */}
                  {routes[currentRouteIndex].meta && (
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Meta
                      </Heading>
                      <Text>
                        Sell Chain: {routes[currentRouteIndex].meta.sellChain}
                      </Text>
                      <Text>
                        Buy Chain: {routes[currentRouteIndex].meta.buyChain}
                      </Text>
                      <Text>
                        Price Protection Required:{" "}
                        {routes[currentRouteIndex].meta.priceProtectionRequired
                          ? "Yes"
                          : "No"}
                      </Text>
                      <Text>
                        Quote Mode: {routes[currentRouteIndex].meta.quoteMode}
                      </Text>
                    </Box>
                  )}

                  {/* Transaction */}
                  {routes[currentRouteIndex].transaction &&
                    routes[currentRouteIndex].transaction.inputs && (
                      <Box>
                        <Heading size="xs" textTransform="uppercase">
                          Transaction
                        </Heading>
                        <TableContainer>
                          <Table size="sm">
                            <Thead>
                              <Tr>
                                <Th>Hash</Th>
                                <Th>Value</Th>
                                <Th>Address</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {routes[currentRouteIndex].transaction.inputs.map(
                                (
                                  input: {
                                    hash:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | React.ReactFragment
                                      | React.ReactPortal
                                      | null
                                      | undefined;
                                    value:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | React.ReactFragment
                                      | React.ReactPortal
                                      | null
                                      | undefined;
                                    address:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | React.ReactFragment
                                      | React.ReactPortal
                                      | null
                                      | undefined;
                                  },
                                  inputIndex: React.Key | null | undefined
                                ) => (
                                  <Tr key={inputIndex}>
                                    <Td>{input.hash}</Td>
                                    <Td>{input.value}</Td>
                                    <Td>{input.address}</Td>
                                  </Tr>
                                )
                              )}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                </Stack>
              </CardBody>
              <Button onClick={() => handleSwap(routes[currentRouteIndex])}>
                Select Route
              </Button>
            </Card>
          )}
          {/* Pagination Buttons */}
          <HStack spacing={4}>
            <Button
              onClick={handlePreviousRoute}
              isDisabled={currentRouteIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextRoute}
              isDisabled={currentRouteIndex === routes.length - 1}
            >
              Next
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default BeginSwap;
