import React, { useEffect, useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  Box,
  Avatar,
  VStack,
  SimpleGrid, // Add SimpleGrid
} from "@chakra-ui/react";
import { SettingsIcon, AddIcon } from "@chakra-ui/icons";

// @ts-ignore
import backgroundImage from "lib/assets/background/thorfox.webp"; // Adjust the path
// import ForkMeBanner from "lib/components/ForkMe";
import BeginSwap from "./steps/BeginSwap"; // Updated import here
import CompleteSwap from "./steps/CompleteSwap"; // Updated import here
import SelectAssets from "./steps/SelectAssets"; // Updated import here
import { FeeOption } from "@pioneer-platform/types";
// @ts-ignore
import { COIN_MAP_LONG } from "@pioneer-platform/pioneer-coins";

import {
  AssetSelect,
  OutputSelect,
  usePioneer,
  // @ts-ignore
} from "@pioneer-sdk/pioneer-react";

const Home = () => {
  const { state } = usePioneer();
  const {
    api,
    app,
    context,
    assetContext,
    outboundAssetContext,
    blockchainContext,
    pubkeyContext,
    modals,
  } = state;
  // steps
  const [step, setStep] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [route, setRoute] = useState(null);
  const [txHash, setTxhash] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedButton, setSelectedButton] = useState("quick"); // Initial selected button is "Quick"
  const [isContinueDisabled, setIsContinueDisabled] = useState(true); // Initial continue button is disabled
  const handleClick = (button: any) => {
    setSelectedButton(button);
  };
  const [continueButtonContent, setContinueButtonContent] =
    useState("Continue"); // Initial continue button content is "Continue"
  const [assets, setAssets] = useState([]); // Array to store assets
  const [showGoBack, setShowGoBack] = useState(false);

  useEffect(() => {
    if (
      app &&
      app.swapKit &&
      assetContext &&
      outboundAssetContext &&
      step === 0
    ) {
      setIsContinueDisabled(false);
    }
  }, [assetContext, blockchainContext]);

  useEffect(() => {
    if (step === 0) {
      setShowGoBack(false);
    }
    if (step === 1) {
      setContinueButtonContent("Sign Transaction");
    }
  }, [step]);

  const onStart = async function () {
    try {
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, []);

  const openModal = (type: any) => {
    setModalType(type);
    onOpen();
  };

  const handleClickContinue = async function () {
    try {
      if (step === 0) {
        setStep((prevStep) => prevStep + 1);
        setShowGoBack(true);
        return;
      }
      if (step === 1) {
        const swapParams = {
          route,
          // @ts-ignore
          recipient: output?.address,
          feeOptionKey: FeeOption.Fast,
        };
        console.log("swapParams: ", swapParams);
        // console.log("swapKit: ", swapKit);
        // const txHash = await swapKit.swap(swapParams);
        console.log("txHash: ", txHash);
        setTxhash(txHash);
        setStep((prevStep) => prevStep + 1);
      }
      if (step === 1) {
        //check if confirmed
        //if confirmed
        //setStep((prevStep) => prevStep + 1)
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goBack = function () {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    console.log("step: ", step);
    switch (step) {
      case 0:
        return (
          <SelectAssets
            openModal={openModal}
            handleClick={handleClick}
            selectedButton={selectedButton}
          />
        );
      case 1:
        return <BeginSwap setRoute={setRoute} />;
      case 2:
        return <CompleteSwap txHash={txHash} />;
      default:
        setStep(0);
        return "true";
    }
  };

  return (
    <div>
      {/*<ForkMeBanner />*/}
      <Modal isOpen={isOpen} onClose={() => onClose()} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render content based on modalType */}
            {modalType === "Select Asset" && (
              <div>
                <AssetSelect onClose={onClose}></AssetSelect>
              </div>
            )}
            {/*{modalType === "Select Outbound" && (*/}
            {/*  <div>*/}
            {/*    <OutputSelect onClose={onClose} onlyOwned={false}></OutputSelect>*/}
            {/*  </div>*/}
            {/*)}*/}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        w="35rem"
        mx="auto"
        mt="5rem"
        boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
        borderRadius="1.37rem 1.37rem 0 0"
        bg="black"
      >
        <Flex
          alignItems="center"
          p="1rem 1.25rem 0.5rem"
          color="rgb(86, 90, 105)"
          justifyContent="space-between"
        >
          <h1>Swap</h1>
          <SettingsIcon
            fontSize="1.25rem"
            cursor="pointer"
            _hover={{ color: "rgb(128,128,128)" }}
            onClick={() => openModal("settings")}
          />
        </Flex>
        {renderStepContent()}
      </Box>
      <Flex
        w="35rem"
        mx="auto"
        flexDirection="column"
        alignItems="center"
        bg="black"
        p="2rem"
      >
        <SimpleGrid columns={2} spacing={4} width="full" mb={4}>
          {assets.map((asset: any) => (
            <Button
              key={asset.network}
              onClick={() => setSelectedButton(asset.network)}
              colorScheme={selectedButton === asset.network ? "blue" : "gray"}
              variant={selectedButton === asset.network ? "solid" : "outline"}
              width="100%"
            >
              {asset.network}
            </Button>
          ))}
        </SimpleGrid>
        <Button
          onClick={() => handleClickContinue()}
          leftIcon={<AddIcon />}
          colorScheme="blue"
          isDisabled={isContinueDisabled}
          mt={4}
        >
          {continueButtonContent}
        </Button>
        {showGoBack ? (
          <div>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        ) : (
          <div></div>
        )}
      </Flex>
    </div>
  );
};

export default Home;
