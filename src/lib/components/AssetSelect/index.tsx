import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  HStack,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Spinner,
  Card,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";


// @ts-ignore
import { COIN_MAP_LONG } from "@pioneer-platform/pioneer-coins";
// @ts-ignore
export default function BlockchainSelect({ setInput, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showOwnedAssets, setShowOwnedAssets] = useState(false);
  const [timeOut, setTimeOut] = useState(null);
  const itemsPerPage = 6;
  const [totalBlockchains, setTotalBlockchains] = useState(0);
  const [assets, setAssets] = useState([]);
  useEffect(() => {
  }, []);

  // @ts-ignore
  const handleSelectClick = async (asset) => {
    try {
      console.log("Select Asset!", asset);
      setInput(asset);
      onClose();
      // Your logic here
    } catch (e) {
      console.error(e);
    }
  };
  // @ts-ignore
  const onSearch = async (searchQuery) => {
    try {
      // Your logic here
    } catch (e) {
      console.error(e);
    }
  };
  // @ts-ignore
  const fetchPage = async (pageIndex) => {
    try {
      // Your logic here
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPage(currentPageIndex);
  }, [currentPageIndex, showOwnedAssets]);

  return (
    <Stack spacing={4}>
      <InputGroup>{/* Search Input */}</InputGroup>
      <Box>
        <div>
          {assets.map((asset: any, index: any) => {
            return (
              <Card
                key={index}
                onClick={() => handleSelectClick(asset)}
                p={2}
                m={2}
                borderRadius={4}
                cursor={"pointer"}
                _hover={{ bg: "gray.200" }}
              >
                <HStack>
                  <Avatar size={"sm"} src={asset?.image} name={asset?.symbol} />
                  <Text>{asset?.symbol}</Text>
                  <Text>{asset?.balance}</Text>
                </HStack>
              </Card>
            );
          })}
        </div>
      </Box>
      <HStack mt={4}>
        <Button
          isDisabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
        >
          Previous Page
        </Button>
        <Button
          isDisabled={currentPage.length < itemsPerPage}
          onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
        >
          Next Page
        </Button>
      </HStack>
    </Stack>
  );
}
