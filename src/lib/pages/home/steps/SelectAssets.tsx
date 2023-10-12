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
  Text,
  VStack,
  HStack,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import { SettingsIcon, ArrowUpDownIcon, AddIcon } from "@chakra-ui/icons";
// @ts-ignore
import { useSwap } from "swapkit-provider";
import BlockchainSelect from "lib/components/AssetSelect";
import OutputSelect from "lib/components/OutputSelect";
interface BeginSwapProps {
  input: any; // Replace 'any' with the actual type of 'input'
  setInput: any; // Replace 'any' with the actual type of 'setInput'
  output: any; // Replace 'any' with the actual type of 'output'
  setOutput: any; // Replace 'any' with the actual type of 'setOutput'
  handleClick: any; // Replace 'any' with the actual type of 'handleClick'
  selectedButton: any; // Replace 'any' with the actual type of 'selectedButton'
}

const BeginSwap: React.FC<BeginSwapProps> = ({
  input,
  setInput,
  output,
  setOutput,
  handleClick,
  selectedButton,
}) => {
  const [modalType, setModalType] = useState("");
  const [chains, setChains] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const switchAssets = function () {
    console.log("Switching assets!");
    const inputNew = output;
    const outputNew = input;
    setInput(inputNew);
    setOutput(outputNew);
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => onClose()} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render content based on modalType */}
            {modalType === "Select Input" && (
              <div>
                {chains.toString()}
                <br />
                <BlockchainSelect
                  setInput={setInput}
                  onClose={onClose}
                ></BlockchainSelect>
                {/*{JSON.stringify(walletData)}*/}
              </div>
            )}
            {modalType === "Select Output" && (
              <div>
                <OutputSelect
                  setOutput={setOutput}
                  onClose={onClose}
                ></OutputSelect>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex
        mx="auto"
        alignItems="center"
        justifyContent="center"
        bg="black"
        p="2rem"
      >
        <HStack
          spacing={4} // Adjust the spacing between the two boxes
          maxWidth="35rem" // Set maximum width for the container
          width="100%" // Ensure the container takes full width
        >
          <Box
            flex="1" // Adjust the flex property to control the width
            h="10rem"
            border="1px solid #fff"
            borderRadius="8px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            _hover={{ color: "rgb(128,128,128)" }}
            onClick={() => openModal("Select Input")}
          >
            {!input ? (
              <Spinner size="lg" color="blue.500" />
            ) : (
              <>
                <Avatar size="xl" src={input.image} />
                <Box border="1px solid #fff" borderRadius="8px" width="100%">
                  <Text>Network: {input.network}</Text>
                </Box>
                <Box border="1px solid #fff" borderRadius="8px" width="100%">
                  <Text>Asset: {input.symbol}</Text>
                </Box>
              </>
            )}
          </Box>
          <ArrowUpDownIcon
            onClick={() => switchAssets()}
            color="white"
            boxSize="2rem"
          />
          <Box
            flex="1" // Adjust the flex property to control the width
            h="10rem"
            border="1px solid #fff"
            borderRadius="8px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            _hover={{ color: "rgb(128,128,128)" }}
            onClick={() => openModal("Select Output")}
          >
            {!output ? (
              <Spinner size="lg" color="blue.500" />
            ) : (
              <div>
                <Avatar size="xl" src={output.image} />
                <Box border="1px solid #fff" borderRadius="8px" width="100%">
                  <Text>Network: {output.network}</Text>
                </Box>
                <Box border="1px solid #fff" borderRadius="8px" width="100%">
                  <Text>Asset: {output.symbol}</Text>
                </Box>
              </div>
            )}
          </Box>
        </HStack>
      </Flex>
      <Flex
        mx="auto"
        alignItems="center"
        justifyContent="center"
        bg="black"
        p="2rem"
      >
        <Button
          onClick={() => handleClick("quick")}
          colorScheme={selectedButton === "quick" ? "blue" : "gray"}
          variant="outline"
          width="48%"
        >
          Quick
        </Button>
        <Button
          onClick={() => handleClick("precise")}
          colorScheme={selectedButton === "precise" ? "blue" : "gray"}
          variant="outline"
          width="48%"
        >
          Precise
        </Button>
      </Flex>
    </div>
  );
};

export default BeginSwap;
