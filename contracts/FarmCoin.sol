pragma solidity >=0.4.21 <0.6.0;

contract FarmCoin{

	string public name = 'FarmCoin';
	string public standard = 'FarmCoin v.0.1' ;
	string public symbol = 'FRMC';

	// ERC20 stanard coin 
	// totalsupply || balanceOf default parameter
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value

	);

	constructor(uint256 _initialToken) public{
		balanceOf[msg.sender] = _initialToken;
		totalSupply = _initialToken;
	}

	function transfer(address _to, uint256 _val) public returns(bool success){
		require(balanceOf[msg.sender] >= _val);
		balanceOf[msg.sender] -= _val;
		balanceOf[_to] += _val;
		emit Transfer(msg.sender,_to,_val);
		return true;
	}

	function approve(address _spender, uint256 _val) public returns(bool success){
		
		allowance[msg.sender][_spender] = _val;

		emit Approval(msg.sender,_spender,_val);

		return true;

	}

	function transferFrom(address _from,address _to, uint256 _value) public returns (bool success){
		require(balanceOf[_from] >= _value);
		require(_value <= allowance[_from][msg.sender]);
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from,_to,_value);
		return true;


	}


}