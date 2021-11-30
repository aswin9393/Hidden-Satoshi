export type Item = {
  tokenId: number;
  buyoutPrice: number;
  startingPrice: number;
  name: string;
  description: string;
  image: string;
  endDate: Date;
  startDate: Date;
};

export type Bid = {
  amount: number;
  proposer: string;
};
