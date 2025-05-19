// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract SikkaStakingDecentralize {
    address public owner;
    uint256 public stakeCounter;
    IERC20 public usdtToken;

    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtToken);
        users[owner].registered = true;

        stakingAPY[30] = 1;
        stakingAPY[60] = 2;

        stakingAPY[90] = 4;
        stakingAPY[120] = 6;
        stakingAPY[180] = 9;
        stakingAPY[365] = 20;
    }

    struct Stake {
        uint256 stakeId;
        uint256 positionId;
        uint256 amount;
        uint256 timestamp;
        uint256 numDays;
        bool claimed;
    }

    // ✅ New Struct for Return
struct StakeDetails {
    address user;
    uint256 stakeId;
    uint256 amount;
    uint256 startDate;
    uint256 endDate;
    uint256 apy;
    uint256 perDayInterest;
    bool status;
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

    event Claimed(
        address indexed user,
        uint256 stakeId,
        uint256 amount,
        uint256 reward
    );

    modifier onlyRegistered() {
        require(users[msg.sender].registered, "Not registered");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function register(address referrer) external {
        require(!users[msg.sender].registered, "Already registered");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(users[referrer].registered, "Referrer not registered");
        require(
            users[referrer].stakes.length > 0,
            "Referrer must stake before you can register"
        );

        users[msg.sender].referrer = referrer;
        users[msg.sender].registered = true;
        allUsers.push(msg.sender);

        directReferrals[referrer].push(
            ReferralInfo({
                referralAddress: msg.sender,
                incomeEarned: 0,
                timestamp: block.timestamp
            })
        );
    }

  






 function stake(uint256 numDays, uint256 amount) external onlyRegistered {
        require(amount > 0, "Stake amount must be greater than 0");
        require(stakingAPY[numDays] > 0, "Invalid staking duration");

        address referrer = users[msg.sender].referrer;

        if (referrer != address(0)) {
            require(users[referrer].stakes.length > 0, "Referrer must stake before you can stake");
        }

        bool success = usdtToken.transferFrom(msg.sender, address(this), amount);
        require(success, "USDT transfer failed");

        uint256 positionId = ++stakeCounter;

        users[msg.sender].stakes.push(
            Stake({
                stakeId: stakeCounter,
                positionId: positionId,
                amount: amount,
                timestamp: block.timestamp,
                numDays: numDays,
                claimed: false
            })
        );

        positionIdToUser[positionId] = msg.sender;

        bool isFirstStake = users[msg.sender].stakes.length == 1;

        address upline = users[msg.sender].referrer;

        for (uint8 i = 0; i < levelRewards.length && upline != address(0); i++) {
            uint256 reward = 0;

            if (i == 0) {
                if (isFirstStake) {
                    // 5% Direct + 5% Level 1
                    uint256 directReward = (amount * 5) / 100;
                    uint256 level1Reward = (amount * 5) / 100;

                    require(usdtToken.balanceOf(address(this)) >= directReward, "Insufficient contract balance for direct");
                    bool directSuccess = usdtToken.transfer(upline, directReward);
                    require(directSuccess, "Direct referral transfer failed");

                    directReferralIncome[upline] += directReward;
                    users[upline].totalIncome += directReward;

                    require(usdtToken.balanceOf(address(this)) >= level1Reward, "Insufficient contract balance for level 1");
                    bool level1Success = usdtToken.transfer(upline, level1Reward);
                    require(level1Success, "Level 1 reward transfer failed");

                    users[upline].totalIncome += level1Reward;
                    users[upline].levelIncome += level1Reward;

                    reward = level1Reward; // For updating ReferralInfo
                } else {
                    // Only 5% Level 1
                    reward = (amount * levelRewards[i]) / 100;

                    require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient contract balance");
                    bool level1Success = usdtToken.transfer(upline, reward);
                    require(level1Success, "Level 1 reward transfer failed");

                    users[upline].totalIncome += reward;
                    users[upline].levelIncome += reward;
                }
            } else {
                // Level 2–5
                reward = (amount * levelRewards[i]) / 100;

                require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient contract balance");
                bool levelSuccess = usdtToken.transfer(upline, reward);
                require(levelSuccess, "Level reward transfer failed");

                users[upline].totalIncome += reward;
                users[upline].levelIncome += reward;
            }

            // ✅ Update referral info only for direct referrals (i == 0)
            if (i == 0) {
                ReferralInfo[] storage refs = directReferrals[upline];
                for (uint256 j = 0; j < refs.length; j++) {
                    if (refs[j].referralAddress == msg.sender) {
                        refs[j].incomeEarned += reward;
                        break;
                    }
                }
            }

            upline = users[upline].referrer;
        }
    }
    function getContractBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }

    // function getEstimatedReturn(uint256 amount, uint256 numDays)
    //     external
    //     view
    //     returns (uint256 interest, uint256 totalReturn)
    // {
    //     require(amount > 0, "Amount must be greater than 0");
    //     require(stakingAPY[numDays] > 0, "Invalid staking duration");

    //     uint256 apy = stakingAPY[numDays];
    //     interest = (amount * apy * numDays) / (100 * 365);
    //     totalReturn = amount + interest;

    //     return (interest, totalReturn);
    // }


    function getEstimatedReturn(uint256 amount, uint256 numDays) 
    external
    view
    returns (uint256 interest, uint256 totalReturn)
{
    require(amount > 0, "Amount must be greater than 0");
    require(stakingAPY[numDays] > 0, "Invalid staking duration");

    uint256 apy = stakingAPY[numDays];
    uint256 denominator;

    if (numDays == 30) {
        denominator = 100 * 30;
    } else if (numDays == 60) {
        denominator = 100 * 60;
    } else if (numDays == 90) {
        denominator = 100 * 90;
    } else if (numDays == 120) {
        denominator = 100 * 120;
    } else if (numDays == 180) {
        denominator = 100 * 180;
    } else if (numDays == 365) {
        denominator = 100 * 365;
    } else {
        revert("Unsupported staking duration");
    }

    interest = (amount * apy * numDays) / denominator;
    totalReturn = amount + interest;
}


    // ✅ Set staking APY
    function setStakingAPY(uint256 numDays, uint256 apy) external onlyOwner {
        require(numDays > 0, "Days must be > 0");
        stakingAPY[numDays] = apy;
    }

    // ✅ Set level rewards
    function setLevelRewards(uint8[5] memory newRewards) external onlyOwner {
        levelRewards = newRewards;
    }

   function claim(uint256 _positionId) external onlyRegistered {
    address userAddress = msg.sender;
    User storage user = users[userAddress];
    Stake[] storage stakes = user.stakes;

    bool found = false;

    for (uint256 i = 0; i < stakes.length; i++) {
        if (stakes[i].positionId == _positionId && !stakes[i].claimed) {
            require(
                block.timestamp >= stakes[i].timestamp + (stakes[i].numDays * 1 days),
                "Staking period not yet completed"
            );

            uint256 apy = stakingAPY[stakes[i].numDays];
            uint256 denominator;

            if (stakes[i].numDays == 30) {
                denominator = 100 * 30;
            } else if (stakes[i].numDays == 60) {
                denominator = 100 * 60;
            } else if (stakes[i].numDays == 90) {
                denominator = 100 * 90;
            } else if (stakes[i].numDays == 120) {
                denominator = 100 * 120;
            } else if (stakes[i].numDays == 180) {
                denominator = 100 * 180;
            } else if (stakes[i].numDays == 365) {
                denominator = 100 * 365;
            } else {
                revert("Unsupported staking duration");
            }

            uint256 interest = (stakes[i].amount * apy * stakes[i].numDays) / denominator;
            uint256 totalAmount = stakes[i].amount + interest;

            require(
                usdtToken.balanceOf(address(this)) >= totalAmount,
                "Insufficient contract balance"
            );

            stakes[i].claimed = true;
            bool success = usdtToken.transfer(userAddress, totalAmount);
            require(success, "USDT transfer failed");

            emit Claimed(
                userAddress,
                stakes[i].stakeId,
                stakes[i].amount,
                interest
            );

            found = true;
            break;
        }
    }

    require(found, "Stake not found or already claimed");
}


    function claimEmergency(uint256 _positionId) external onlyRegistered {
        address userAddress = msg.sender;
        User storage user = users[userAddress];
        Stake[] storage stakes = user.stakes;

        bool found = false;

        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].positionId == _positionId && !stakes[i].claimed) {
                // Check if 10 days have passed since staking
                require(
                    block.timestamp >= stakes[i].timestamp + 10 days,
                    "Emergency claim allowed only after 10 days"
                );

                uint256 amount = stakes[i].amount;
                uint256 adminFee = (amount * 5) / 100;
                uint256 userAmount = amount - adminFee;

                require(
                    usdtToken.balanceOf(address(this)) >= amount,
                    "Insufficient contract balance"
                );

                stakes[i].claimed = true;

                // Transfer user's share
                bool successUser = usdtToken.transfer(userAddress, userAmount);
                require(successUser, "User transfer failed");

                // Transfer admin fee
                bool successAdmin = usdtToken.transfer(
                    0x9aB49A6105a768ed88b8AfD9cca7f6886F739aAd,
                    adminFee
                );
                require(successAdmin, "Admin fee transfer failed");

                emit Claimed(userAddress, stakes[i].stakeId, userAmount, 0);

                found = true;
                break;
            }
        }

        require(found, "Stake not found or already claimed");
    }

    // function getStakeByPositionId(uint256 _positionId)
    //     external
    //     view
    //     returns (
    //         address user,
    //         uint256 stakeId,
    //         uint256 amount,
    //         uint256 startDate,
    //         uint256 endDate,
    //         uint256 apy,
    //         uint256 perDayInterest,
    //         bool status
    //     )
    // {
    //     address userAddr = positionIdToUser[_positionId];
    //     require(userAddr != address(0), "Invalid positionId");

    //     Stake[] memory stakes = users[userAddr].stakes;
    //     for (uint256 i = 0; i < stakes.length; i++) {
    //         if (stakes[i].positionId == _positionId) {
    //             Stake memory s = stakes[i];

    //             uint256 apyRate = stakingAPY[s.numDays];
    //             uint256 end = s.timestamp + (s.numDays * 1 days);
    //             bool isActive = !s.claimed && block.timestamp < end;

    //             // ✅ Correct daily interest logic: (amount * apy / 100) / 365
    //             uint256 dailyInterest = (s.amount * apyRate) / 100 / 365;

    //             return (
    //                 userAddr,
    //                 s.stakeId,
    //                 s.amount,
    //                 s.timestamp,
    //                 end,
    //                 apyRate,
    //                 dailyInterest,
    //                 isActive
    //             );
    //         }
    //     }

    //     revert("Stake not found");
    // }

    function getStakeByPositionId(uint256 _positionId)
    external
    view
    returns (StakeDetails memory)
{
    address userAddr = positionIdToUser[_positionId];
    require(userAddr != address(0), "Invalid positionId");

    Stake[] memory stakes = users[userAddr].stakes;
    for (uint256 i = 0; i < stakes.length; i++) {
        if (stakes[i].positionId == _positionId) {
            Stake memory s = stakes[i];

            uint256 apyRate = stakingAPY[s.numDays];
            uint256 end = s.timestamp + (s.numDays * 1 days);
            bool isActive = !s.claimed && block.timestamp < end;

            // ✅ Compute per-day interest using updated logic
            uint256 denominator;
            if (s.numDays == 30) {
                denominator = 100 * 30;
            } else if (s.numDays == 60) {
                denominator = 100 * 60;
            } else if (s.numDays == 90) {
                denominator = 100 * 90;
            } else if (s.numDays == 120) {
                denominator = 100 * 120;
            } else if (s.numDays == 180) {
                denominator = 100 * 180;
            } else if (s.numDays == 365) {
                denominator = 100 * 365;
            } else {
                revert("Unsupported staking duration");
            }

            uint256 totalInterest = (s.amount * apyRate * s.numDays) / denominator;
            uint256 dailyInterest = totalInterest / s.numDays;

            return StakeDetails({
                user: userAddr,
                stakeId: s.stakeId,
                amount: s.amount,
                startDate: s.timestamp,
                endDate: end,
                apy: apyRate,
                perDayInterest: dailyInterest,
                status: isActive
            });
        }
    }

    revert("Stake not found");
}
    function getPositionIds(address _user)
        external
        view
        returns (uint256[] memory)
    {
        uint256 count = users[_user].stakes.length;
        uint256[] memory ids = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            ids[i] = users[_user].stakes[i].positionId;
        }

        return ids;
    }

    function getDirectReferralCount(address user)
        external
        view
        returns (uint256)
    {
        return directReferrals[user].length;
    }

    function getDirectReferralIncome(address user)
        external
        view
        returns (uint256)
    {
        return directReferralIncome[user];
    }

    function getLevelIncome(address user) external view returns (uint256) {
        return users[user].levelIncome;
    }

      function getReferralIncomeDetails(address user)
        external
        view
        returns (
            address[] memory referralAddresses,
            uint256[] memory incomes,
            uint256[] memory timestamps
        )
    {
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

    function getLevelIncomeDistribution(address _user)
        external
        view
        returns (LevelIncomeData[] memory)
    {
        uint256 totalCount = 0;

        for (uint256 i = 0; i < allUsers.length; i++) {
            address staker = allUsers[i];
            Stake[] memory stakes = users[staker].stakes;
            address upline = users[staker].referrer;

            for (
                uint8 level = 0;
                level < levelRewards.length && upline != address(0);
                level++
            ) {
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

            for (
                uint8 level = 0;
                level < levelRewards.length && upline != address(0);
                level++
            ) {
                if (upline == _user) {
                    for (uint256 j = 0; j < stakes.length; j++) {
                        Stake memory stake = stakes[j];
                        uint256 income = (stake.amount * levelRewards[level]) /
                            100;

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

    function ownerTransfer(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        bool success = usdtToken.transfer(to, amount);
        require(success, "Token transfer failed");
    }
}
