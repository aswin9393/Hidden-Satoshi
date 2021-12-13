pragma solidity ^0.8.0;

interface IMarketplaceStorage {
    struct Auction {
        address seller;
        uint256 tokenId;
        uint256 buyoutPrice;
        uint256 startingPrice;
        uint256 auctionStartBlock;
        uint256 auctionEndBlock;
        bool tokensWithdrawed;
        bool sold;
    }

    struct Bid {
        address[] bidProposer;
        uint256[] bidAmount;
    }

    struct Item {
        uint256 tokenId;
        address owner;
    }
}
