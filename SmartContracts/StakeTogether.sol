// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StakeTogether
 * @notice Users stake CloudCoin and earn proportional rewards.
 * @dev Staking timer starts ONLY when the reward pool is funded.
 */
contract StakeTogether is ReentrancyGuard {

    // ── State Variables ─────────────────────────────────────────────────────

    IERC20 public immutable cloudCoin;   
    address public immutable owner;      

    uint256 public constant REWARD_POOL = 1_000_000 * 10 ** 18; 
    uint256 public constant STAKING_DURATION = 60 minutes;           

    uint256 public stakingEndTime;    
    uint256 public totalStaked;       

    bool public rewardPoolFunded;     

    mapping(address => uint256) public stakes;
    mapping(address => bool) public hasClaimed;

    address public topStaker;
    uint256 public topStakeAmount;

    // ── Events ───────────────────────────────────────────────────────────────

    event Staked(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 reward);
    event RewardPoolFunded(uint256 amount);

    // ── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier stakingOpen() {
        require(rewardPoolFunded, "Pool not funded");
        require(block.timestamp < stakingEndTime, "Staking period ended");
        _;
    }

    modifier stakingClosed() {
        require(rewardPoolFunded, "Pool not funded");
        require(block.timestamp >= stakingEndTime, "Staking still open");
        _;
    }

    // ── Constructor ──────────────────────────────────────────────────────────

    constructor(address _cloudCoinAddress, address _owner) {
        require(_cloudCoinAddress != address(0), "Invalid token address");
        require(_owner != address(0), "Invalid owner address");
        cloudCoin = IERC20(_cloudCoinAddress);
        owner = _owner;
        // Timer does NOT start yet
    }

    // ── Owner Functions ──────────────────────────────────────────────────────

    function fundRewardPool() external onlyOwner {
        require(!rewardPoolFunded, "Already funded");
        rewardPoolFunded = true;
        
        // START THE TIMER NOW
        stakingEndTime = block.timestamp + STAKING_DURATION;

        bool success = cloudCoin.transferFrom(msg.sender, address(this), REWARD_POOL);
        require(success, "Funding failed");

        emit RewardPoolFunded(REWARD_POOL);
    }

    // ── User Functions ───────────────────────────────────────────────────────

    function stake(uint256 amount) external nonReentrant stakingOpen {
        require(amount > 0, "Cannot stake 0");

        bool success = cloudCoin.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        stakes[msg.sender] += amount;
        totalStaked += amount;

        if (stakes[msg.sender] > topStakeAmount) {
            topStaker = msg.sender;
            topStakeAmount = stakes[msg.sender];
        }

        emit Staked(msg.sender, amount);
    }

    function claim() external nonReentrant stakingClosed {
        uint256 userStake = stakes[msg.sender];
        require(userStake > 0, "Nothing staked");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(totalStaked > 0, "No total stake");

        hasClaimed[msg.sender] = true;
        stakes[msg.sender] = 0;

        uint256 reward = (userStake * REWARD_POOL) / totalStaked;
        uint256 payout = userStake + reward;

        bool success = cloudCoin.transfer(msg.sender, payout);
        require(success, "Payout transfer failed");

        emit Claimed(msg.sender, reward);
    }

    // ── View Functions ────────────────────────────────────────────────────────

    function previewReward(address user) external view returns (uint256) {
        if (totalStaked == 0 || stakes[user] == 0) return 0;
        return (stakes[user] * REWARD_POOL) / totalStaked;
    }

    function isStakingOpen() external view returns (bool) {
        return rewardPoolFunded && block.timestamp < stakingEndTime;
    }

    function timeRemaining() external view returns (uint256) {
        if (!rewardPoolFunded) return STAKING_DURATION;
        if (block.timestamp >= stakingEndTime) return 0;
        return stakingEndTime - block.timestamp;
    }

    function getLeaderboard() external view returns (address, uint256) {
        return (topStaker, topStakeAmount);
    }
}
