import { Handler } from "bunzz-sdk";
import { ethers } from "ethers";
import { atom } from "jotai";
import { BunzzContractExtended } from "../../../../bunzz/bunzz-sdk/dist/domain/contract/bunzzContract";

export const userAddressAtom = atom("");
export const handlerAtom = atom<Handler | null>(null);
// export const nftContractAtom = atom<ethers.Contract | null>(null);
// export const marketContractAtom = atom<ethers.Contract | null>(null);
export const nftContractAtom = atom<BunzzContractExtended | null>(null);
export const marketContractAtom = atom<BunzzContractExtended | null>(null);
