// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MLMStaking {
    address public owner;

    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 positionId;
        uint256 timestamp;
    }

    struct User {
        address referrer;
        bool registered;
        Stake[] stakes;
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public positionIdToUser;

    uint8[3] public levelRewards = [5, 3, 2]; // Level 1 - 5%, Level 2 - 3%, Level 3 - 2%
    uint256 public nextStakeId;
    uint256 public nextPositionId;

    // ✅ New mappings
    mapping(address => uint256) public directReferralCount;
    mapping(address => uint256) public directReferralIncome;
    mapping(address => uint256) public totalIncome;

    event Registered(address indexed user, address indexed referrer);
    event Staked(
        address indexed user,
        uint256 indexed stakeId,
        uint256 indexed positionId,
        uint256 amount,
        uint256 timestamp
    );

    constructor(address _owner) {
        require(_owner != address(0), "Owner address cannot be zero");
        owner = _owner;
        users[owner].registered = true;
    }

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "User not registered");
        _;
    }

    function register(address _referrer) external {
        require(!users[msg.sender].registered, "Already registered");
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(users[_referrer].registered, "Referrer not registered");

        users[msg.sender].referrer = _referrer;
        users[msg.sender].registered = true;

        // ✅ Track direct referral count
        directReferralCount[_referrer]++;

        emit Registered(msg.sender, _referrer);
    }

    function stake() external payable onlyRegistered {
        require(msg.value > 0, "Amount must be greater than 0");

        uint256 stakeId = nextStakeId++;
        uint256 positionId = nextPositionId++;
        uint256 timestamp = block.timestamp;

        // Save the stake
        users[msg.sender].stakes.push(Stake({
            stakeId: stakeId,
            amount: msg.value,
            positionId: positionId,
            timestamp: timestamp
        }));

        // Map positionId to user's address
        positionIdToUser[positionId] = msg.sender;

        // Pay upline rewards
        address payable upline = payable(users[msg.sender].referrer);

        for (uint8 i = 0; i < levelRewards.length; i++) {
            if (upline == address(0)) break;

            uint256 commission = (msg.value * levelRewards[i]) / 100;
            upline.transfer(commission);

            // ✅ Log income per level
            totalIncome[upline] += commission;
            if (i == 0) {
                directReferralIncome[upline] += commission;
            }

            upline = payable(users[upline].referrer);
        }

        emit Staked(msg.sender, stakeId, positionId, msg.value, timestamp);
    }

    // ✅ Get stake info by positionId
    function getStakeByPositionId(uint256 _positionId) external view returns (
        address user,
        uint256 stakeId,
        uint256 amount,
        uint256 timestamp
    ) {
        address userAddr = positionIdToUser[_positionId];
        require(userAddr != address(0), "Invalid positionId");

        Stake[] memory stakes = users[userAddr].stakes;
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].positionId == _positionId) {
                return (userAddr, stakes[i].stakeId, stakes[i].amount, stakes[i].timestamp);
            }
        }

        revert("Stake not found for given positionId");
    }

    function getPositionIds(address _user) external view returns (uint256[] memory) {
        uint256 stakeCount = users[_user].stakes.length;
        uint256[] memory positionIds = new uint256[](stakeCount);

        for (uint256 i = 0; i < stakeCount; i++) {
            positionIds[i] = users[_user].stakes[i].positionId;
        }

        return positionIds;
    }

 function getUserLevel(address user) external view returns (uint256) {
    require(users[user].registered, "User not registered");

    uint256 level = 0;
    address current = user;

    while (users[current].referrer != address(0) && users[current].referrer != owner) {
        level++;
        current = users[current].referrer;
    }

    // If referrer is the owner, they are 1 level under owner
    if (users[current].referrer == owner) {
        level++;
    }

    return level;
}





    // ✅ New Getters
    function getDirectReferralCount(address user) external view returns (uint256) {
        return directReferralCount[user];
    }

    function getDirectReferralIncome(address user) external view returns (uint256) {
        return directReferralIncome[user];
    }

    function getTotalIncome(address user) external view returns (uint256) {
        return totalIncome[user];
    }

    // ✅ Admin withdraw
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(owner).transfer(amount);
    }

    // ✅ Accept Ether
    receive() external payable {}
}
