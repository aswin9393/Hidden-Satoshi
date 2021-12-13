const { expect } = require("chai");
const { ethers, artifacts } = require("hardhat");
const { BigNumber } = require("ethers")
const { expectRevert } = require('@openzeppelin/test-helpers');
const AuctionableToken = artifacts.require('MockERC721Full');
const Marketplace = artifacts.require('MarketplaceERC721');

const startBlock = 0;
const endBlock = 48;

describe('Marketplace', async (accounts) =>  {
    before(async()=>{
        this.signers = await ethers.getSigners()
        aliceAccount=this.signers[0]
        bobAccount=this.signers[1]
        carolAccount=this.signers[2]
        eveAccount=this.signers[3]
        feiAccount=this.signers[4]
        davidAccount=this.signers[5]
        alice=aliceAccount.address
        bob=bobAccount.address
        carol=carolAccount.address
        eve=eveAccount.address
        fei=feiAccount.address
        david=davidAccount.address
        this.auctionableToken = await AuctionableToken.new("Crypto Kitties","CRYPTKITTIS",{from:alice});
        this.marketplace = await Marketplace.new({from:alice});
    })

    it("MInt initial 5 nfts", async() => {
       await this.auctionableToken.mint(0)
       await this.auctionableToken.mint(1)
       await this.auctionableToken.mint(2)
       await this.auctionableToken.mint(3)
       await this.auctionableToken.mint(4)
       await this.auctionableToken.mint(5)


       for(let i=0; i<12;i++){
            await ethers.provider.send("evm_mine")
       }

    });

    it("Approve this.marketplace to use the nft", async() => {
        await this.auctionableToken.setApprovalForAll(this.marketplace.address, true);
        console.log("Address is: "+this.auctionableToken.address)
        let isApproved = await this.auctionableToken.isApprovedForAll(alice, this.marketplace.address);
        assert.equal(isApproved,true);
    });

    it("Create auction", async() => {


        await this.marketplace.connectToOtherContracts([this.auctionableToken.address]);

        await this.auctionableToken.safeTransferFrom(alice, this.marketplace.address, 1);
        await this.auctionableToken.safeTransferFrom(alice, this.marketplace.address, 2);
        await this.auctionableToken.safeTransferFrom(alice, this.marketplace.address, 4);
        await this.auctionableToken.safeTransferFrom(alice, this.marketplace.address, 5);


        await this.marketplace.createAuction(1, "5000000000000000000", "1000000000000000000", startBlock, endBlock);
        await this.marketplace.createAuction(2, "5000000000000000000", "1000000000000000000", startBlock, endBlock);
        await this.marketplace.createAuction(4, "5000000000000000000", "1000000000000000000", startBlock, endBlock);
        await this.marketplace.createAuction(5, "5000000000000000000", "1000000000000000000", 100, 104);


        let auction = await this.marketplace.getAuctionForTokenId(1);
        console.log(auction);
        assert.equal(auction[0], alice);
        assert.equal(auction[1], 1);
        assert.equal(auction[2],'5000000000000000000');
        assert.equal(auction[3],'1000000000000000000');
        assert.equal(auction[4],startBlock);
        assert.equal(auction[5], endBlock);
    });

    it("Try to set the same addres on connectToOtherContract function, should fail", async()=>{
        await expectRevert(this.marketplace.connectToOtherContracts(
            [this.auctionableToken.address]
        ),"ERC721Interactions: The new address is the same as the old one");
      
    });

    it("Try to claim token when auction not closed, should fail", async()=>{

        await expectRevert(this.marketplace.claimToken(1),"Marketplace: the auction is not yet closed");
       
    });

    it("Try to claim bids when auction not closed, and there are no bids, should fail", async()=>{

        await expectRevert(this.marketplace.claimBids(1),'MarketplaceStorage: bidAmount is empty');
        
    });

    it("Try to retrieve token when auction not closed, should fail", async()=>{

        await expectRevert(this.marketplace.retrieveTokenNotSold(1),'Marketplace: the auction is not yet closed');
       
    });


    it("Create auction as malitious entity", async() => {
        await expectRevert(this.marketplace.createAuction(
            3, 
            "5000000000000000000", 
            "1000000000000000000", 
            startBlock, 
            endBlock, 
            {from:carol}
        ),'Marketplace: auction not created by the original token sender');
 
    });


    it("Add bid to the auction, lower then the starting bid", async() => {
        await expectRevert(this.marketplace.addBid(
            4, 
            {
                from:bob, 
                value:'900000000000000000'
            }
        ),'Marketplace: bid value is lower than the starting price');
      
    });

    it("Create auction from the original token sender", async() => {

        await this.auctionableToken.safeTransferFrom(alice, this.marketplace.address, 3);
        await this.marketplace.createAuction(3, "5000000000000000000", "1000000000000000000", startBlock, endBlock, {from:alice});
  
        let auction = await this.marketplace.getAuctionForTokenId(3);
        console.log(auction);
        assert.equal(auction[0], alice);
        assert.equal(auction[1], 3);
        assert.equal(auction[2],'5000000000000000000');
        assert.equal(auction[3],'1000000000000000000');
        assert.equal(auction[4], startBlock);
        assert.equal(auction[5], endBlock);
    });

    it("Add bid to the auction", async() => {


        await this.marketplace.addBid(1, {from:bob, value:'2000000000000000000'});
        await this.marketplace.addBid(3, {from:bob, value:'2000000000000000000'});


        let bids = await this.marketplace.getAuctionBids(1);
        console.log(bids);
        assert.equal(bids[0], bob);
        assert.equal(bids[1], '2000000000000000000');
    });

    it("Try to claim bids when auction not closed, and there is one bid, should fail", async()=>{
        await expectRevert(this.marketplace.claimBids(
            1, 
            {
                from:bob
            }
        ),"Marketplace: the auction is not yet closed");
    })
      

    it("Add bid to the auction as buyout price", async() => {

        await this.marketplace.addBid(4, {from:bob, value:'5000000000000000000'});


        let bids = await this.marketplace.getAuctionBids(4);
        console.log(bids);
        assert.equal(bids[0], bob);
        assert.equal(bids[1], '5000000000000000000');
    });

    it("Add bid to the auction as bigger then buyout price", async() => {
  
        await expectRevert(this.marketplace.addBid(
            4, 
            {
                from:bob, 
                value:'6000000000000000000'
            }
        ),"Marketplace: bid is higher then buyoutPrice");
      
    });


    it("Add lower bid to the auction", async() => {

        await expectRevert(this.marketplace.addBid(
            3, 
            {
                from:bob, 
                value:'1500000000000000000'
            }
        ),'Marketplace: bid value is lower than the biggest bid');
      
    });

    it("Add invalid bid to the auction", async() => {

        await expectRevert(this.marketplace.addBid(
            3, 
            {from:bob, 
                value:'0'
            }
        ),'Marketplace: msg.value is lower then 0');

    });

    it("Add bid to the auction then not started yey", async() => {

        await expectRevert(this.marketplace.addBid(
            5, 
            {
                from:bob, 
                value:'1500000000000000000'
            }
        ),'Marketplace: start block is higher than block.number');

    });

    it("Add second bid to the auction", async() => {

        await this.marketplace.addBid(1, {from:carol, value:'3000000000000000000'});

        let bids = await this.marketplace.getAuctionBids(1);
        console.log(bids);
        assert.equal(bids.bidProposer[1], carol);
        assert.equal(bids.bidAmount[1], '3000000000000000000');
    });

    it("Add one more bid but the auction is finished", async() => {

        await expectRevert(this.marketplace.addBid(
            1, 
            {
                from:eve, 
                value:'4000000000000000000'
            }
        ),'Marketplace: end block is lower then block.number');

    });

    it("Claim token as the loser of the auction", async() => {

        await expectRevert(this.marketplace.claimToken(
            1, 
            {
                from:bob
            }
        ),'Marketplace: Claimer is not the auction winner');
        
    });

    it("Claim token as the winner of the auction", async() => {
        await this.marketplace.claimToken(1, {from:carol});
        let winnerBalance = await this.auctionableToken.balanceOf(carol);
        let sellerBalance = await this.auctionableToken.balanceOf(alice);
        let marketplaceBalance = await this.auctionableToken.balanceOf(this.marketplace.address);
       
        assert.equal(winnerBalance.toString(), "1", "Winner balance not matched");
        assert.equal(sellerBalance.toString(), "1", "Seller balance not matched");
        assert.equal(marketplaceBalance.toString(), "3", "Marketplace balance not matcher");
    });

    it("Claim back bids as the auctions loser", async() => {


        await this.marketplace.claimBids(1, {from:alice});
        await this.marketplace.claimBids(1, {from:bob});
        let bids = await this.marketplace.getAuctionBids(1);
        console.log(bids);
        
    });

    it("Claim back unsold token as the owner", async() => {


        let balance = await this.auctionableToken.balanceOf(alice);
        assert.equal(balance.toString(),"1","Token already at user");

        await this.marketplace.retrieveTokenNotSold(2, {from:alice});
        balance = await this.auctionableToken.balanceOf(alice);
        assert.equal(balance.toString(), "2", "Token not transfered from this.marketplace to user");
        
    });

    it("Claim back token that have bids", async() => {

        let balance = await this.auctionableToken.balanceOf(alice);
        assert.equal(balance,2,"Token already at user");

        await expectRevert(this.marketplace.retrieveTokenNotSold(
            3, 
            {
                from:alice
            }
        ),"Marketplace: the auction have bids");

    });

    it("Claim back unsold token as not the owner", async() => {


        let balance = await this.auctionableToken.balanceOf(bob,2);
        assert.equal(balance,0,"Token already at user");

        try{
            await this.marketplace.retrieveTokenNotSold(2, {from:bob});
        }catch(e){
            console.log(e.reason);
            balance = await this.auctionableToken.balanceOf(bob,2);
            console.log("balance is: "+balance);
            assert.equal(balance,0,"Token transfered from this.marketplace to user");
        }
        
    });


    it("Claim back token as the owner after auction finished but not claimed by new owner", async() => {


        try{
            await this.marketplace.retrieveTokenNotSold(3, {from:carol});
        }catch(e){
            console.log(e.reason);
            balance = await this.auctionableToken.balanceOf(carol);
            console.log("balance is: "+balance);
            assert.equal(balance.toString(),"1","Token transfered from this.marketplace to user");
        }
        
    });

    it("The seller is withdrawing the profits from the auction", async() => {


        let balance = await web3.eth.getBalance(alice);
        console.log(balance);

        await this.marketplace.withdraw(1,{from: alice});

    });

    it("Other accoutn then the seller is trying to withdraw the profits, it should fail", async() => {

        await expectRevert(this.marketplace.withdraw(
            1,
                {
                    from: david
                }
            ),"Marketplace: caller is not the seller of the token");
    });

});