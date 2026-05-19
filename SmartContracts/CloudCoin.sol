// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin gives us a safe, tested ERC20 base. Never write ERC20 from scratch.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CloudCoin (CC)
 * @notice Simple ERC20 token used for staking in Stake Together.
 * @dev We mint all supply to the deployer (owner) on creation.
 *      Owner can mint more later (e.g., to fund reward pool).
 */
contract CloudCoin is ERC20, Ownable {

    /**
     * @dev Constructor runs ONCE when you deploy. It:
     *  1. Names the token "CloudCoin" with symbol "CC"
     *  2. Sets msg.sender (you) as owner
     *  3. Mints 10,000,000 CC to your wallet
     *
     * 18 decimals is the ERC20 standard — so 1 CC = 1 * 10^18 units internally.
     * When you type 1000000 * 10**18, that means 1,000,000 full tokens.
     */
    constructor() ERC20("CloudCoin", "CC") Ownable(msg.sender) {
        // Mint 10 million CC to the deployer wallet
        _mint(msg.sender, 10_000_000 * 10 ** decimals());
    }

    /**
     * @notice Owner can mint more tokens anytime (useful for testing).
     * @param to    The wallet address to receive the new tokens
     * @param amount How many tokens (in wei units, so multiply by 10^18 off-chain)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}