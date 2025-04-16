// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for ERC-20 token (NFT-USDT)
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

// NFT USDT Staking Contract
contract NFTStaking {
    address public owner;
    IERC20 public nftUSDT;

    struct Position {
        uint256 positionId;
        address walletAddress;
        uint256 tokenId;
        uint256 createdDate;
        uint256 unlockDate;
        uint256 apy;
        uint256 amountStaked;
        uint256 totalInterest;
        bool open;
    }

    uint256 public currentPositionId;
    mapping(uint256 => Position) public positions;
    mapping(address => uint256[]) public positionIdsByAddress;
    mapping(uint256 => uint256) public stakingAPY;

    event NFTStaked(uint256 indexed positionId, address indexed staker, uint256 tokenId, uint256 amount, uint256 unlockDate);
    event NFTUnstaked(uint256 indexed positionId, address indexed staker, uint256 amountWithdrawn, uint256 interestEarned);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(address _usdtAddress) {
        owner = msg.sender;
        nftUSDT = IERC20(_usdtAddress);
        currentPositionId = 1;

        // Default staking plans: days => APY
        stakingAPY[30] = 2;
        stakingAPY[90] = 3;
        stakingAPY[180] = 6;
        stakingAPY[365] = 12;
    }

    // Stake NFT-USDT
    function stakeNFT(uint256 tokenId, uint256 numDays, uint256 amount) external {
        require(stakingAPY[numDays] > 0, "Invalid staking period");
        require(amount > 0, "Amount must be greater than zero");

        require(nftUSDT.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        uint256 apy = stakingAPY[numDays];
        uint256 interest = calculateInterest(apy, numDays, amount);

        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            tokenId,
            block.timestamp,
            block.timestamp + (numDays * 1 days),
            apy,
            amount,
            interest,
            true
        );

        positionIdsByAddress[msg.sender].push(currentPositionId);

        emit NFTStaked(currentPositionId, msg.sender, tokenId, amount, block.timestamp + (numDays * 1 days));

        currentPositionId++;
    }

    // Interest calculation
    function calculateInterest(uint256 apy, uint256 numDays, uint256 amount) private pure returns (uint256) {
        uint256 yearlyInterest = (apy * amount) / 100;
        return (yearlyInterest * numDays) / 365;
    }

    // View early interest based on current time
    function calculatePreDaysInterest(uint256 positionId) external view returns (uint256) {
        Position storage position = positions[positionId];
        require(position.open, "Position closed");

        uint256 daysStaked = (block.timestamp - position.createdDate) / 1 days;
        uint256 interestPerDay = (position.amountStaked * position.apy) / 36500;
        return interestPerDay * daysStaked;
    }

    // Unstake NFT with logic:
    // - If time complete: full interest
    // - If < 20 days: no interest
    // - If >= 20 days and not time complete: partial interest
    function unstakeNFT(uint256 positionId) external {
        Position storage position = positions[positionId];
        require(position.walletAddress == msg.sender, "Not your stake");
        require(position.open, "Already unstaked");

        uint256 stakedDays = (block.timestamp - position.createdDate) / 1 days;
        uint256 amountToTransfer;
        uint256 interestEarned;

        if (block.timestamp >= position.unlockDate) {
            // Full staking period completed
            amountToTransfer = position.amountStaked + position.totalInterest;
            interestEarned = position.totalInterest;
        } else if (stakedDays < 20) {
            // Early unstake before 20 days: no interest
            amountToTransfer = position.amountStaked;
            interestEarned = 0;
        } else {
            // Early unstake after 20 days: partial interest
            uint256 interestPerDay = (position.amountStaked * position.apy) / 36500;
            interestEarned = interestPerDay * stakedDays;
            amountToTransfer = position.amountStaked + interestEarned;
        }

        require(nftUSDT.transfer(msg.sender, amountToTransfer), "Transfer failed");
        position.open = false;

        emit NFTUnstaked(positionId, msg.sender, amountToTransfer, interestEarned);
    }


    

    function getPositionById(uint256 positionId) external view returns (Position memory) {
        return positions[positionId];
    }

    function getPositionIdsForAddress(address walletAddress) external view returns (uint256[] memory) {
        return positionIdsByAddress[walletAddress];
    }

    function getAPY(uint256 numDays) external view returns (uint256) {
        return stakingAPY[numDays];
    }

    function modifyStakingAPY(uint256 numDays, uint256 apy) external {
        require(msg.sender == owner, "Only owner");
        stakingAPY[numDays] = apy;
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        require(nftUSDT.balanceOf(address(this)) >= amount, "Insufficient balance");

        require(nftUSDT.transfer(owner, amount), "Withdraw failed");
        emit Withdrawn(owner, amount);
    }
}
