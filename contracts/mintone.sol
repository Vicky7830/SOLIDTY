// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MintRoyaltyNFT is ERC721, ERC2981, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public usdtToken;
    uint256 public mintFee;

    uint256 private constant PRECISION = 1e3;
    uint256 private constant MAX_FEE = 30; // 3%

    event Minted(address indexed user, uint256 tokenId);
    event RoyaltySet(uint256 tokenId, address receiver, uint96 fee);
    event MintFeeUpdated(uint256 newFee);

    constructor(
        string memory name_,
        string memory symbol_,
        address _usdtToken,
        uint96 defaultRoyaltyFee
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT token address");
        usdtToken = _usdtToken;

        _setDefaultRoyalty(msg.sender, defaultRoyaltyFee);
    }

    function publicMint(address recipient) external {
        require(recipient != address(0), "Invalid recipient");

        uint256 feeAmount = mintFee * PRECISION;
        require(
            IERC20(usdtToken).transferFrom(msg.sender, owner(), feeAmount),
            "USDT transfer failed"
        );

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(recipient, tokenId);

        emit Minted(recipient, tokenId);
    }

    function setRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
        emit RoyaltySet(tokenId, receiver, feeNumerator);
    }

    function setMintFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_FEE, "Fee exceeds MAX_FEE");
        mintFee = _fee;
        emit MintFeeUpdated(_fee);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
