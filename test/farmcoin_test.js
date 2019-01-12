var FarmCoin = artifacts.require("./FarmCoin.sol");

contract('FarmCoin',function(accounts){
	var coin;

	it('initialize coin', function(){
		return FarmCoin.deployed().then(function(instance){
			coin = instance;
			return coin.name();
		}).then(function(name){
			assert.equal(name,'FarmCoin','name is correct');
			return coin.standard();
		}).then(function(standard){
			assert.equal(standard,'FarmCoin v.0.1','standard is correct');
			return coin.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'FRMC','symbol is correct');
		})
	})

	it('total supply verify', function(){
		return FarmCoin.deployed().then(function(instance){
			coin = instance;
			return coin.totalSupply();
		}).then(function(totalsupply){
			assert.equal(totalsupply.toNumber(),1000000,'totalsupply');
			return coin.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,'initialize to admin account');
		});
	})

	it('transfer token', function(){
		return FarmCoin.deployed().then(function(instance){
			coin = instance;
			return coin.transfer.call(accounts[1],90999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >=0,'error message contains revert');
			return coin.transfer(accounts[1],250000,{from : accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'one event triggered');
			assert.equal(receipt.logs[0].event,'Transfer','transfer event triggered');
			assert.equal(receipt.logs[0].args._from,accounts[0],'from correct');
			assert.equal(receipt.logs[0].args._to,accounts[1],'receipt correct');
			assert.equal(receipt.logs[0].args._value,250000,'value correct');
			return coin.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250000,'adds amount to receipt');
			return coin.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),750000, 'deducts the amount from sender');
		});
	});

	it('approves tokens for delegated transfer', function() {
	    	return FarmCoin.deployed().then(function(instance) {
	      	tokenInstance = instance;
	      	return tokenInstance.approve.call(accounts[1], 100);
	    }).then(function(success) {
	    	assert.equal(success, true, 'it returns true');
	      	return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
	    }).then(function(receipt) {
	      assert.equal(receipt.logs.length, 1, 'triggers one event');
	      assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
	      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
	      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
	      assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
	      return tokenInstance.allowance(accounts[0], accounts[1]);
	    }).then(function(allowance) {
	      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
	    });
  	});

	  it('handles delegated token transfers', function() {
    return FarmCoin.deployed().then(function(instance) {
      tokenInstance = instance;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // Transfer some tokens to fromAccount
      return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
    }).then(function(receipt) {
      // Approve spendingAccount to spend 10 tokens form fromAccount
      return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
    }).then(function(receipt) {
      // Try transferring something larger than the sender's balance
      return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
      // Try transferring something larger than the approved amount
      return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
      return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(success) {
      assert.equal(success, true);
      return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
      return tokenInstance.allowance(fromAccount, spendingAccount);
    }).then(function(allowance) {
      assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
    });
 });   

});

