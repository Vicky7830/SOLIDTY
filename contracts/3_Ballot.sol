// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MLMStaking {
    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 timestamp;
    }


      struct User {
        address referrer;
        bool registered;
        Stake[] stakes;
        uint256 totalIncome;
        uint256 directReferralIncome;
        uint256 levelIncome;
    }

      struct ReferralInfo {
        address referralAddress;
        uint256 incomeEarned;
        uint256 timestamp;
    }

    

    

    struct LevelIncomeData {
        address receiverAddress; // address receiving income (caller)
        uint256 stakeId;
        uint256 stakeAmount;
        uint256 incomeReceived;
        address uplineAddress; // the downline (who staked)
        uint256 timestamp;
        uint8 level;
    }


     mapping(address => User) public users;
    mapping(address => ReferralInfo[]) public directReferrals;
    mapping(uint256 => address) public positionIdToUser;

   


    address[] public allUsers;

    uint256 public stakeCounter;

     uint256 public nextStakeId;
    uint256 public nextPositionId;

    uint8[] public levelRewards = [5, 3, 2]; // Level 1 = 5%, Level 2 = 3%, Level 3 = 2%

    // Register with referrer
    function register(address referrer) external {
        require(users[msg.sender].referrer == address(0), "Already registered");
        require(referrer != msg.sender, "Can't refer yourself");

        users[msg.sender].referrer = referrer;
        allUsers.push(msg.sender);
    }

    // Stake function
    function stake() external payable {
        require(msg.value > 0, "Stake amount required");
        require(users[msg.sender].referrer != address(0), "Register first");

        users[msg.sender].stakes.push(Stake({
            stakeId: ++stakeCounter,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        // Distribute level income
        address upline = users[msg.sender].referrer;
        for (uint8 i = 0; i < levelRewards.length && upline != address(0); i++) {
            uint256 reward = (msg.value * levelRewards[i]) / 100;
            payable(upline).transfer(reward);
            upline = users[upline].referrer;
        }
    }

    // Get income received by _user from downline staking
    function getLevelIncomeDistribution(address _user) external view returns (LevelIncomeData[] memory) {
        uint256 totalCount = 0;

        // Count total entries
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

        // Collect data
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

    // Helper: get total users
    function getTotalUsers() external view returns (uint256) {
        return allUsers.length;
    }

    // Helper: get stakes of a user
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return users[user].stakes;
    }
}
