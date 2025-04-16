/**
 *Submitted for verification at BscScan.com on 2024-09-05
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for ERC-20 token
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

// Main Staking contract
contract StakingGame {
    // Owner of the contract
    address public owner;

    // Reference to the ERC-20 token contract
    IERC20 public token;

    // Structure to represent a staking position
    struct Position {
        uint256 positionId;
        address walletAddress;
        uint256 createdDate;
        uint256 unlockDate;
        uint256 percentInterest;
        uint256 weiStaked;
        uint256 weiInterest;
        bool open;
        uint256 lastClaimedDate; // New field to track the last claimed date
    }

    // Structure to represent a user
  struct User  {
    address upline;
    uint256 totalEarned;
    uint256 referralsCount;   // New field to track the number of referrals made by this user
    uint256 currentLevel;
     uint256 directReferralsCount; // New field to track direct referrals

}
    mapping(address => User) public users;

    // Current position ID
    uint256 public currentPositionId;

    uint256 public currentLevel;  // Declare as uint256 (unsigned integer of 256 bits)

    mapping(address => Position[]) public positionHistoryByAddress;
    mapping(uint256 => Position) public positions;
    event PositionClosed(uint256 indexed positionId);
    mapping(address => uint256[]) public positionIdsByAddress;



  

    // Mapping to store interest tiers based on lock periods
    mapping(uint256 => uint256) public tiers;
    event StakeDates(
        uint256 indexed positionId,
        uint256 startDate,
        uint256 endDate
    );
    event Referral(
        address indexed referrer,
        address indexed referee,
        uint256 amount
    );
    event IncomeDistributed(
        address indexed user,
        uint256 amount,
        uint256 level
    );

    uint256 public nextUserId = 1;

    // Array to store lock periods
    uint256[] public lockPeriods;

    // Direct referral tracking
    
    mapping(address => uint256) public directReferralCount;
    mapping(address => uint256) public directReferralIncome;

    // Level income distribution percentages
    mapping(uint256 => uint256) public levelIncome;


    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Constructor to initialize the contract
    constructor(address _tokenAddress) payable {
        owner = msg.sender;
        currentPositionId = 1;
        token = IERC20(_tokenAddress);
        currentLevel = 1;

        if(users[msg.sender].upline != owner) {
    users[msg.sender].referralsCount++;   // Increment the upline's referral count, not a direct referrer's
}
       

        // Initialize interest tiers and lock periods
        tiers[1000] = 10000;
        tiers[800] = 10000;

        lockPeriods.push(1000);
        lockPeriods.push(800);

        // Initialize level income distribution percentages
        levelIncome[1] = 10; // 30% to level 1 upline
        levelIncome[2] = 5; // 20% to level 2 upline
        levelIncome[3] = 4;
        levelIncome[4] = 3;
        levelIncome[5] = 2;
       
    }

   // Function to stake tokens with a specified lock period and amount
    function staketoken(uint256 numDays, uint256 amount) external {
        _stakeToken(numDays, amount, address(0));
    }

    // Function to stake tokens with a specified lock period, amount, and referrer
    function stakeToken(
        uint256 numDays,
        uint256 amount,
        address referrer
    ) external {
        _stakeToken(numDays, amount, referrer);
    }
   function _stakeToken(
    uint256 numDays,
    uint256 amount,
    address referrer
) internal {
    require(tiers[numDays] > 0, "Mapping not found");

    require(
        token.transferFrom(msg.sender, address(this), amount),
        "Token transfer failed"
    );

    uint256 referralCommission = 0;

    if (users[msg.sender].upline == address(0)) {
        if (referrer != address(0) && referrer != msg.sender) {
            users[msg.sender].upline = referrer;
            users[referrer].directReferralsCount++; // Increment the referrer's direct referrals count
        } else {
            users[msg.sender].upline = owner;
        }
    }

    if (users[msg.sender].upline != owner) {
        referralCommission = (amount * levelIncome[1]) / 100;
        // require(
        //     token.transfer(users[msg.sender].upline, referralCommission),
        //     "Referral commission transfer failed"
        // );
         directReferralIncome[users[msg.sender].upline] += referralCommission;

        emit Referral(users[msg.sender].upline, msg.sender, referralCommission);
    }

    positions[currentPositionId] = Position(
        currentPositionId,
        msg.sender,
        block.timestamp,
        block.timestamp + (numDays * 1 days),
        tiers[numDays],
        amount,
        calculateInterest(tiers[numDays], numDays, amount),
        true,
        block.timestamp
    );

    positionIdsByAddress[msg.sender].push(currentPositionId);

    currentPositionId += 1;

    // Distribute income to uplines
    distributeIncome(msg.sender);
}

    

     // Function to modify lock periods (only owner)
    function modifyLockPeriods(uint256 numDays, uint256 basisPoints) external {
        require(owner == msg.sender, "Only owner may modify staking periods");

        // Update interest tier for the lock period
        tiers[numDays] = basisPoints;

        // Add the lock period to the list
        lockPeriods.push(numDays);
    }

     // Function to get the list of lock periods
    function getLockPeriods() external view returns (uint256[] memory) {
        return lockPeriods;
    }

       // Function to get the interest rate for a specific lock period
    function getInterestRate(uint256 numDays) external view returns (uint256) {
        return tiers[numDays];
    }

    // Function to get position details by position ID
    function getPositionById(uint256 positionId)
        external
        view
        returns (Position memory)
    {
        return positions[positionId];
    }

    // Function to change the unlock date of a position (only owner)
    function changeUnlockDate(uint256 positionId, uint256 newUnlockDate)
        external
    {
        require(owner == msg.sender, "Only owner may modify staking periods");
        positions[positionId].unlockDate = newUnlockDate;
    }

 

      // Function to get the list of position IDs for a wallet address
    function getPositionIdsForAddress(address walletAddress)
        external
        view
        returns (uint256[] memory)
    {
        return positionIdsByAddress[walletAddress];
    }

     // Function to get the position history for a wallet address
    function getPositionHistoryForAddress(address walletAddress)
        external
        view
        returns (Position[] memory)
    {
        uint256[] memory positionIds = positionIdsByAddress[walletAddress];
        uint256 numPositions = positionIds.length;
        Position[] memory history = new Position[](numPositions);

        for (uint256 i = 0; i < numPositions; i++) {
            uint256 positionId = positionIds[i];
            history[i] = positions[positionId];
        }

        return history;
    }

    

    // Function to calculate interest based on basis points, lock period, and amount
    function calculateInterest(
        uint256 basisPoints,
        uint256 numDays,
        uint256 amount
    ) private pure returns (uint256) {
        return (basisPoints * amount) / 10000;
    }

       // Function to claim direct referral income
    function claimDirectReferralIncome() external {
        uint256 amount = directReferralIncome[msg.sender];

        // Ensure there is income to claim
        require(amount > 0, "No direct referral income to claim");

        // Reset the direct referral income for the sender
        directReferralIncome[msg.sender] = 0;

        // Transfer the claimed income to the sender
        require(
            token.transfer(msg.sender, amount),
            "Direct referral income transfer failed"
        );
    }



    

  
    // Function to calculate daily interest for a specific staking position
    function calculateDailyInterest(uint256 positionId)
        external
        view
        returns (uint256)
    {
        // Retrieve the position details
        Position memory position = positions[positionId];

        // Ensure the position is valid and open
        require(position.positionId > 0, "Invalid position ID");
        require(position.open, "Position is closed");

        // Calculate lock period in days
        uint256 lockPeriod = (position.unlockDate - position.createdDate) /
            1 days;

        // Ensure the lock period exists in the tiers mapping
        require(tiers[lockPeriod] > 0, "Lock period not found");

        // Calculate daily interest rate based on lock period
        uint256 dailyInterestRate = tiers[lockPeriod] / lockPeriod;

        // Calculate daily interest amount
        uint256 dailyInterest = (dailyInterestRate * position.weiStaked) /
            10000;

        return dailyInterest;
    }

    // Function to claim daily interest for a specific position (only for 1000-day lock period)
    function claimDailyInterest(uint256 positionId) external {
        Position storage position = positions[positionId];

        // Ensure the position is valid and open
        require(position.positionId > 0, "Invalid position ID");
        require(position.open, "Position is closed");

        // Ensure the caller is the owner of the position
        require(
            position.walletAddress == msg.sender,
            "Only position owner can claim interest"
        );

        // Calculate the lock period in days
        uint256 lockPeriod = (position.unlockDate - position.createdDate) /
            1 days;

        // Ensure the lock period is 1000 days
        require(
            lockPeriod == 1000,
            "Daily interest can only be claimed for 1000-day lock period"
        );

        // Calculate the number of days since the last claim
        uint256 daysSinceLastClaim = (block.timestamp -
            position.lastClaimedDate) / 1 days;

        // Ensure at least one day has passed since the last claim
        require(daysSinceLastClaim > 0, "Can only claim interest once per day");

        // Calculate daily interest rate based on lock period
        uint256 dailyInterestRate = tiers[lockPeriod] / lockPeriod;

        // Calculate the interest to be claimed
        uint256 interestToClaim = (dailyInterestRate *
            position.weiStaked *
            daysSinceLastClaim) / 10000;

        // Update the last claimed date
        position.lastClaimedDate = block.timestamp;

        // Transfer the claimed interest to the owner of the position
        require(
            token.transfer(msg.sender, interestToClaim),
            "Interest transfer failed"
        );
    }

     // Function to close a staking position in an emergency
    function emergencyClosePosition(uint256 positionId) external {
        Position storage position = positions[positionId];

        // Check if the sender is the owner of the position
        require(
            position.walletAddress == msg.sender,
            "Only position creator may modify position"
        );
        require(position.open == true, "Position is closed");

        // Check if the lock period is 800 days
        uint256 lockPeriod = (position.unlockDate - position.createdDate) /
            1 days;
        require(
            lockPeriod == 800,
            "Emergency close only allowed for 800-day lock period"
        );

        // Close the position
        position.open = false;

        if (block.timestamp > position.unlockDate) {
            uint256 amount = position.weiStaked + position.weiInterest;
            payable(msg.sender).call{value: amount}("");
        } else {
            require(
                token.transfer(msg.sender, position.weiStaked),
                "Token transfer failed"
            );
        }

        // Update the position history for the wallet address
        positionHistoryByAddress[msg.sender].push(position);
    }

    // Function to close a staking position
    function closePosition(uint256 positionId) external {
        Position storage position = positions[positionId];

        // Check if the position is open
        require(position.open, "Position is already closed");

        // Check if the sender is the owner or the owner of the staked tokens
        require(
            msg.sender == owner || msg.sender == position.walletAddress,
            "Unauthorized"
        );

        // Check if the unlock date has passed
        require(
            block.timestamp >= position.unlockDate,
            "Unlock date not reached"
        );

        // Transfer staked tokens back to the owner of the position
        require(
            token.transfer(position.walletAddress, position.weiStaked),
            "Token transfer failed"
        );

        // If there is interest, transfer it to the owner of the position
        if (position.weiInterest > 0) {
            require(
                token.transfer(position.walletAddress, position.weiInterest),
                "Interest transfer failed"
            );
        }

        // Close the position
        position.open = false;

        // Emit an event for the closed position
        emit PositionClosed(positionId);

        // Update the position history for the wallet address
        positionHistoryByAddress[msg.sender].push(positions[positionId]);
    }
    // Function to get the stake duration (in days) for a specific user's position
    function getUserStakeDays(uint256 positionId) external view returns (uint256) {
        Position memory position = positions[positionId];
        require(position.positionId > 0, "Invalid position ID");

        // Calculate the stake duration in days
        uint256 stakeDays;
        if (block.timestamp >= position.unlockDate) {
            stakeDays = 0;
        } else {
            stakeDays = (position.unlockDate - position.createdDate) / 1 days;
        }
        
        return stakeDays;
    }

    function getDaysUntilUnlock(uint256 positionId)
        external
        view
        returns (uint256)
    {
        Position memory position = positions[positionId];
        require(position.positionId > 0, "Invalid position ID");
        if (block.timestamp >= position.unlockDate) {
            return 0;
        } else {
            return (position.unlockDate - block.timestamp) / 1 days;
        }
    }


    // Function to distribute income to uplines based on the level income percentages
    function distributeIncome(address staker) internal {
        address upline = users[staker].upline;

        for (uint256 level = 1; level <= 5; level++) {
            if (upline == address(0)) break;

            uint256 income = (positions[currentPositionId - 1].weiStaked *
                levelIncome[level]) / 100;

             users[upline].totalEarned += income;
            
            require(token.transfer(upline, income), "Income transfer failed");

            emit IncomeDistributed(upline, income, level);

            upline = users[upline].upline;
        }
    }

      // Function to get total earned amount by a user
    function getDirectReferralIncome(address user) external view returns (uint256) {
        return users[user].totalEarned;
    }

    // Function to get total referrals count of a user
    function getTotalReferrals(address user) external view returns (uint256) {
        return users[user].directReferralsCount;
    }

    // Function to get the current level of a user
    function getUserLevel(address user) external view returns (uint256) {
        return users[user].currentLevel;
    }



   // Function to get the contract's token balance
    function contractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Function to withdraw all tokens, accessible only to the owner
    function withdrawAll() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(owner, balance), "Token transfer failed");
    }
   

    


}