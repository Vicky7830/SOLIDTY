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
    }

    struct Stake {
        uint256 stakeId;
        uint256 positionId;
        uint256 amount;
        uint256 timestamp;
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
    address[] public allUsers;


    uint8[] public levelRewards = [5, 3, 2]; // % income for level 1, 2, 3 uplines

    function register(address referrer) external {
        require(users[msg.sender].referrer == address(0), "Already registered");
        require(referrer != msg.sender, "Cannot refer yourself");

        users[msg.sender].referrer = referrer;
        allUsers.push(msg.sender);

        directReferrals[referrer].push(ReferralInfo({
            referralAddress: msg.sender,
            incomeEarned: 0,
            timestamp: block.timestamp
        }));
    }


    function stake(uint256 amount) external {
        require(amount > 0, "Stake must be greater than 0");
        require(users[msg.sender].referrer != address(0), "User must be registered");

        usdtToken.transferFrom(msg.sender, address(this), amount);

        uint256 positionId = ++stakeCounter;

        users[msg.sender].stakes.push(Stake({
            stakeId: stakeCounter,
            positionId: positionId,
            amount: amount,
            timestamp: block.timestamp
        }));

        positionIdToUser[positionId] = msg.sender;


        // Distribute level income
        address upline = users[msg.sender].referrer;

        for (uint8 i = 0; i < levelRewards.length && upline != address(0); i++) {
            uint256 reward = (amount * levelRewards[i]) / 100;
            usdtToken.transfer(upline, reward);

            users[upline].totalIncome += reward;
            users[upline].levelIncome += reward;

            // Update referral info
            ReferralInfo[] storage refs = directReferrals[upline];
            for (uint256 j = 0; j < refs.length; j++) {
                if (refs[j].referralAddress == msg.sender) {
                    refs[j].incomeEarned += reward;
                }
            }

            upline = users[upline].referrer;
        }
    }

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

    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }
}
