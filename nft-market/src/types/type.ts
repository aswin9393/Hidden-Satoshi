export type Auction = {
  tokenId: number;
  buyoutPrice: number;
  startingPrice: number;
  name: string;
  description: string;
  image: string;
  endDate: Date;
  startDate: Date;
  sold: boolean;
};

export type Bid = {
  amount: number;
  proposer: string;
};

export type Item = {
  id: number;
  owner: string;
  name: string;
  description: string;
  image: string;
};

export type Metadata = {
  tokenId: number;
  name: string;
  description: string;
  image: string;
};
