// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NFTAuction is ERC721URIStorage, ReentrancyGuard, Ownable {
    IERC20 public usdtToken;
    address public constant ADMIN_ADDRESS = 0xD0253d5f45b63961c9bFa4AaD8d1f7752F2D167D;

    uint256 public tokenCounter;
    uint256 public listingCounter;
    uint8 public constant STATUS_OPEN = 1;
    uint8 public constant STATUS_DONE = 2;
    uint256 public minAuctionIncrement = 10; // 10 percent

    struct Listing {
        address seller;
        uint256 tokenId;
        string tokenURI;
        uint256 price;
        uint256 netPrice;
        uint256 startAt;
        uint256 endAt;
        uint8 status;
    }

    struct NFTData {
        uint256 tokenId;
        string tokenURI;
        address owner;
    }

    NFTData[] public mintedNFTs;
    Listing[] public auctionListings;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => mapping(address => uint256)) public bids;
    mapping(uint256 => address) public highestBidder;
    mapping(uint256 => mapping(address => bool)) public hasPlacedBid;

    event Minted(address indexed minter, uint256 nftID, string uri);
    event AuctionCreated(uint256 listingId, address indexed seller, uint256 price, uint256 tokenId, uint256 startAt, uint256 endAt);
    event BidCreated(uint256 listingId, address indexed bidder, uint256 bid);
    event AuctionCompleted(uint256 listingId, address indexed seller, address indexed bidder, uint256 bid);
    event WithdrawBid(uint256 listingId, address indexed bidder, uint256 bid);

    constructor(address _usdtToken) ERC721("META NFT", " META NFT ") Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        tokenCounter = 0;
        listingCounter = 0;
    }

    function mint(string memory tokenURI, address minterAddress) public onlyOwner returns (uint256) {
        tokenCounter++;
        uint256 tokenId = tokenCounter;

        _safeMint(minterAddress, tokenId);
        _setTokenURI(tokenId, tokenURI);

        mintedNFTs.push(NFTData(tokenId, tokenURI, minterAddress));
        emit Minted(minterAddress, tokenId, tokenURI);

        return tokenId;
    }

    function createAuctionListing(uint256 price, uint256 tokenId, uint256 durationInSeconds) public returns (uint256) {
        listingCounter++;
        uint256 listingId = listingCounter;

        uint256 startAt = block.timestamp;
        uint256 endAt = startAt + durationInSeconds;

        string memory tokenUri = tokenURI(tokenId);

        Listing memory newListing = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            tokenURI: tokenUri,
            price: price,
            netPrice: price,
            status: STATUS_OPEN,
            startAt: startAt,
            endAt: endAt
        });

        listings[listingId] = newListing;
        auctionListings.push(newListing);

        _transfer(msg.sender, address(this), tokenId);
        emit AuctionCreated(listingId, msg.sender, price, tokenId, startAt, endAt);

        return listingId;
    }

    function bid(uint256 listingId, uint256 amount) public nonReentrant {
        require(isAuctionOpen(listingId), 'Auction has ended');
        require(!hasPlacedBid[listingId][msg.sender], "You can only place one bid");
        
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "Cannot bid on your own NFT");

        require(amount >= listing.price, "Bid must be at least the starting price");

        usdtToken.transferFrom(msg.sender, address(this), amount);
        bids[listingId][msg.sender] = amount;
        highestBidder[listingId] = msg.sender;
        hasPlacedBid[listingId][msg.sender] = true;

        uint256 increment = listing.price / minAuctionIncrement;
        listing.price = listing.price + increment;

        emit BidCreated(listingId, msg.sender, amount);
    }

    function completeAuction(uint256 listingId) public nonReentrant {
        require(!isAuctionOpen(listingId), 'Auction is still open');

        Listing storage listing = listings[listingId];
        address winner = highestBidder[listingId];
        require(
            msg.sender == listing.seller || msg.sender == winner,
            'Only seller or winner can complete the auction'
        );

        uint256 bidAmount = bids[listingId][winner];

        if (winner != address(0)) {
            _transfer(address(this), winner, listing.tokenId);

            bids[listingId][winner] = 0;
            uint256 adminFee = bidAmount / 10;
            uint256 sellerAmount = bidAmount - adminFee;

            usdtToken.transfer(ADMIN_ADDRESS, adminFee);
            usdtToken.transfer(listing.seller, sellerAmount);
        } else {
            _transfer(address(this), listing.seller, listing.tokenId);
        }

        listing.status = STATUS_DONE;
        emit AuctionCompleted(listingId, listing.seller, winner, bidAmount);
    }

    function withdrawBid(uint256 listingId) public nonReentrant {
        require(isAuctionExpired(listingId), 'Auction must be ended');
        require(highestBidder[listingId] != msg.sender, 'Highest bidder cannot withdraw bid');

        uint256 balance = bids[listingId][msg.sender];
        bids[listingId][msg.sender] = 0;

        if (balance > 0) {
            usdtToken.transfer(msg.sender, balance);
            emit WithdrawBid(listingId, msg.sender, balance);
        }
    }

    function isAuctionOpen(uint256 id) public view returns (bool) {
        return listings[id].status == STATUS_OPEN && listings[id].endAt > block.timestamp;
    }

    function isAuctionExpired(uint256 id) public view returns (bool) {
        return listings[id].endAt <= block.timestamp;
    }

    function getHighestBidderAmount(uint256 listingId) public view returns (uint256) {
        return bids[listingId][highestBidder[listingId]];
    }

    function getAllAuctionListings() public view returns (Listing[] memory) {
        return auctionListings;
    }
}
