const CHAIN_ID = 43114;
const MAX_PROFIT = 3 * 10e18;
const PRECISION = 1e18;
const MAX_UINT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

/*
 * Checks for a valid metamask instance and requests the account
 * Returns true if the user connected to the site
 */
const Web3Enabled = async () => {
	if(typeof window.ethereum !== "undefined") {
		await window.ethereum.request({method: 'eth_requestAccounts'}).then(function(result) {
			console.log("[SUCCESS] " + result);
		}, function(error) {
			console.log("[ERROR " + error.code + "] " + error.message);
		});

		window.web3 = new Web3(window.ethereum);
		return true;
	} else {
		console.log("Metamask is not installed!");
	}
	return false;
}

/*
 * Checks to make sure we're on the right chain and if not
 * invoke a switch
 */ 
const switchNetwork = async(chainId) => {
	var currentChainId = window.web3.eth.net.getId();
	if(currentChainId !== chainId) {
		await window.ethereum.request(
		{
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: window.web3.utils.toHex(chainId) }]
		});
	}
}

// Constants
const WINE_TOKEN = "0xC55036B5348CfB45a932481744645985010d3A44";
const GRAPE_TOKEN = "0x5541D83EFaD1f281571B343977648B75d95cdAC2";
const MIM_TOKEN = "0x130966628846BFd36ff31a822705796e8cb8C18D";
const TOKEN_ABI = [{"inputs": [{"internalType": "uint256","name": "initialSupply","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "subtractedValue","type": "uint256"}],"name": "decreaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "addedValue","type": "uint256"}],"name": "increaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}];

const GRAPE_MIM_LP = "0xb382247667fe8CA5327cA1Fa4835AE77A9907Bc8";

const VINEYARD = "0x28c65dcB3a5f0d456624AFF91ca03E4e315beE49";
const VINEYARD_ABI = [{"inputs": [{"internalType": "uint256","name": "_allocPoint","type": "uint256"},{"internalType": "contract IERC20","name": "_token","type": "address"},{"internalType": "bool","name": "_withUpdate","type": "bool"},{"internalType": "uint256","name": "_lastRewardTime","type": "uint256"}],"name": "add","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "deposit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"}],"name": "emergencyWithdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_wine","type": "address"},{"internalType": "uint256","name": "_poolStartTime","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Deposit","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "EmergencyWithdraw","type": "event"},{"inputs": [{"internalType": "contract IERC20","name": "_token","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "address","name": "to","type": "address"}],"name": "governanceRecoverUnsupported","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "massUpdatePools","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "RewardPaid","type": "event"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_allocPoint","type": "uint256"}],"name": "set","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_operator","type": "address"}],"name": "setOperator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"}],"name": "updatePool","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [{"internalType": "uint256","name": "_fromTime","type": "uint256"},{"internalType": "uint256","name": "_toTime","type": "uint256"}],"name": "getGeneratedReward","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "operator","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "address","name": "_user","type": "address"}],"name": "pendingShare","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "poolEndTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "poolInfo","outputs": [{"internalType": "contract IERC20","name": "token","type": "address"},{"internalType": "uint256","name": "allocPoint","type": "uint256"},{"internalType": "uint256","name": "lastRewardTime","type": "uint256"},{"internalType": "uint256","name": "accWinePerShare","type": "uint256"},{"internalType": "bool","name": "isStarted","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "poolStartTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "runningTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "TOTAL_REWARDS","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalAllocPoint","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "address","name": "","type": "address"}],"name": "userInfo","outputs": [{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "uint256","name": "rewardDebt","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "wine","outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "winePerSecond","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}];

const GRAPE_VAULTS = [ "0x05E10fef2D8B9Bc9B42EC34ea9863E9764723f95", "0xe72444AB07C03a20670bADF84E85c39fe5D2233c", "0xaf2bC947d1305835CffcD1aCbcd4E11025e787E9" ];
const VAULT_ABI = [{"inputs": [{"internalType": "string","name": "_uri","type": "string"},{"internalType": "string","name": "_symbol","type": "string"},{"internalType": "uint256","name": "_unlockFee","type": "uint256"},{"internalType": "uint256","name": "_stakeAmt","type": "uint256"},{"internalType": "uint256","name": "_timelock","type": "uint256"},{"internalType": "uint256","name": "_POOL_ID","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "approved","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "operator","type": "address"},{"indexed": false,"internalType": "bool","name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "previousOwner","type": "address"},{"indexed": true,"internalType": "address","name": "newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [],"name": "LP","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "MAX_SPEED_BONUS","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "POOL_ID","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "canClaim","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "claim","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "deposit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "dev","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "enabled","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "farmPool","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "getTimeBonus","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "_address","type": "address"}],"name": "mint","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "mintMax","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "renounceOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "rewardToken","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"},{"internalType": "bytes","name": "data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "operator","type": "address"},{"internalType": "bool","name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_dev","type": "address"}],"name": "setDev","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bool","name": "_enabled","type": "bool"}],"name": "setEnabled","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_max","type": "uint256"}],"name": "setMax","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "_uri","type": "string"}],"name": "setURI","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "stableToken","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "stakeAmt","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "stakeToken","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes4","name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "timelock","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "unlock","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "unlockCost","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "unlockFee","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "uri","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "user","outputs": [{"internalType": "uint256","name": "index","type": "uint256"},{"internalType": "bool","name": "unlocked","type": "bool"},{"internalType": "uint256","name": "balance","type": "uint256"},{"internalType": "uint256","name": "timestamp","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "userCount","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "userList","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "wenClaim","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"}];

// Contract objects
var wine, grape, wavax, mim;
var vineyard;
var account;
var grapeprice;

// Templates for the page layouts and vault panels
var pageTemplate = "<div style=\"display: flex\"><div id=\"vaults-col-left\"></div><div id=\"vaults-col-right\" style=\"margin-left: 16px\"></div></div><div class=\"shadow\" style=\"position: absolute; background: #111111BA; width: 100%; top: 100%; margin: 16px 0 0 0; text-align: right; font-size: 8px;\">Aikonic NFTs Frontend v1.0</div>"
var vaultTemplate = [ "<div class=\"vaultbox\"><div style=\"display: flex\"><div class=\"vault-image\"><img id=\"",
"-nftimage\" onclick=\"showPreview('",
"')\"><div id=\"",
"-minted\" class=\"vault-image-minted\"></div><div id=\"",
"-owned\" class=\"vault-image-owned\"></div></div><div class=\"vault-info\"><div id=\"",
"-nftname\"></div><div id=\"",
"-minstake\" style=\"margin-top: 8px;\"></div><div id=\"",
"-userbal\" style=\"margin-top: 8px;\"></div><div id=\"",
"-userbonus\"></div><div id=\"",
"-timer\" style=\"margin-top: 8px;\"></div><div id=\"",
"-claimdate\"></div></div></div><hr><div style=\"width: 100%;\"><div id=\"",
"-buttons-approve\" class=\"buttonbox\" style=\"display: flex;\"><div class=\"button shadow\" style=\"width: 200px; height: 58px; line-height: 50px; font-size: 24px;\" onclick=\"approveVault('",
"')\">Approve &#127815;</div></div><div id=\"",
"-buttons-unlock\" class=\"buttonbox\" style=\"display: none; height: 76px; top: 24px;\"><div class=\"button shadow\" onclick=\"unlockVault('",
"')\">Unlock</div><div style=\"width: 100px\">Unlock Fee:</div><div id=\"",
"-unlockfee\" style=\"width: 100px\"></div></div><div id=\"",
"-buttons-transfer\" class=\"buttonbox\" style=\"display: none;\"><div style=\"display: block;\"><div class=\"button shadow\" onclick=\"depositVault('",
"')\">Deposit &#127815;</div><div class=\"button shadow\" onclick=\"withdrawVault('",
"')\">Withdraw &#127815;</div></div><div><input id=\"",
"-input\" type=\"textarea\" placeholder=\"0.00\" style=\"font-size: 16px; width: 132px; padding: 4px 8px 4px 8px; text-align: right; border-radius: 5px;\"></div><div class=\"button shadow\" onclick=\"claimVault('",
"')\">Claim NFT</div></div></div></div>" ];

var watcher = null;

// Updates the UI elements for a specific vault panel
const updateVault = async(vaultAddress) => {
	// Create a contract object for the vault
	let vault = new window.web3.eth.Contract(VAULT_ABI, vaultAddress);
	
	// Get the token object for this vault
	let tokenAddress = await vault.methods.stakeToken().call({from: account});		
	let token = new window.web3.eth.Contract(TOKEN_ABI, tokenAddress);	
	
	// Get the token symbol
	let tokenSymbol = await token.methods.symbol().call({from: account});

	// Get the number of NFTs held by the user
	let nftBalance = await vault.methods.balanceOf(account).call({from: account});
	
	// Get the fee required to unlock this vault
	let unlockFee = await vault.methods.unlockCost().call({from: account});
	
	// Get the necessary stake amount
	let stakeAmt = await vault.methods.stakeAmt().call({from: account});
	
	// Get the allowance	
	let allowance = await token.methods.allowance(account, vaultAddress).call({from: account});		
	let userInfo = await vault.methods.user(account).call({from: account});
	// See if we need to show/hide the approval button
	if(parseInt(allowance) < parseInt(stakeAmt)) {		
		// Show approval button
		$("#" + vaultAddress + "-buttons-approve").css({display: "flex"});
		$("#" + vaultAddress + "-buttons-unlock").css({display: "none"});
	} else {
		// Show unlock button
		$("#" + vaultAddress + "-buttons-approve").css({display: "none"});
		$("#" + vaultAddress + "-buttons-unlock").css({display: "flex"});
		
		// See if we need to show/hide the transfer buttons
		if(userInfo['unlocked'] === true) {
			// Show transfer buttons
			$("#" + vaultAddress + "-buttons-transfer").css({display: "flex"});
			$("#" + vaultAddress + "-buttons-unlock").css({display: "none"});
		} else {
			// Hide transfer buttons
			$("#" + vaultAddress + "-buttons-transfer").css({display: "none"});
			$("#" + vaultAddress + "-buttons-unlock").css({display: "flex"});
		}
	}
	
	// Get the amount of minted tokens and the maximum mintable amount
	let minted = parseInt(await vault.methods.totalSupply().call({from: account}));
	let maxMint = parseInt(await vault.methods.mintMax().call({from: account}));
		
	// Get the time bonus
	let bonus = await vault.methods.getTimeBonus(account).call({from: account});
	
	let epoch = await vault.methods.wenClaim(account).call({from: account});
	let timelock = await vault.methods.timelock().call({from: account});
	let dt = new Date(0);
	dt.setUTCSeconds(epoch);
	// Calculate when they can claim their NFT
	if((Date.now()/1000) >= epoch && userInfo['balance'] > 0) {
		// Ready to claim!
		$("#" + vaultAddress + "-timer").html("Time Left: None!");
		$("#" + vaultAddress + "-claimdate").html("Ready to Claim!");
	} else if((Date.now()/1000) < epoch && userInfo['balance'] > 0) {
		// They have a stake, calculate time to claim
		let diff = parseInt(epoch - (Date.now()/1000));
		let days = Math.floor(diff / (3600*24));
		diff -= days * (3600*24);
		let hrs = Math.floor(diff / 3600);
		diff -= hrs * 3600;
		let mins = Math.floor(diff / 60);
		diff -= mins*60;
		$("#" + vaultAddress + "-timer").html("Time Left: " + days.toString().padStart(2, "0") + "d:" + hrs.toString().padStart(2, "0") + "h:" + mins.toString().padStart(2, "0") + "m:" + diff.toString().padStart(2, "0") + "s");
		$("#" + vaultAddress + "-claimdate").html("Claimable on " + dt.toLocaleDateString() + "<br>at " + dt.toLocaleTimeString());
	} else {
		// No stake, display maximum time to claim
		let diff = parseInt(timelock);
		let days = Math.floor(diff / (3600*24));
		diff -= days * (3600*24);
		let hrs = Math.floor(diff / 3600);
		diff -= hrs * 3600;
		let mins = Math.floor(diff / 60);
		diff -= mins*60;
		$("#" + vaultAddress + "-timer").html("Time Left: " + days.toString().padStart(2, "0") + "d:" + hrs.toString().padStart(2, "0") + "h:" + mins.toString().padStart(2, "0") + "m:" + diff.toString().padStart(2, "0") + "s");
		$("#" + vaultAddress + "-claimdate").html("Please unlock and stake!");
	}
	
	// Load and decode the metadata
	let uri = await vault.methods.uri().call({from: account});
	let json = await fetch(uri);	
	let data = await json.json();
	
	// Update UI elements
	$("#" + vaultAddress + "-nftname").html(data['name'] + "<br>" + data['attributes'][0]['trait_type'] + ": " + data['attributes'][0]['value']);
	$("#" + vaultAddress + "-nftimage").attr("src", data['image']);
	$("#" + vaultAddress + "-nftimage").attr("title", data['description']);
	$("#" + vaultAddress + "-unlockfee").html((unlockFee / 1e18).toFixed(2) + " GRAPE");
	if(maxMint === 0) {
		$("#" + vaultAddress + "-minted").html(minted + "/&#8734; Minted");	
	} else {
		if(minted < maxMint) {		
			$("#" + vaultAddress + "-minted").html(minted + "/" + maxMint + " Minted");	
		} else {
			$("#" + vaultAddress + "-minted").html("Sold Out!");
		}
	}
	$("#" + vaultAddress + "-minstake").html("Req. Stake: " + (stakeAmt/1e18).toFixed(2) + " " + tokenSymbol);
	$("#" + vaultAddress + "-owned").html(nftBalance + " Owned");
	$("#" + vaultAddress + "-userbal").html("Staked: " + (userInfo['balance']/1e18).toFixed(2) + " " + tokenSymbol);
	$("#" + vaultAddress + "-userbonus").html("Time Bonus: " + (bonus/1e18).toFixed(2) + "x");	
}

// Update routine
const update = async(vaults) => {
	await switchNetwork(CHAIN_ID); // Make sure we're on the c-chain
	
	// Get the connected account
	await window.web3.eth.getAccounts().then(function(result) {
		account = result[0];
	});		
	document.getElementById("address").innerHTML = account.substring(0, 6)+"..."+account.substring(38, 42);
	
	// Get current grape price from the TraderJoe MIM-GRAPE LP
	let grapePrice = 0;
	await mim.methods.balanceOf(GRAPE_MIM_LP).call({from: account}).then(async(mimBal) => {
		await grape.methods.balanceOf(GRAPE_MIM_LP).call({from: account}).then(async(grapeBal) => {
			grapePrice = (mimBal/grapeBal);
			$("#grapeprice").html("1 AVAX = ~$" + (mimBal/grapeBal).toFixed(2));
		});
	});
	$("#grapeprice").html("1 GRAPE = ~$" + grapePrice.toFixed(2));
	
	// Update each vault
	for(let i = 0; i < vaults.length; i++)
		updateVault(vaults[i]);
}

const unlockVault = async(vaultAddress) => {
	let vault = new window.web3.eth.Contract(VAULT_ABI, vaultAddress);
	let f = await vault.methods.unlockCost().call({from: account});
	vault.methods.unlock(f).estimateGas({from: account}).then(async() => {
		vault.methods.unlock(f).send({from: account});
	}).catch(async(e) => {
		showError(e);
	});
}

const approveVault = async(vaultAddress) => {
	let vault = new window.web3.eth.Contract(VAULT_ABI, vaultAddress);
	let tokenAddress = await vault.methods.stakeToken().call({from: account});	
	let token = new window.web3.eth.Contract(TOKEN_ABI, tokenAddress);
	await token.methods.approve(vaultAddress, MAX_UINT).send({from: account});	
}

const depositVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	let d = $("#" + vault + "-input").val();
	
	await v.methods.deposit(BigInt(d*1e18)).estimateGas({from: account}).then(async() => {
		v.methods.deposit(BigInt(d*1e18)).send({from: account});
		$("#" + vault + "-input").val("");
	}).catch(async(e) => {		
		showError(e);
	});
}

const withdrawVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	let d = $("#" + vault + "-input").val();
	
	v.methods.withdraw().estimateGas({from: account}).then(async() => {
		v.methods.withdraw().send({from: account});
	}).catch(async(e) => {
		showError(e);
	});
}

const claimVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	v.methods.claim().estimateGas({from: account}).then(async() => {
		v.methods.claim().send({from: account});
	}).catch(async(e) => { showError(e); });
}

const showError = async(e) => {
	let error = JSON.parse(e.toString().replace("Error: Internal JSON-RPC error.", ""));
	$("#errormsg").html(error['message'].toString().replace("VM Exception while processing transaction: revert", ""));
	$("#errorbox").css({left: "-50%", top: "50%"});
	$("#errorbox").stop(true, true).animate({left : "50%"}, 1000).delay(7000).animate({top: "-50%"}, 1000);
}

const showPreview = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	await v.methods.uri().call({from: account}).then(async(uri) => {
		fetch(uri).then(async(json) => {
			json.json().then(async(data) => {
				$("#preview").html("<img src=\"" + data['image'] + "\" title=\"" + data['description'] + "\" />");
				$("#preview").fadeIn();	
			});
		});
	});
}

const hidePanels = async() => {
	$(document).mouseup(function (e) {
		if ($(e.target).closest("#preview").length
					=== 0) {
			$("#preview").fadeOut();
		}		
	});
}

const createVaultPanel = function(vaultName, colIdx) {
	console.log("Creating panel for vault " + vaultName + "...");
	let vault = "";
	for(i = 0; i < vaultTemplate.length; i++) {
		vault += vaultTemplate[i];
		if(i < vaultTemplate.length-1)
			vault += vaultName;
	}
	if(colIdx === 0) {
		$("#vaults-col-left").html($("#vaults-col-left").html() + vault);	
	} else {
		$("#vaults-col-right").html($("#vaults-col-right").html() + vault);	
	}	
}

const createPage = async(vaults) => {
	clearInterval(watcher);
	console.log("Generating page...");
	$("#vault-page").html(pageTemplate);
	for(let i = 0; i < GRAPE_VAULTS.length; i++) {		
		createVaultPanel(GRAPE_VAULTS[i], i % 2);
	}
	
	wine = new window.web3.eth.Contract(TOKEN_ABI, WINE_TOKEN);
	grape = new window.web3.eth.Contract(TOKEN_ABI, GRAPE_TOKEN);		
	mim = new window.web3.eth.Contract(TOKEN_ABI, MIM_TOKEN);
	vineyard = new window.web3.eth.Contract(VINEYARD_ABI, VINEYARD);
	
	update(GRAPE_VAULTS);
	watcher = setInterval(async() => {
		update(GRAPE_VAULTS);			
	}, 5000);
}

$(document).ready(async() => {
	if(await Web3Enabled()) { // Initialize web3 and connected to metamask				
		createPage(GRAPE_VAULTS);
	}

	$("#button-connect").click(Web3Enabled);	
});