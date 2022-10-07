// SPDX-License-Identifier: GPL-3.0

/*
    Name: Aikongraphy NFT Vault
    Author: Crypto_Neo
    Date: 10/6/2022

    Desc:
    Allows the user to stake tokens in order to earn NFTs, requires
    the user to unlock the vault first by paying the unlock fee.

    User can claim the NFT after the timelock expires, they are free
    to withdraw at anytime but will lose the NFT if the timelock is
    still active.
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
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
    uint public constant MAX_SPEED_BONUS = 2 * 1e18;

    uint public unlockFee = 0; // Fee is in USD, so 5 * 1e18 = $5 and 1 * 1e16 = $0.01
    uint public stakeAmt = 0;
    uint public timelock = 0;
    uint public pool_id = 0;
    address public stakeToken = address(0x1e553939Eb3611EabbCa534c78AEc3C821464fad);
    address public joeLP = address(0x781655d802670bbA3c89aeBaaEa59D3182fD755D);
    address public wavax = address(0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7);
    address public mim = address(0x130966628846BFd36ff31a822705796e8cb8C18D);
    address public wine = address(0x06d45bf7d8b19C31c62bC566159331cEFc27b1B8);//address(0xC55036B5348CfB45a932481744645985010d3A44);
    address public vineyard = address(0xb9B7A028288B5FA91b2eB1C651Bf99CC62561BC3);//address(0x28c65dcB3a5f0d456624AFF91ca03E4e315beE49);

    // Token ID Counter
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    
    // IPFS Image URI
    string public uri = "";

    mapping(address => UserInfo) public user;
    address[] public userList;

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
    constructor(string memory _uri, uint _pool_id) ERC721("Aikonic NFT Collection", "AIKONS") {
        uri = _uri;        
        pool_id = _pool_id;
        enabled = true;
    }

/* ADMIN Functions */
    
    // Set the token URI
    function setURI(string memory _uri) public onlyOwner {
        uri = _uri;
    }

    // Enable/disable deposits
    function setEnabled(bool _enabled) public onlyOwner{
        enabled = _enabled;
    }

    // initialize the unlock fee
    function initUnlockFee(uint fee) public onlyOwner {
        require(fee > 0, "Unlock fee can't be 0");
        require(unlockFee == 0, "Unlock fee is already set and can't be set again");
        unlockFee = fee;
    }

    // initialize the stake amount
    function initStakeAmount(uint reqDep) public onlyOwner {
        require(reqDep > 0, "Stake amount can't be 0");
        require(stakeAmt == 0, "Stake amount is already set and can't be set again");
        stakeAmt = reqDep;
    }
    
    // initialize the timelock
    function initTimelock(uint _timelock) public onlyOwner {
        require(_timelock > 0, "Timelock can't be 0");
        require(timelock == 0 , "Timelock already set and can't be set again");
        timelock = _timelock;
    }

    // Withdraw any wine held in the contract
    function withdrawWine() public onlyOwner {
        address account = msg.sender;
        ERC20 _wine = ERC20(wine);
        WineRewardPool _vineyard = WineRewardPool(vineyard);
        _vineyard.withdraw(pool_id, 0);
        uint amount = _wine.balanceOf(address(this));
        _wine.transfer(account, amount);
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
    // Returns the current price of avax to MIM from the trader joe LP
    function avaxPrice() internal pure returns(uint) {
        return 17 * 1e18;
        /*
        ERC20 _wavax = ERC20(wavax);
        ERC20 _mim = ERC20(mim);
        uint wavaxBal = _wavax.balanceOf(joeLP);
        uint mimBal = _mim.balanceOf(joeLP);
        return mimBal * 1e18 / wavaxBal;
        */
    }

    // Returns the current unlock fee in AVAX
    function unlockAvax() public view returns(uint) {
        return unlockFee * 1e18 / avaxPrice();
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

    // Unlock the vault by sending the unlock fee
    function unlock() public payable {
        uint amount = msg.value;
        address account = msg.sender;
        uint fee = unlockAvax();
        require(amount >= fee, "Unlock failure, insufficient funds sent");        
        user[account].unlocked = true;
    }

    // Deposit the required amount and earn an NFT after the timelock expires
    function deposit(uint amount) public isEnabled {
        address account = msg.sender;
        ERC20 token = ERC20(stakeToken);
        WineRewardPool pool = WineRewardPool(vineyard);
        require(amount > 0, "Deposit failure, you can't deposit 0");
        require(user[account].unlocked == true, "Deposit failure, you haven't unlocked this vault");
        require(amount >= stakeAmt || user[account].balance >= stakeAmt, "Deposit failure, insufficient deposit amount");
        require(token.balanceOf(account) >= amount, "Deposit failure, you don't have enough tokens");
        
        if(user[account].balance > 0)
            if(canClaim(account))
                claim();
        
        // Set the user balance to the current stake amount and update the timestamp
        user[account].balance = user[account].balance == 0? amount: user[account].balance + amount;
        user[account].timestamp = user[account].timestamp == 0? block.timestamp: user[account].timestamp;

        // Transfer the stake
        token.transferFrom(account, address(this), amount);
        if(token.allowance(account, vineyard) < amount) {
            token.approve(vineyard, amount);
        }
        pool.deposit(pool_id, amount);

        // Add sender to the global depositor list
        addUser(account);
    }

    // Withdraw the stake amount, if withdrawn before the timelock expires
    // the NFT is lost; otherwise it is claimed and sent to the sender
    // along with the stake amount
    function withdraw() public {
        address account = msg.sender;
        ERC20 token = ERC20(stakeToken);
        WineRewardPool pool = WineRewardPool(vineyard);
        require(user[account].unlocked == true, "Withdraw failure, you haven't unlocked this vault");
        require(user[account].balance > 0, "Withdraw failure, you don't have a stake in this vault");

        // Check to see if an NFT is claimable while withdrawing
        if(canClaim(account))
            mint(account);

        pool.withdraw(pool_id, user[account].balance);        

        // Transfer back staked amount
        token.transfer(account, user[account].balance);

        // Clear senders state
        user[account].balance = 0;
        user[account].timestamp = 0;

        // Remove sender from the global depositor list
        removeUser(account);
    }

    // Try to claim an NFT
    function claim() public {
        address account = msg.sender;
        require(user[account].unlocked == true, "Claim failure, you haven't unlocked this vault");
        require(user[account].balance > 0, "Claim failure, you don't have a stake in this vault");
        require(canClaim(account), "Claim failure, you need to wait a while longer");
        
        // Mint the NFT
        mint(account);
        // Update the timestamp for the next claim
        user[account].timestamp = block.timestamp;
    }

/* NFT Functions */

    // Mint a new token to the supplied address
    function mint(address _address) public onlyOwner returns (uint) {
        tokenIds.increment();
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