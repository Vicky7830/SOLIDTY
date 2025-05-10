// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);    
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract MLMStakingUSDT {
    address public owner;
    uint256 public stakeCounter;
    IERC20 public usdtToken;

    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtToken);
        users[owner].registered = true;

        stakingAPY[30] = 1;
        stakingAPY[90] = 3;
        stakingAPY[180] = 6;
        stakingAPY[365] = 12;
    

    }

  struct Stake {
    uint256 stakeId;
    uint256 positionId;
    uint256 amount;
    uint256 timestamp; // start date
    uint256 numDays;
    bool claimed;
}


    struct ReferralInfo {
        address referralAddress;
        uint256 incomeEarned;
        uint256 timestamp;
    }

    struct User {
        address referrer;
        Stake[] stakes;
        uint256 totalIncome;
        uint256 levelIncome;
        bool registered;
    }

    struct LevelIncomeData {
        address receiverAddress;
        uint256 stakeId;
        uint256 stakeAmount;
        uint256 incomeReceived;
        address uplineAddress;
        uint256 timestamp;
        uint8 level;
    }

    mapping(address => User) public users;
    mapping(address => ReferralInfo[]) public directReferrals;
    mapping(uint256 => address) public positionIdToUser;
    mapping(uint256 => uint256) public stakingAPY;
    mapping(address => uint256) public directReferralIncome;

    address[] public allUsers;
    uint8[5] public levelRewards = [5, 3, 2, 1, 1];

    event Claimed(address indexed user, uint256 stakeId, uint256 amount, uint256 reward);

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "Not registered");
        _;
    }

    function register(address referrer) external {
        require(!users[msg.sender].registered, "Already registered");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(users[referrer].registered, "Referrer not registered");

        users[msg.sender].referrer = referrer;
        users[msg.sender].registered = true;
        allUsers.push(msg.sender);

        directReferrals[referrer].push(ReferralInfo({
            referralAddress: msg.sender,
            incomeEarned: 0,
            timestamp: block.timestamp
        }));
    }

    function stake(uint256 numDays, uint256 amount) external onlyRegistered {
        require(amount > 0, "Stake amount must be greater than 0");
        require(stakingAPY[numDays] > 0, "Invalid staking duration");

        bool success = usdtToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDT transfer failed");

        uint256 positionId = ++stakeCounter;

        users[msg.sender].stakes.push(Stake({
            stakeId: stakeCounter,
            positionId: positionId,
            amount: amount,
            timestamp: block.timestamp,
            numDays: numDays,
            claimed: false
        }));

        positionIdToUser[positionId] = msg.sender;

        // Distribute level income
        address upline = users[msg.sender].referrer;

        for (uint8 i = 0; i < levelRewards.length && upline != address(0); i++) {
            uint256 reward = (amount * levelRewards[i]) / 100;

            require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient contract balance");

            bool rewardSuccess = usdtToken.transfer(upline, reward);
            require(rewardSuccess, "Reward transfer failed");

            users[upline].totalIncome += reward;

            if (i == 0) {
                // Direct referral income
                directReferralIncome[upline] += reward;
            } else {
                // Level income
                users[upline].levelIncome += reward;
            }

            ReferralInfo[] storage refs = directReferrals[upline];
            for (uint256 j = 0; j < refs.length; j++) {
                if (refs[j].referralAddress == msg.sender) {
                    refs[j].incomeEarned += reward;
                    break;
                }
            }

            upline = users[upline].referrer;
        }
    }

    


   function getEstimatedReturn(uint256 amount, uint256 numDays) external view returns (uint256 interest, uint256 totalReturn) {
    require(amount > 0, "Amount must be greater than 0");
    require(stakingAPY[numDays] > 0, "Invalid staking duration");

    uint256 apy = stakingAPY[numDays];
    
    // Calculate interest: (amount * apy * numDays) / (100 * 365)
    interest = (amount * apy * numDays) / (100 * 365);

    // Total return = original amount + interest
    totalReturn = amount + interest;

    return (interest, totalReturn);
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
                require(usdtToken.transfer(msg.sender, s.amount + reward), "Token transfer failed");

                emit Claimed(msg.sender, s.positionId, s.amount, reward);
                return;
            }
        }

        revert("Stake not found for given positionId");
    }

    // function getStakeByPositionId(uint256 _positionId) external view returns (
    //     address user,
    //     uint256 stakeId,
    //     uint256 amount,
    //     uint256 timestamp
    // ) {
    //     address userAddr = positionIdToUser[_positionId];
    //     require(userAddr != address(0), "Invalid positionId");

    //     Stake[] memory stakes = users[userAddr].stakes;
    //     for (uint256 i = 0; i < stakes.length; i++) {
    //         if (stakes[i].positionId == _positionId) {
    //             return (userAddr, stakes[i].stakeId, stakes[i].amount, stakes[i].timestamp);
    //         }
    //     }

    //     revert("Stake not found");
    // }



    function getStakeByPositionId(uint256 _positionId) external view returns (
    address user,
    uint256 stakeId,
    uint256 amount,
    uint256 startDate,
    uint256 endDate,
    uint256 apy,
    uint256 perDayInterest,
    bool status
) {
    address userAddr = positionIdToUser[_positionId];
    require(userAddr != address(0), "Invalid positionId");

    Stake[] memory stakes = users[userAddr].stakes;
    for (uint256 i = 0; i < stakes.length; i++) {
        if (stakes[i].positionId == _positionId) {
            Stake memory s = stakes[i];

            uint256 apyRate = stakingAPY[s.numDays];
            uint256 dailyInterest = (s.amount * apyRate) / 100 / s.numDays;
            uint256 end = s.timestamp + (s.numDays * 1 days);
            bool isActive = !s.claimed && block.timestamp < end;

            return (
                userAddr,
                s.stakeId,
                s.amount,
                s.timestamp,  // startDate
                end,          // endDate
                apyRate,
                dailyInterest,
                isActive       // status
            );
        }
    }

    revert("Stake not found");
}


    function getPositionIds(address _user) external view returns (uint256[] memory) {
        uint256 count = users[_user].stakes.length;
        uint256[] memory ids = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            ids[i] = users[_user].stakes[i].positionId;
        }

        return ids;
    }




      function getDirectReferralCount(address user) external view returns (uint256) {
        return directReferrals[user].length;
    }

    function getDirectReferralIncome(address user) external view returns (uint256) {
        return directReferralIncome[user];
    }

    function getLevelIncome(address user) external view returns (uint256) {
        return users[user].levelIncome;
    }


    function getReferralIncomeDetails(address user) external view returns (
        address[] memory referralAddresses,
        uint256[] memory incomes,
        uint256[] memory timestamps
    ) {
        ReferralInfo[] storage refs = directReferrals[user];
        uint256 count = refs.length;

        referralAddresses = new address[](count);
        incomes = new uint256[](count);
        timestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            referralAddresses[i] = refs[i].referralAddress;
            incomes[i] = refs[i].incomeEarned;
            timestamps[i] = refs[i].timestamp;
        }

        return (referralAddresses, incomes, timestamps);
    }

    function getTotalIncome(address user) external view returns (uint256) {
        return users[user].totalIncome;
    }

    function getTotalLevelIncome(address user) external view returns (uint256) {
        return users[user].levelIncome;
    }

    function getUserLevel(address user) external view returns (uint8) {
        uint256 count = directReferrals[user].length;
        if (count >= 10) return 3;
        if (count >= 5) return 2;
        if (count >= 1) return 1;
        return 0;
    }

    function getLevelIncomeDistribution(address _user) external view returns (LevelIncomeData[] memory) {
        uint256 totalCount = 0;

        for (uint256 i = 0; i < allUsers.length; i++) {
            address staker = allUsers[i];
            Stake[] memory stakes = users[staker].stakes;
            address upline = users[staker].referrer;

            for (uint8 level = 0; level < levelRewards.length && upline != address(0); level++) {
                if (upline == _user) {
                    totalCount += stakes.length;
                }
                upline = users[upline].referrer;
            }
        }

        LevelIncomeData[] memory incomeData = new LevelIncomeData[](totalCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allUsers.length; i++) {
            address staker = allUsers[i];
            Stake[] memory stakes = users[staker].stakes;
            address upline = users[staker].referrer;

            for (uint8 level = 0; level < levelRewards.length && upline != address(0); level++) {
                if (upline == _user) {
                    for (uint256 j = 0; j < stakes.length; j++) {
                        Stake memory stake = stakes[j];
                        uint256 income = (stake.amount * levelRewards[level]) / 100;

                        incomeData[index++] = LevelIncomeData({
                            receiverAddress: _user,
                            stakeId: stake.stakeId,
                            stakeAmount: stake.amount,
                            incomeReceived: income,
                            uplineAddress: staker,
                            timestamp: stake.timestamp,
                            level: level + 1
                        });
                    }
                }
                upline = users[upline].referrer;
            }
        }

        return incomeData;
    }

    function withdrawUSDT(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        usdtToken.transfer(owner, amount);
    }

    function isRegistered(address user) external view returns (bool) {
        return users[user].registered;
    }

    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
}
