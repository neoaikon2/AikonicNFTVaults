const CHAIN_ID = 5777;//43114;
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

const WINE_TOKEN = "0x06d45bf7d8b19C31c62bC566159331cEFc27b1B8";
const GRAPE_TOKEN = "0x1e553939Eb3611EabbCa534c78AEc3C821464fad";
const WAVAX_TOKEN = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
const MIM_TOKEN = "0x130966628846BFd36ff31a822705796e8cb8C18D";
const TOKEN_ABI = [{"inputs": [{"internalType": "uint256","name": "initialSupply","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "spender","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": false,"internalType": "uint256","name": "value","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "spender","type": "address"}],"name": "allowance","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "approve","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "decimals","outputs": [{"internalType": "uint8","name": "","type": "uint8"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "subtractedValue","type": "uint256"}],"name": "decreaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "addedValue","type": "uint256"}],"name": "increaseAllowance","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalSupply","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transfer","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "transferFrom","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "nonpayable","type": "function"}];

const WAVAX_MIM_LP = "0x781655d802670bbA3c89aeBaaEa59D3182fD755D";

const VINEYARD = "0xb9B7A028288B5FA91b2eB1C651Bf99CC62561BC3";
const VINEYARD_ABI = [{"inputs": [{"internalType": "uint256","name": "_allocPoint","type": "uint256"},{"internalType": "contract IERC20","name": "_token","type": "address"},{"internalType": "bool","name": "_withUpdate","type": "bool"},{"internalType": "uint256","name": "_lastRewardTime","type": "uint256"}],"name": "add","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "deposit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"}],"name": "emergencyWithdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_wine","type": "address"},{"internalType": "uint256","name": "_poolStartTime","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Deposit","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "EmergencyWithdraw","type": "event"},{"inputs": [{"internalType": "contract IERC20","name": "_token","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "address","name": "to","type": "address"}],"name": "governanceRecoverUnsupported","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "massUpdatePools","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "RewardPaid","type": "event"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_allocPoint","type": "uint256"}],"name": "set","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_operator","type": "address"}],"name": "setOperator","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"}],"name": "updatePool","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "uint256","name": "_amount","type": "uint256"}],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "user","type": "address"},{"indexed": true,"internalType": "uint256","name": "pid","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [{"internalType": "uint256","name": "_fromTime","type": "uint256"},{"internalType": "uint256","name": "_toTime","type": "uint256"}],"name": "getGeneratedReward","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "operator","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "_pid","type": "uint256"},{"internalType": "address","name": "_user","type": "address"}],"name": "pendingShare","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "poolEndTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "poolInfo","outputs": [{"internalType": "contract IERC20","name": "token","type": "address"},{"internalType": "uint256","name": "allocPoint","type": "uint256"},{"internalType": "uint256","name": "lastRewardTime","type": "uint256"},{"internalType": "uint256","name": "accWinePerShare","type": "uint256"},{"internalType": "bool","name": "isStarted","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "poolStartTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "runningTime","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "TOTAL_REWARDS","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "totalAllocPoint","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "address","name": "","type": "address"}],"name": "userInfo","outputs": [{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "uint256","name": "rewardDebt","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "wine","outputs": [{"internalType": "contract IERC20","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "winePerSecond","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}];

const VAULT = "0x46B668A2E4200f5ae4D1e3Ff01366E359CF6Ef5c";
const VAULT_ABI = [{"inputs": [{"internalType": "string","name": "_uri","type": "string"},{"internalType": "uint256","name": "_pool_id","type": "uint256"}],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "approved","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Approval","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "owner","type": "address"},{"indexed": true,"internalType": "address","name": "operator","type": "address"},{"indexed": false,"internalType": "bool","name": "approved","type": "bool"}],"name": "ApprovalForAll","type": "event"},{"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "approve","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "claim","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "deposit","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "reqDep","type": "uint256"}],"name": "initStakeAmount","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "_timelock","type": "uint256"}],"name": "initTimelock","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "fee","type": "uint256"}],"name": "initUnlockFee","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "_address","type": "address"}],"name": "mint","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "previousOwner","type": "address"},{"indexed": true,"internalType": "address","name": "newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"inputs": [],"name": "renounceOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"},{"internalType": "bytes","name": "data","type": "bytes"}],"name": "safeTransferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "operator","type": "address"},{"internalType": "bool","name": "approved","type": "bool"}],"name": "setApprovalForAll","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bool","name": "_enabled","type": "bool"}],"name": "setEnabled","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "string","name": "_uri","type": "string"}],"name": "setURI","outputs": [],"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "from","type": "address"},{"indexed": true,"internalType": "address","name": "to","type": "address"},{"indexed": true,"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "Transfer","type": "event"},{"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "transferFrom","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "unlock","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "withdraw","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [],"name": "withdrawWine","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "canClaim","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "enabled","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "getApproved","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "getTimeBonus","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "owner","type": "address"},{"internalType": "address","name": "operator","type": "address"}],"name": "isApprovedForAll","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "joeLP","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "MAX_SPEED_BONUS","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "mim","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "name","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "owner","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "ownerOf","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "pool_id","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "stakeAmt","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "stakeToken","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes4","name": "interfaceId","type": "bytes4"}],"name": "supportsInterface","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "symbol","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "timelock","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "tokenId","type": "uint256"}],"name": "tokenURI","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "unlockAvax","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "unlockFee","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "uri","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "user","outputs": [{"internalType": "uint256","name": "index","type": "uint256"},{"internalType": "bool","name": "unlocked","type": "bool"},{"internalType": "uint256","name": "balance","type": "uint256"},{"internalType": "uint256","name": "timestamp","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "userCount","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "userList","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "vineyard","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "wavax","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "wenClaim","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "wine","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"}];

var wine, grape, wavax, mim;
var vineyard;
var account;
var avaxprice;

const updateVault = async(v) => {
	let vault = new window.web3.eth.Contract(VAULT_ABI, v);
	
	await vault.methods.stakeAmt().call({from: account}).then(async(amt) => {
		$("#" + v + "-minstake").html("Minimum Stake: " + (amt/1e18).toFixed(2) + " GRAPE");
	});
	
	await vault.methods.user(account).call({from: account}).then(async(userInfo) => {
		if(userInfo['unlocked'] == true) {
			$("#" + v + "-buttons-all").css({display: "flex"});
			$("#" + v + "-buttons-unlock").css({display: "none"});
		} else {
			$("#" + v + "-buttons-all").css({display: "none"});
			$("#" + v + "-buttons-unlock").css({display: "flex"});
		}
		
		$("#" + v + "-userbal").html("Staked: " + (userInfo['balance']/1e18).toFixed(2) + " GRAPE");
		
		await vault.methods.getTimeBonus(account).call({from: account}).then(async(bonus) => {
			$("#" + v + "-userbonus").html("Time Bonus: " + (bonus/1e18).toFixed(2) + "x");
		});
		
		await vault.methods.wenClaim(account).call({from: account}).then(async(epoch) => {
			let dt = new Date(0);
			dt.setUTCSeconds(epoch);
			
			if((Date.now()/1000) >= epoch && userInfo['balance'] > 0) {
				$("#" + v + "-timer").html("Time Left: None!");
				$("#" + v + "-claimdate").html("Ready to Claim!");
			} else if((Date.now()/1000) < epoch && userInfo['balance'] > 0) {
				let diff = parseInt(epoch - (Date.now()/1000));
				let days = Math.floor(diff / (3600*24));
				diff -= days * (3600*24);
				let hrs = Math.floor(diff / 3600);
				diff -= hrs * 3600;
				let mins = Math.floor(diff / 60);
				diff -= mins*60;
				$("#" + v + "-timer").html("Time Left: " + days.toString().padStart(2, "0") + "d:" + hrs.toString().padStart(2, "0") + "h:" + mins.toString().padStart(2, "0") + "m:" + diff.toString().padStart(2, "0") + "s");
				$("#" + v + "-claimdate").html("Claimable on " + dt.toLocaleDateString() + "<br>at " + dt.toLocaleTimeString());
			} else {
				$("#" + v + "-timer").html("Time Left: ??d:??h:??m:??s");
				$("#" + v + "-claimdate").html("Please unlock and stake!");
			}
		});	
	});
	
	await vault.methods.unlockAvax().call({from: account}).then(async(unlockFee) => {
		console.log(unlockFee);
		$("#" + v + "-unlockfee").html((unlockFee / 1e18).toFixed(2) + " AVAX");
	});
	
	await vault.methods.uri().call({from: account}).then(async(uri) => {
		fetch(uri).then(async(json) => {
			json.json().then(async(data) => {
				$("#" + v + "-nftname").html(data['name']);
				$("#" + v + "-nftimage").attr("src", data['image']);
				$("#" + v + "-nftimage").attr("title", data['description']);
			});
		});
	});
}

const update = async() => {
	await switchNetwork(CHAIN_ID); // Make sure we're on the c-chain
	
	// Get the connected account
	await window.web3.eth.getAccounts().then(function(result) {
		account = result[0];
	});		
	document.getElementById("address").innerHTML = account.substring(0, 6)+"..."+account.substring(38, 42);
	
	await wine.methods.balanceOf(VINEYARD).call({from: account}).then(function(bal) {
		console.log(bal);
	});
	
	/* UNCOMMENT ON MAINNET
	await mim.methods.balanceOf(WAVAX_MIM_LP).call({from: account}).then(async(mimBal) => {
		await wavax.methods.balanceOf(WAVAX_MIM_LP).call({from: account}).then(async(wavaxBal) => {
			$("#avaxprice").html("1 AVAX = ~$" + (mimBal/wavaxBal).toFixed(2));
		});
	});*/
	$("#avaxprice").html("1 AVAX = ~$" + (17.766771).toFixed(2));
	
	await updateVault(VAULT);
	await updateVault("0x609Aa111cb9bcd3e94fF1b05a7c28985403297e7");
}

const main = async () => {
	if(await Web3Enabled()) { // Initialize web3 and connected to metamask		
		wine = new window.web3.eth.Contract(TOKEN_ABI, WINE_TOKEN);
		grape = new window.web3.eth.Contract(TOKEN_ABI, GRAPE_TOKEN);
		wavax = new window.web3.eth.Contract(TOKEN_ABI, WAVAX_TOKEN);
		mim = new window.web3.eth.Contract(TOKEN_ABI, MIM_TOKEN);
		vineyard = new window.web3.eth.Contract(VINEYARD_ABI, VINEYARD);
		vault = new window.web3.eth.Contract(VAULT_ABI, VAULT);
		
		update();
		setInterval(async() => {
			update();			
		}, 5000);
	}
}

const unlockVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	let f = await v.methods.unlockAvax().call({from: account});
	v.methods.unlock().send({from: account, value: f});
}

const depositVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	let d = $("#" + vault + "-input").val();
	console.log(BigInt(d) * BigInt(1e18));
	await v.methods.deposit(BigInt(d) * BigInt(1e18)).estimateGas({from: account}).then(async() => {
		v.methods.deposit(BigInt(d) * BigInt(1e18)).send({from: account});
	}).catch(async(e) => {
		console.log(e);
		showError(e);
	});
}

const withdrawVault = async(vault) => {
	let v = new window.web3.eth.Contract(VAULT_ABI, vault);
	let d = $("#" + vault + "-input").val();
	console.log(BigInt(d) * BigInt(1e18));
	v.methods.withdraw().send({from: account}).catch(function(e) {
		console.log(e);
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

var test_vault = '<div class="vaultbox"><div style="display: flex"><div class="vault-image"><img id="vault-test2" src="bg.png" /></div><div class="vault-info" ><div>Aikonic NFT Name</div><hr><div>Unlocked? Yes</div><div>Minimum Stake: 15 GRAPE</div><div>Staked: 150 GRAPE</div><div>Time Bonus: 2x</div><div>NFT Timer: 12d:18h:36m:54s</div><div>Claimable on: 10/18/2022</div><hr></div></div><div style="width: 100%; height: 48px;" ><div class="buttonbox"><div class="button">Deposit</div><div class="button">Withdraw</div><div class="button">Claim NFT</div></div></div></div>'
var vaultLayout = [ "<div class=\"vaultbox\"><div style=\"display: flex\"><div class=\"vault-image\"><img id=\"",
"-nftimage\" onclick=\"showPreview('",
"')\" src=\"bg.png\" /></div><div class=\"vault-info\" ><div id=\"",
"-nftname\">Aikonic NFT Name</div><hr><div id=\"",
"-minstake\">Minimum Stake: 15 GRAPE</div><div id=\"",
"-userbal\">Staked: 150 GRAPE</div><div id=\"",
"-userbonus\">Time Bonus: 2x</div><div id=\"",
"-timer\">NFT Timer: 12d:18h:36m:54s</div><div id=\"",
"-claimdate\">Claimable on: 10/18/2022</div><hr></div></div><div style=\"width: 100%; height: 96px;\" ><div id=\"",
"-buttons-unlock\" class=\"buttonbox\"><div class=\"button shadow\" onclick=\"unlockVault('",
"')\" >Unlock</div><div style=\"width: 100px\">Unlock Fee:</div><div id=\"",
"-unlockfee\" style=\"width: 100px\"> .33 AVAX</div></div><div id=\"",
"-buttons-all\" class=\"buttonbox\" style=\"display: none;\"><div><div class=\"button shadow\" onclick=\"depositVault('",
"')\">Deposit &#127815;</div><div class=\"button shadow\" onclick=\"withdrawVault('",
"')\">Withdraw &#127815;</div></div><div><input id=\"",
"-input\" type=\"textarea\" placeholder=\"0.00\" style=\"font-size: 16px; width: 132px; padding: 4px 8px 4px 8px; text-align: right; border-radius: 5px;\" /></div><div class=\"button shadow\" onclick=\"claimVault('",
"')\">Claim NFT</div></div></div></div>" ];

const createVaultPanel = function(vaultName, colIdx) {
	let vault = "";
	for(i = 0; i < vaultLayout.length; i++) {
		vault += vaultLayout[i];
		if(i < vaultLayout.length-1)
			vault += vaultName;
	}
	if(colIdx === 0) {
		$("#vaults-col-left").html($("#vaults-col-left").html() + vault);	
	} else {
		$("#vaults-col-right").html($("#vaults-col-right").html() + vault);	
	}	
}

$(document).ready(function() {
/*	$("#btnClaim").click(quantumClaim);
	$("#btnAllowance").click(allowance);
	$("#btnShowWithdraw").click(showWithdrawPanel);
	$("#btnShowDeposit").click(showDepositPanel);
	$("#btnPerDiem").click(requestPerDiem);
	*/
	//$("#vaults-col-right").html($("#vaults-col-right").html() + test_vault);	
	//$("#vault-test2").click({ img: "bg.png" }, showPreview);
	//for(i = 0; i < 2; i++) {
	//	createVaultPanel(i.toString(), i % 2);
	//}	
	createVaultPanel(VAULT, 0);
	createVaultPanel("0x609Aa111cb9bcd3e94fF1b05a7c28985403297e7", 1);
	main();
	$("#button-connect").click(main);	
});