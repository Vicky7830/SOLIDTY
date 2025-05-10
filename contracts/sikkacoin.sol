// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract MLMStaking {
    address public owner;
    IERC20 public token;

    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 positionId;
        uint256 timestamp;
        uint256 numDays;
        bool claimed;
    }

    struct User {
        address referrer;
        bool registered;
        Stake[] stakes;
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public positionIdToUser;

    uint8[5] public levelRewards = [5, 3, 2,1,1];
    uint256 public nextStakeId;
    uint256 public nextPositionId;

    mapping(address => uint256) public directReferralCount;
    mapping(address => uint256) public directReferralIncome;
    mapping(address => uint256) public totalIncome;

    mapping(uint256 => uint256) public stakingAPY;

    event Registered(address indexed user, address indexed referrer);
    event Staked(address indexed user, uint256 indexed stakeId, uint256 indexed positionId, uint256 amount, uint256 timestamp);
    event Claimed(address indexed user, uint256 indexed positionId, uint256 amount, uint256 reward);

    constructor(address _owner, address _tokenAddress) {
        require(_owner != address(0), "Owner address cannot be zero");
        require(_tokenAddress != address(0), "Token address cannot be zero");
        owner = _owner;
        token = IERC20(_tokenAddress);
        users[owner].registered = true;

        stakingAPY[30] = 1;
        stakingAPY[90] = 3;
        stakingAPY[180] = 6;
        stakingAPY[365] = 12;
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
        directReferralCount[_referrer]++;

        emit Registered(msg.sender, _referrer);
    }

    function stake(uint256 numDays, uint256 amount) external onlyRegistered {
        require(amount > 0, "Amount must be greater than 0");
        require(stakingAPY[numDays] > 0, "Invalid staking duration");

        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        uint256 stakeId = nextStakeId++;
        uint256 positionId = nextPositionId++;
        uint256 timestamp = block.timestamp;

        users[msg.sender].stakes.push(Stake({
            stakeId: stakeId,
            amount: amount,
            positionId: positionId,
            timestamp: timestamp,
            numDays: numDays,
            claimed: false
        }));

        positionIdToUser[positionId] = msg.sender;

        address upline = users[msg.sender].referrer;
        for (uint8 i = 0; i < levelRewards.length; i++) {
            if (upline == address(0)) break;

            uint256 commission = (amount * levelRewards[i]) / 100;
            require(token.transfer(upline, commission), "Referral transfer failed");

            totalIncome[upline] += commission;
            if (i == 0) {
                directReferralIncome[upline] += commission;
            }

            upline = users[upline].referrer;
        }

        emit Staked(msg.sender, stakeId, positionId, amount, timestamp);
    }

    function getEstimatedReturn(uint256 amount, uint256 numDays) external view returns (uint256 reward) {
    require(amount > 0, "Amount must be greater than 0");
    require(stakingAPY[numDays] > 0, "Invalid staking duration");

    uint256 apy = stakingAPY[numDays];
    reward = (amount * apy * numDays) / (100 * 365);
    return reward;
}


    function claim(uint256 _positionId) external onlyRegistered {
        address userAddr = positionIdToUser[_positionId];
        require(userAddr == msg.sender, "Not your stake");

        Stake[] storage stakes = users[msg.sender].stakes;

        for (uint256 i = 0; i < stakes.length; i++) {
            Stake storage s = stakes[i];
            if (s.positionId == _positionId) {
                require(!s.claimed, "Already claimed");

                uint256 elapsedDays = (block.timestamp - s.timestamp) / 1 days;
                uint256 reward = 0;

                if (elapsedDays >= s.numDays) {
                    reward = (s.amount * stakingAPY[s.numDays]) / 100;
                } else if (elapsedDays < 20) {
                    reward = 0;
                } else {
                    revert("Cannot claim between 20 days and full duration");
                }

                s.claimed = true;
                require(token.transfer(msg.sender, s.amount + reward), "Token transfer failed");

                emit Claimed(msg.sender, s.positionId, s.amount, reward);
                return;
            }
        }

        revert("Stake not found for given positionId");
    }
    
    function isRegistered(address user) external view returns (bool) {
    return users[user].registered;
}

    function getStakeDailyReward(uint256 _positionId) external view returns (
        uint256 principal,
        uint256 apy,
        uint256 perDayReward,
        uint256 totalExpectedReward,
        uint256 durationInDays
    ) {
        address userAddr = positionIdToUser[_positionId];
        require(userAddr != address(0), "Invalid positionId");

        Stake[] memory stakes = users[userAddr].stakes;
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].positionId == _positionId) {
                uint256 amount = stakes[i].amount;
                uint256 numDays = stakes[i].numDays;
                uint256 annualAPY = stakingAPY[numDays];
                uint256 totalReward = (amount * annualAPY * numDays) / (100 * 365);
                uint256 perDay = totalReward / numDays;

                return (
                    amount,
                    annualAPY,
                    perDay,
                    totalReward,
                    numDays
                );
            }
        }

        revert("Stake not found");
    }

    function getStakeByPositionId(uint256 _positionId) external view returns (
        address user,
        uint256 stakeId,
        uint256 amount,
        uint256 timestamp,
        uint256 numDays,
        bool claimed
    ) {
        address userAddr = positionIdToUser[_positionId];
        require(userAddr != address(0), "Invalid positionId");

        Stake[] memory stakes = users[userAddr].stakes;
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].positionId == _positionId) {
                return (userAddr, stakes[i].stakeId, stakes[i].amount, stakes[i].timestamp, stakes[i].numDays, stakes[i].claimed);
            }
        }

        revert("Stake not found");
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

        if (users[current].referrer == owner) {
            level++;
        }

        return level;
    }

    function getDirectReferralCount(address user) external view returns (uint256) {
        return directReferralCount[user];
    }

    function getDirectReferralIncome(address user) external view returns (uint256) {
        return directReferralIncome[user];
    }

    function getTotalIncome(address user) external view returns (uint256) {
        return totalIncome[user];
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(token.transfer(owner, amount), "Withdraw failed");
    }
}
