pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IMarketplaceERC721.sol";
import "./MarketplaceStorage.sol";
import "./MarketplaceERC721Receiver.sol";
import "./ERC721Interactions.sol";
import "./IBunzz.sol";

contract MarketplaceERC721 is
    MarketplaceStorage,
    MarketplaceERC721Receiver,
    ERC721Interactions,
    Ownable,
    IMarketplaceERC721,
    IBunzz
{
    using SafeMath for uint256;

    event AuctionCreated(address seller, uint256 tokenId);

    constructor() {}

    function connectToOtherContracts(address[] memory otherContracts)
        external
        override
        onlyOwner
    {
        _setTokenContract(otherContracts[0]);
    }

    function createAuction(
        uint256 tokenId,
        uint256 buyoutPrice,
        uint256 startingPrice,
        uint256 auctionStartDate,
        uint256 auctionEndDate
    ) external override {
        require(
            _sentFrom(tokenId) == msg.sender,
            "Marketplace: auction not created by the original token sender"
        );
        require(
            auctionStartDate < auctionEndDate,
            "Marketplace: auction start date is higher then auction end date"
        );

        address seller = msg.sender;

        Auction memory auction = Auction(
            seller,
            tokenId,
            buyoutPrice,
            startingPrice,
            auctionStartDate,
            auctionEndDate,
            false,
            false
        );

        _addAuction(auction);
        emit AuctionCreated(seller, tokenId);
    }

    function addBid(uint256 tokenId) external payable override {
        require(msg.value > 0, "Marketplace: msg.value is lower then 0");
        Bid memory internalBids = _getBid(tokenId);
        uint256 lastElementPosition;
        bool notInitialized;
        (notInitialized, lastElementPosition) = internalBids
            .bidAmount
            .length
            .trySub(1);
        if (notInitialized == true) {
            require(
                msg.value > internalBids.bidAmount[lastElementPosition],
                "Marketplace: bid value is lower than the biggest bid"
            );
        }
        Auction memory currentAuction = _getAuction(tokenId);
        require(
            currentAuction.auctionStartBlock < block.timestamp,
            "Marketplace: start block is higher than block.number"
        );
        require(
            currentAuction.auctionEndBlock > block.number,
            "Marketplace: end block is lower then block.number"
        );
        require(
            currentAuction.startingPrice < msg.value,
            "Marketplace: bid value is lower than the starting price"
        );
        require(
            msg.value <= currentAuction.buyoutPrice,
            "Marketplace: bid is higher then buyoutPrice"
        );
        require(
            address(this).balance >= 1,
            "Marketplace: the token is not for sale"
        );

        _addBid(tokenId, msg.sender, msg.value);
        if (currentAuction.buyoutPrice == msg.value) {
            _soldout(tokenId, msg.sender);
            _transferTokens(address(this), msg.sender, tokenId);
        }
    }

    function claimToken(uint256 tokenId) external override {
        Auction memory auction = _getAuction(tokenId);
        require(
            auction.auctionEndBlock < block.number,
            "Marketplace: the auction is not yet closed"
        );
        require(
            _getLatestProposer(tokenId) == msg.sender,
            "Marketplace: Claimer is not the auction winner"
        );

        _soldout(tokenId, msg.sender);
        _transferTokens(address(this), msg.sender, tokenId);
    }

    function claimBids(uint256 tokenId) external payable override {
        Auction memory auction = _getAuction(tokenId);
        Bid memory bid = _getBid(tokenId);
        uint256 amount = 0;
        if (_getLatestBid(tokenId) != auction.buyoutPrice) {
            require(
                auction.auctionEndBlock < block.number,
                "Marketplace: the auction is not yet closed"
            );
        }

        for (uint256 i = 0; i < bid.bidProposer.length - 1; i++) {
            if (msg.sender == bid.bidProposer[i]) {
                amount = amount.add(bid.bidAmount[i]);
                _deleteBidProposerAndAmount(tokenId, i);
            }
        }

        payable(msg.sender).transfer(amount);
    }

    function retrieveTokenNotSold(uint256 tokenId) external override {
        Auction memory auction = _getAuction(tokenId);
        require(msg.sender == auction.seller);
        require(
            auction.auctionEndBlock < block.number,
            "Marketplace: the auction is not yet closed"
        );
        Bid memory bid = _getBid(tokenId);
        require(
            bid.bidAmount.length == 0,
            "Marketplace: the auction have bids"
        );

        _transferTokens(address(this), msg.sender, tokenId);
    }

    function withdraw(uint256 id) external {
        Auction memory auction = _getAuction(id);
        require(
            msg.sender == auction.seller,
            "Marketplace: caller is not the seller of the token"
        );
        require(
            auction.auctionEndBlock < block.number,
            "Marketplace: the auction is not yet closed"
        );
        require(
            auction.tokensWithdrawed == false,
            "Marketplace: the funds have been already withdrawned"
        );

        uint256 latestBid = _getLatestBid(id);

        _tokensHaveBeenWithdrawed(id);

        payable(msg.sender).transfer(latestBid);
    }

    function getAuctionForTokenId(uint256 tokenId)
        public
        view
        override
        returns (Auction memory)
    {
        return _getAuction(tokenId);
    }

    function getAuctionBids(uint256 tokenId)
        public
        view
        override
        returns (Bid memory)
    {
        return _getBid(tokenId);
    }

    function getMarketItems() public view returns (Auction[] memory) {
        return _getMarketAuctions();
    }

    function getFinishedItems() public view returns (Auction[] memory) {
        return _getFinishedAuctions();
    }

    function getMyNFTs() public view returns (Item[] memory) {
        return _getMyItems();
    }

    function balance() public view returns (uint256) {
        return _balance(address(this));
    }

    function getToken() public view returns (address) {
        return _getToken();
    }
}
