// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NFTAuction is ERC721URIStorage, ReentrancyGuard, Ownable {
    IERC20 public usdtToken; // USDT Token Contract Address

    uint256 public tokenCounter;
    uint256 public listingCounter;

    uint8 public constant STATUS_OPEN = 1;
    uint8 public constant STATUS_DONE = 2;

    uint256 public minAuctionIncrement = 10; // 10 percent

    struct Listing {
        address seller;
        uint256 tokenId;
        string tokenURI;
        uint256 price; // Display price
        uint256 netPrice; // Actual price
        uint256 startAt;
        uint256 endAt;
        uint8 status;
    }

    struct BidData {
        uint256 serialNumber;
        address bidder;
        uint256 amount;
        uint256 timestamp;
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

    event Minted(address indexed minter, uint256 nftID, string uri);
    event AuctionCreated(uint256 listingId, address indexed seller, uint256 price, uint256 tokenId, uint256 startAt, uint256 endAt);
    event BidCreated(uint256 listingId, address indexed bidder, uint256 bid);
    event AuctionCompleted(uint256 listingId, address indexed seller, address indexed bidder, uint256 bid);
    event WithdrawBid(uint256 listingId, address indexed bidder, uint256 bid);

    constructor(address _usdtToken) ERC721("META NFT", "META NFT") Ownable(msg.sender) {
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
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "Cannot bid on your own NFT");

        uint256 newBid = bids[listingId][msg.sender] + amount;
        require(newBid >= listing.price, "Bid must be at least the latest price");

        usdtToken.transferFrom(msg.sender, address(this), amount);

        bids[listingId][msg.sender] += amount;
        highestBidder[listingId] = msg.sender;

        uint256 incentive = listing.price / minAuctionIncrement;
        listing.price = listing.price + incentive;

        emit BidCreated(listingId, msg.sender, newBid);
    }

    function completeAuction(uint256 listingId) public nonReentrant {
        require(!isAuctionOpen(listingId), 'Auction is still open');

        Listing storage listing = listings[listingId];
        address winner = highestBidder[listingId]; 
        require(
            msg.sender == listing.seller || msg.sender == winner, 
            'Only seller or winner can complete the auction'
        );

        if (winner != address(0)) {
            _transfer(address(this), winner, listing.tokenId);

            uint256 amount = bids[listingId][winner]; 
            bids[listingId][winner] = 0;
            usdtToken.transfer(listing.seller, amount);
        } else {
            _transfer(address(this), listing.seller, listing.tokenId);
        }

        listing.status = STATUS_DONE;

        emit AuctionCompleted(listingId, listing.seller, winner, bids[listingId][winner]);
    }

    function withdrawBid(uint256 listingId) public nonReentrant {
        require(isAuctionExpired(listingId), 'Auction must be ended');
        require(highestBidder[listingId] != msg.sender, 'Highest bidder cannot withdraw bid');

        uint256 balance = bids[listingId][msg.sender];
        bids[listingId][msg.sender] = 0;
        usdtToken.transfer(msg.sender, balance);

        emit WithdrawBid(listingId, msg.sender, balance);
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

      function getBidData(uint256 listingId) public view returns (BidData[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < listingCounter; i++) {
            if (bids[listingId][highestBidder[i]] > 0) {
                count++;
            }
        }
        
        BidData[] memory bidDataArray = new BidData[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < listingCounter; i++) {
            if (bids[listingId][highestBidder[i]] > 0) {
                bidDataArray[index] = BidData(index + 1, highestBidder[i], bids[listingId][highestBidder[i]], block.timestamp);
                index++;
            }
        }
        return bidDataArray;
    }


  

    function getAllAuctionListings() public view returns (Listing[] memory) {
        return auctionListings;
    }
}
