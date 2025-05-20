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

    struct ReferralIncomeView {
        address referralAddress;
        uint256 incomeEarned;
        uint256 timestamp;
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
        require(users[referrer].stakes.length > 0, "Referrer must stake before you can register");

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

                require(usdtToken.balanceOf(address(this)) >= directReward + level1Reward, "Insufficient contract balance");

                require(usdtToken.transfer(upline, directReward), "Direct referral transfer failed");
                require(usdtToken.transfer(upline, level1Reward), "Level 1 reward transfer failed");

                directReferralIncome[upline] += directReward;
                users[upline].totalIncome += directReward + level1Reward;
                users[upline].levelIncome += level1Reward;

                // ✅ Only update for direct reward
                ReferralInfo[] storage refs = directReferrals[upline];
                for (uint256 j = 0; j < refs.length; j++) {
                    if (refs[j].referralAddress == msg.sender) {
                        refs[j].incomeEarned += directReward; // ✅ Only direct reward, not level
                        break;
                    }
                }
            } else {
                reward = (amount * levelRewards[i]) / 100;
                require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient contract balance");
                require(usdtToken.transfer(upline, reward), "Level 1 reward transfer failed");

                users[upline].totalIncome += reward;
                users[upline].levelIncome += reward;

                // ❌ Do NOT update directReferralInfo for non-first stake
            }
        } else {
            reward = (amount * levelRewards[i]) / 100;
            require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient contract balance");
            require(usdtToken.transfer(upline, reward), "Level reward transfer failed");

            users[upline].totalIncome += reward;
            users[upline].levelIncome += reward;

            // ❌ Do NOT update directReferralInfo for level > 1
        }

        upline = users[upline].referrer;
    }
}


    /// ✅ Fetch direct referral income for a user (array of structs)
    function getDirectReferralIncomeData(address user) external view returns (ReferralIncomeView[] memory) {
        ReferralInfo[] memory refs = directReferrals[user];
        ReferralIncomeView[] memory data = new ReferralIncomeView[](refs.length);

        for (uint256 i = 0; i < refs.length; i++) {
            data[i] = ReferralIncomeView({
                referralAddress: refs[i].referralAddress,
                incomeEarned: refs[i].incomeEarned,
                timestamp: refs[i].timestamp
            });
        }

        return data;
    }
}
