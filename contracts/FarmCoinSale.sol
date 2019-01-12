pragma solidity >=0.4.21 <0.6.0;

import './FarmCoin.sol';


contract FarmCoinSale{
	address admin;
	FarmCoin public farmContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(
		address _buyer,
		uint256 _amount
	);

	constructor(FarmCoin _farmContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		farmContract = _farmContract;
		tokenPrice = _tokenPrice;
	}

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(farmContract.balanceOf(address(this)) >= _numberOfTokens);
        require(farmContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(farmContract.transfer(admin, farmContract.balanceOf(address(this))));

        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        // admin.transfer(address(this).balance);

    }
}