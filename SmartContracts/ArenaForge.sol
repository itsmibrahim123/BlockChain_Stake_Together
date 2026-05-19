// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StakeTogether.sol";

/**
 * @title ArenaForge
 * @notice Automated factory to deploy new StakeTogether arenas.
 */
contract ArenaForge {
    address public immutable cloudCoinAddress;
    address[] public allArenas;

    event ArenaForged(address indexed arenaAddress, address indexed creator);

    constructor(address _cloudCoin) {
        require(_cloudCoin != address(0), "Invalid token address");
        cloudCoinAddress = _cloudCoin;
    }

    /**
     * @notice Deploys a new StakeTogether contract.
     * @dev The caller becomes the owner of the new arena.
     */
    function forgeNewArena() external returns (address) {
        // Pass both the token address and the creator (msg.sender) as the owner
        StakeTogether newArena = new StakeTogether(cloudCoinAddress, msg.sender);
        
        allArenas.push(address(newArena));
        emit ArenaForged(address(newArena), msg.sender);
        return address(newArena);
    }

    function getArenas() external view returns (address[] memory) {
        return allArenas;
    }

    function getArenaCount() external view returns (uint256) {
        return allArenas.length;
    }
}
