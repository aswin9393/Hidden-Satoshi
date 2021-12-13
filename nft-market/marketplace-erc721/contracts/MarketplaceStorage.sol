pragma solidity ^0.8.0;

import "./IMarketplaceStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MarketplaceStorage is IMarketplaceStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCount;

    mapping(uint256 => Auction) private auctions;
    mapping(uint256 => Bid) private bids;

    // index -> Item
    mapping(uint256 => Item) private items;

    function _auctions(uint256 id) internal view returns (Auction memory) {
        return auctions[id];
    }

    function _bids(uint256 id) internal view returns (Bid memory) {
        return bids[id];
    }

    function _addAuction(Auction memory auction) internal {
        auctions[auction.tokenId] = auction;
        items[_tokenCount.current()] = Item(auction.tokenId, address(this));
        _tokenCount.increment();
    }

    function _tokensHaveBeenWithdrawed(uint256 id) internal {
        require(auctions[id].tokensWithdrawed == false);
        auctions[id].tokensWithdrawed = true;
    }

    function _addBid(uint256 id, Bid memory bid) internal {
        bids[id] = bid;
    }

    function _getBid(uint256 id) internal view returns (Bid memory) {
        Bid memory bid = bids[id];
        return bid;
    }

    function _getAuction(uint256 id) internal view returns (Auction memory) {
        Auction memory auction = auctions[id];
        return auction;
    }

    function _soldout(uint256 id, address winner) internal {
        auctions[id].sold = true;
        uint256 tokenId = auctions[id].tokenId;

        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            if (items[i].tokenId == tokenId) {
                items[i].owner = winner;
            }
        }
    }

    function _addBid(
        uint256 id,
        address proposer,
        uint256 amount
    ) internal {
        bids[id].bidAmount.push(amount);
        bids[id].bidProposer.push(proposer);
    }

    function _deleteBidProposerAndAmount(uint256 id, uint256 index) internal {
        delete bids[id].bidProposer[index];
        delete bids[id].bidAmount[index];
    }

    function _getLatestBidAmountAndProposer(uint256 id)
        internal
        view
        returns (address, uint256)
    {
        uint256 amount = _getLatestBid(id);
        address proposer = _getLatestProposer(id);
        return (proposer, amount);
    }

    function _getLatestProposer(uint256 id) internal view returns (address) {
        Bid memory bid = bids[id];
        require(
            bid.bidProposer.length >= 1,
            "MarketplaceStorage: bidProposer is empty"
        );
        address proposer = bid.bidProposer[bid.bidProposer.length - 1];
        return proposer;
    }

    function _getLatestBid(uint256 id) internal view returns (uint256) {
        Bid memory bid = bids[id];
        require(
            bid.bidAmount.length >= 1,
            "MarketplaceStorage: bidAmount is empty"
        );
        uint256 amount = bid.bidAmount[bid.bidAmount.length - 1];
        return amount;
    }

    function _getMarketAuctions() internal view returns (Auction[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            uint256 tokenId = items[i].tokenId;
            Auction storage auction = auctions[tokenId];
            if (
                auction.auctionStartBlock <= block.timestamp &&
                block.timestamp < auction.auctionEndBlock &&
                !auction.sold
            ) {
                itemCount += 1;
            }
        }

        Auction[] memory _auctions = new Auction[](itemCount);
        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            uint256 tokenId = items[i].tokenId;
            Auction storage auction = auctions[tokenId];
            if (
                auction.auctionStartBlock <= block.timestamp &&
                block.timestamp < auction.auctionEndBlock &&
                !auction.sold
            ) {
                _auctions[currentIndex] = auction;
                currentIndex += 1;
            }
        }

        return _auctions;
    }

    function _getFinishedAuctions() internal view returns (Auction[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            uint256 tokenId = items[i].tokenId;
            Auction storage auction = auctions[tokenId];
            if (block.timestamp >= auction.auctionEndBlock || auction.sold) {
                itemCount += 1;
            }
        }

        Auction[] memory _auctions = new Auction[](itemCount);
        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            uint256 tokenId = items[i].tokenId;
            Auction storage auction = auctions[tokenId];
            if (block.timestamp >= auction.auctionEndBlock || auction.sold) {
                _auctions[currentIndex] = auction;
                currentIndex += 1;
            }
        }

        return _auctions;
    }

    function _getMyItems() internal view returns (Item[] memory) {
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            if (items[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Item[] memory _items = new Item[](itemCount);
        for (uint256 i = 0; i < _tokenCount.current(); i++) {
            if (items[i].owner == msg.sender) {
                _items[currentIndex] = items[i];
                currentIndex += 1;
            }
        }

        return _items;
    }
}
