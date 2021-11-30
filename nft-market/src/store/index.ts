import { Handler } from "bunzz-sdk";
import { atom } from "jotai";
import { BunzzContractExtended } from "../../../../bunzz/bunzz-sdk/dist/domain/contract/bunzzContract";
import { Bid } from "../types/type";

export const userAddressAtom = atom("");
export const handlerAtom = atom<Handler | null>(null);
export const nftContractAtom = atom<BunzzContractExtended | null>(null);
export const marketContractAtom = atom<BunzzContractExtended | null>(null);
export const bidsAtom = atom<Bid[]>([]);
