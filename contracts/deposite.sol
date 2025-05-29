

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address recipient) external view returns (uint256);
}

contract USDTTransfer {
    IERC20 public usdtToken;
    uint256 public lowFeePercentage = 0.2 * 10**18; 
    uint256 public highFeePercentage = 0.002 * 10**18;  
    address public admin; // Admin address

    event TransferWithFee(address indexed from, address indexed to, uint256 transferredAmount, uint256 fee);
    event AdminWithdrawal(address indexed to, uint256 amount);
    event FeePercentageUpdated(string feeType, uint256 newPercentage);

    constructor(address _usdtToken) {
        usdtToken = IERC20(_usdtToken);
        admin = msg.sender; // Set the contract deployer as the admin
    }

    // Only admin modifier
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Set the low fee percentage (only admin)
    function setLowFeePercentage(uint256 newLowFeePercentage) external onlyAdmin {
        lowFeePercentage = newLowFeePercentage;
        emit FeePercentageUpdated("lowFeePercentage", newLowFeePercentage);
    }

    // Set the high fee percentage (only admin)
    function setHighFeePercentage(uint256 newHighFeePercentage) external onlyAdmin {
        highFeePercentage = newHighFeePercentage;
        emit FeePercentageUpdated("highFeePercentage", newHighFeePercentage);
    }

    // Transfer function with dynamic fee
    function transfer(address to, uint256 amount) external onlyAdmin {
        require(amount > 0, "Amount must be greater than 0");

        // Calculate the fee and the amount after fee deduction
        uint256 fee = calculateFee(amount);
        uint256 amountAfterFee = amount - fee;

        // Transfer the fee to the contract itself
        require(usdtToken.transferFrom(msg.sender, address(this), fee), "Fee transfer failed");

        // Transfer the remaining amount to the recipient
        require(usdtToken.transferFrom(msg.sender, to, amountAfterFee), "Transfer to recipient failed");

        emit TransferWithFee(msg.sender, to, amountAfterFee, fee);
    }

    // Function to calculate the dynamic fee based on amount
    function calculateFee(uint256 amount) public view returns (uint256) {
        if (amount <= 100 * 10**18) {  // Assuming amount is in wei and 100 USDT = 100 * 10^18 wei
             return (lowFeePercentage);  
        } else {
            return (amount * highFeePercentage) / 10**18; 
        }
    }

    // Withdraw accumulated fees (only contract admin can initiate this)
    function adminWithdraw(address to, uint256 amount) external onlyAdmin {
        uint256 contractBal = usdtToken.balanceOf(address(this));
        require(contractBal >= amount, "Insufficient balance in contract");

        // Transfer the requested amount from the contract to the specified address
        require(usdtToken.transfer(to, amount), "Withdraw failed");

        emit AdminWithdrawal(to, amount);
    }

    // Function to check the contract's USDT balance (fees)
    function contractBalance() public view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }
}