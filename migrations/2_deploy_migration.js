var FarmCoin = artifacts.require("./FarmCoin.sol");
var FarmCoinSale = artifacts.require("./FarmCoinSale.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmCoin, 1000000).then(function(){
  	// 0.001 ether
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(FarmCoinSale,FarmCoin.address, tokenPrice);
  });
};
