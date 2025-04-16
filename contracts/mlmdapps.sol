// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MLMStaking {
    address public owner;

    struct User {
        address referrer;
        bool registered;
        uint256 stakedAmount;
    }

    mapping(address => User) public users;
    uint8[3] public levelRewards = [5, 3, 2]; // Percentages for level 1, 2, and 3

    event Registered(address user, address referrer);
    event Staked(address user, uint256 amount);

    constructor() {
        owner = msg.sender;
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

        users[msg.sender] = User({
            referrer: _referrer,
            registered: true,
            stakedAmount: 0
        });

        emit Registered(msg.sender, _referrer);
    }

    function stake() external payable onlyRegistered {
        require(msg.value > 0, "Amount must be > 0");
        users[msg.sender].stakedAmount += msg.value;

        address payable upline = payable(users[msg.sender].referrer);
        uint256 remaining = msg.value;

        for (uint8 i = 0; i < 3; i++) {
            if (upline == address(0)) break;
            uint256 commission = (msg.value * levelRewards[i]) / 100;
            payable(upline).transfer(commission);
            remaining -= commission;
            upline = payable(users[upline].referrer);
        }

        // Any remaining Ether stays in contract
        emit Staked(msg.sender, msg.value);
    }

    function getUserInfo(address _user) external view returns (
        address referrer,
        bool registered,
        uint256 stakedAmount
    ) {
        User memory u = users[_user];
        return (u.referrer, u.registered, u.stakedAmount);
    }

    // Owner can withdraw remaining balance (for admin fees or unused Ether)
    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(amount);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
