// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestGrape is ERC20 {
    constructor(uint mint) ERC20("Test GRAPE", "TGRAPE") {
        _mint(msg.sender, mint);
    }
}