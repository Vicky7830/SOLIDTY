// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoyaltyNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _tokenIdCounter;
    uint96 public constant ROYALTY_FEE = 1000; // 10% in basis points

    // Optional: Store creator of each token
    mapping(uint256 => address) private _creators;

    constructor(address initialOwner)
        ERC721("Royalty NFT", "RNFT")
        Ownable(initialOwner)
    {}

    /**
     * @dev Mint a new NFT with metadata and 10% royalty to creator
     * @param to Address to receive the NFT
     * @param tokenURI Metadata URI
     */
    function mintNFT(address to, string memory tokenURI) external returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Set royalty receiver and percentage
        _setTokenRoyalty(newTokenId, msg.sender, ROYALTY_FEE);
        _creators[newTokenId] = msg.sender;

        _tokenIdCounter += 1;
        return newTokenId;
    }

    /**
     * @dev View creator of an NFT
     */
    function getCreator(uint256 tokenId) external view returns (address) {
        return _creators[tokenId];
    }

    /**
     * @dev Withdraw any ETH accidentally sent to this contract
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Override required by Solidity for multiple inheritance
     */
   function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721URIStorage, ERC2981)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}

    /**
     * @dev Override _burn due to ERC721URIStorage
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721)
    {
        super._burn(tokenId);
    }

    /**
     * @dev Override tokenURI to return metadata URI
     */
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return super.tokenURI(tokenId);
}

}
