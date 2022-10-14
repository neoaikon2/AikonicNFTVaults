// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/*
    Name: Aikongraphy NFT Vault
    Author: Crypto_Neo
    Date: 10/6/2022

    Desc:
    Allows the user to stake tokens in order to earn NFTs, requires
    the user to unlock the vault first by paying the unlock fee. The
    unlock fee is used to buy and burn the staking token.

    User can claim the NFT after the timelock expires, they are free
    to withdraw at anytime but will lose the NFT if the timelock is
    still active.

    While staked, user rewards are deposited in a staking pool to earn
    rewards for the developer. 
*/


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "gf/WineRewardPool.sol";

// Struct to store user information
struct UserInfo {
    uint index; // Index in the user list
    bool unlocked; // If they've unlocked this vault or not
    uint balance; // Their deposited balance (preserved so we can change the required deposit if necessary)
    uint timestamp; // Last NFT claim time
}

contract AikonicNFTVault is ERC721URIStorage, Ownable {
    uint public constant MAX_SPEED_BONUS = 4 * 1e18;
    uint public POOL_ID; // Pool ID of the farming pool

    uint public unlockFee; // Fee required to unlock the vault, fee is in USD, so 5 * 1e18 = $5
    uint public stakeAmt;  // Minimum amount to stake to earn the NFT
    uint public timelock; // Timelock period

    // Address objects
    address public stakeToken = address(0x5541D83EFaD1f281571B343977648B75d95cdAC2); // GRAPE
    address public farmPool = address(0x28c65dcB3a5f0d456624AFF91ca03E4e315beE49); // Vineyard
    address public LP = address(0xb382247667fe8CA5327cA1Fa4835AE77A9907Bc8); // Joe LP    
    address public stableToken = address(0x130966628846BFd36ff31a822705796e8cb8C18D); // MIM
    address public rewardToken = address(0xC55036B5348CfB45a932481744645985010d3A44); // WINE

    // Token ID Counter
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    uint mintMax = 0;
    // IPFS Image URI
    string public uri = "";

    // User DB
    mapping(address => UserInfo) public user;
    address[] public userList;
    address public dev;

    // Contract active state
    bool public enabled = false;
    modifier isEnabled {
        _checkEnabled();
        _;
    }
    function _checkEnabled() internal view virtual {
        require(enabled == true, "Vault is not enabled");
    }

    // Constructor
    constructor(string memory _uri, string memory _symbol, uint _unlockFee, uint _stakeAmt, uint _timelock, uint _POOL_ID) ERC721("Aikonic NFTs", _symbol) {
        uri = _uri;
        unlockFee = _unlockFee;
        stakeAmt = _stakeAmt;
        timelock = _timelock;
        POOL_ID = _POOL_ID;
        dev = msg.sender;
        enabled = true;
    }

/* ADMIN Functions */    
    // Set the token URI
    function setURI(string memory _uri) public onlyOwner {
        uri = _uri;
    }

    function setDev(address _dev) public onlyOwner {
        require(_dev != address(0), "Can't set dev to 0 address");
        dev = _dev;
    }

    // Set the maximum mintable NFTs,
    function setMax(uint _max) public onlyOwner {
        require(_max >= totalSupply(), "Set Max Failure, can't set to less than current total supply");
        mintMax = _max;
    }

    // Enable/disable deposits
    function setEnabled(bool _enabled) public onlyOwner{
        enabled = _enabled;
    }

/* User DB Functions */

    // Add user to the internal DB
    function addUser(address u) internal {
        user[u].index = userList.length;
        userList.push(u);
    }

    // Remove user from the internal DB
    function removeUser(address u) internal {
        require(userList[user[u].index] == u, "User Not Present");
        // Copies the last user to the current spot and pops the end of the array
        user[userList[userList.length - 1]].index = user[u].index;
        userList[user[u].index] = userList[userList.length - 1];
        userList.pop();
        
        // Delete the user data
        delete user[u];

        // Preserve unlock status
        user[u].unlocked = true;
    }

    // Count of users in the vault
    function userCount() public view returns(uint) {
        return userList.length;
    }

/* Vault Functions */
    // Returns the current price of avax to stableToken from the trader joe LP
    function grapePrice() internal view returns(uint) {
        ERC20 _stakeToken = ERC20(stakeToken);
        ERC20 _stableToken = ERC20(stableToken);
        uint stakeTokenBal = _stakeToken.balanceOf(LP);
        uint stableTokenBal = _stableToken.balanceOf(LP);
        return stableTokenBal * 1e18 / stakeTokenBal;
    }

    // Returns the current unlock fee in AVAX
    function unlockCost() public view returns(uint) {
        return unlockFee * 1e18 / grapePrice();
    }

    // Returns the epoch when the NFT is claimable
    function wenClaim(address account) public view returns(uint) {
        uint bonus = getTimeBonus(account);
        return user[account].timestamp + (timelock * 1e18 / bonus);
    }

    // Returns true if the sender can claim an NFT, false otherwise
    function canClaim(address account) public view returns(bool) {  
        if(user[account].timestamp == 0)
            return false;      
        uint diff = (block.timestamp - user[account].timestamp);
        uint bonus = getTimeBonus(account);
        uint lockperiod = (timelock * 1e18 / bonus);
        return  diff >= lockperiod? true: false;
    }

    // Returns the senders time bonus
    function getTimeBonus(address account) public view returns(uint) {
        if(user[account].balance == 0)
            return 1e18;
        uint numer = (user[account].balance - stakeAmt);
        uint denom = (stakeAmt * 5);
        uint bonus =  1e18 + (numer * 1e18 / denom);
        bonus = bonus > MAX_SPEED_BONUS? MAX_SPEED_BONUS: bonus;
        return bonus;
    }

    // Slurp WINE rewards to dev address, this function should only
    // really be called when a user deposits/withdraws or claims from
    // the vault
    function slurp() internal {
        // Get reward token object
        ERC20 _rewardToken = ERC20(rewardToken);
        // Get the total balance of WINE
        uint incomingWine = _rewardToken.balanceOf(address(this));
        // Withdraw any available rewards to dev address
        if(incomingWine > 0) {
            _rewardToken.transfer(dev, incomingWine); 
        }
    }

    // Unlock the vault by sending the unlock cost
    function unlock(uint amount) public isEnabled {        
        address account = msg.sender;
        ERC20Burnable token = ERC20Burnable(stakeToken);
        
        // Get the unlock cost
        uint _unlockCost = unlockCost();

        // Sanity check
        require(amount > 0, "Unlock failure, unlock cost isn't 0");
        require(amount <= token.balanceOf(account), "Unlock failure, insufficient balance");
        require(amount >= _unlockCost, "Unlock failure, insufficient funds sent");

        // Transfer from and burn
        token.transferFrom(account, address(this), amount);
        token.transfer(0x000000000000000000000000000000000000dEaD, amount);

        // Approve unlock
        user[account].unlocked = true;
    }

    // Deposit the required amount and earn an NFT after the timelock expires
    function deposit(uint amount) public isEnabled {
        address account = msg.sender;
        ERC20 token = ERC20(stakeToken);
        WineRewardPool pool = WineRewardPool(farmPool);

        // Sanity check
        require(amount > 0, "Deposit failure, you can't deposit 0");
        require(user[account].unlocked == true, "Deposit failure, you haven't unlocked this vault");
        require(amount >= stakeAmt || user[account].balance >= stakeAmt, "Deposit failure, insufficient deposit amount");
        require(token.balanceOf(account) >= amount, "Deposit failure, you don't have enough tokens");
        
        // See if the sender has positive balance
        if(user[account].balance > 0)
            // See if the sender has a nft to claim
            if(canClaim(account))
                mint(account);
        
        // Set the user balance to the current stake amount and update the timestamp
        user[account].balance = user[account].balance == 0? amount: user[account].balance + amount;
        user[account].timestamp = user[account].timestamp == 0? block.timestamp: user[account].timestamp;

        // Transfer the stake from the sender
        token.transferFrom(account, address(this), amount);
        // Give the farming pool permission to take the tokens
        if(token.allowance(address(this), farmPool) < amount) {
            token.approve(farmPool, amount);
        }

        // Deposit
        pool.deposit(POOL_ID, amount);

        // Send rewards to dev address
        slurp();

        // Add sender to the global depositor list
        addUser(account);
    }

    // Withdraw the stake amount, if withdrawn before the timelock expires
    // the NFT is lost; otherwise it is claimed and sent to the sender
    // along with the stake amount
    function withdraw() public {
        address account = msg.sender;
        ERC20 token = ERC20(stakeToken);
        WineRewardPool pool = WineRewardPool(farmPool);

        // Sanity check
        require(user[account].unlocked == true, "Withdraw failure, you haven't unlocked this vault");
        require(user[account].balance > 0, "Withdraw failure, you don't have a stake in this vault");

        // Check to see if an NFT is claimable while withdrawing
        if(canClaim(account))
            mint(account);

        // Withdraw the users tokens out of the farming pool
        pool.withdraw(POOL_ID, user[account].balance);
        // Transfer back staked amount
        token.transfer(account, user[account].balance);

        // Send rewards to dev address
        slurp();

        // Clear senders state
        user[account].balance = 0;
        user[account].timestamp = 0;

        // Remove sender from the global depositor list
        removeUser(account);
    }

    // Try to claim an NFT
    function claim() public {
        address account = msg.sender;
        WineRewardPool pool = WineRewardPool(farmPool);

        // Sanity check
        require(user[account].unlocked == true, "Claim failure, you haven't unlocked this vault");
        require(user[account].balance > 0, "Claim failure, you don't have a stake in this vault");
        require(canClaim(account), "Claim failure, you need to wait a while longer");

        // Check for pending rewards
        uint pending = pool.pendingShare(POOL_ID, address(this));
        if(pending > 0) {
            // Claim any pending pool rewards
            pool.withdraw(POOL_ID, 0);
            // Send rewards to dev address
            slurp();
        }   
        
        // Mint the NFT
        mint(account);
        // Update the timestamp for the sender
        user[account].timestamp = block.timestamp;
    }

/* NFT Functions */

    function totalSupply() public view returns(uint) {
        return tokenIds.current();
    }

    // Mint a new token to the supplied address
    function mint(address _address) public onlyOwner returns (uint) {
        tokenIds.increment();
        if(mintMax > 0)
            require(tokenIds.current() <= mintMax, "Mint failure, sold out!");

        uint mintId = tokenIds.current();

        _mint(_address, mintId);
        _setTokenURI(mintId, uri);

        return mintId;
    }

    // Return a blank base URI, we'll only use the token URI
    function _baseURI() internal override view virtual returns (string memory) {
        return "";
    }
}