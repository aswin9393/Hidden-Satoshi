import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React, { VFC } from "react";
import { UseOfferReturns } from "../../hooks/useOffer";

type Props = UseOfferReturns;

export const OfferModal: VFC<Props> = ({
  makeOfferModal,
  isOfferLoading,
  ether,
  error,
  makeOffer,
  setEther,
}) => {
  return (
    <Modal {...makeOfferModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Make an offer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={error !== ""}>
            <FormLabel>Price (ETH)</FormLabel>
            <NumberInput w="100%">
              <NumberInputField
                onChange={(e) => setEther(Number(e.target.value))}
                value={ether}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  onClick={() => setEther((value) => value + 1)}
                />
                <NumberDecrementStepper
                  onClick={() => setEther((value) => value - 1)}
                />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={makeOffer}
            isLoading={isOfferLoading}
          >
            Make Offer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
