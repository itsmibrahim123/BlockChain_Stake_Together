export const USE_MOCK_DATA = false;

export const CONTRACT_ADDRESSES = {
  STAKE_TOGETHER: "0xC9434792A3903879f17c21396a1e1DdFf8081479", 
  CLOUD_COIN: "0xbCbb40382CF66b5e76CbF87B08D8DE4E5941Ae12", 
};

export const STAKE_TOGETHER_ABI = [
  "function stake(uint256 amount) external",
  "function claim() external",
  "function fundRewardPool() external",
  "function previewReward(address user) external view returns (uint256)",
  "function timeRemaining() external view returns (uint256)",
  "function getLeaderboard() external view returns (address, uint256)",
  "function stakingEndTime() external view returns (uint256)",
  "function totalStaked() external view returns (uint256)",
  "function rewardPoolFunded() external view returns (bool)",
  "function cloudCoin() external view returns (address)",
  "function stakes(address) view returns (uint256)",
  "function hasClaimed(address) view returns (bool)",
  "event Staked(address indexed user, uint256 amount)",
  "event Claimed(address indexed user, uint256 reward)",
  "event RewardPoolFunded(uint256 amount)",
];

export const REWARD_POOL_AMOUNT = "1000000000000000000000000"; // 1M CC

export const CLOUD_COIN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
];

export const RANKS = [
  { name: "Recruit Staker", min: 0, max: 750 },
  { name: "Cyber Scavenger", min: 751, max: 1500 },
  { name: "Neon Architect", min: 1501, max: 2250 },
  { name: "Grid Runner", min: 2251, max: 3000 },
  { name: "Quantum Miner", min: 3001, max: 3750 },
  { name: "Circuit Breaker", min: 3751, max: 4500 },
  { name: "Void Merchant", min: 4501, max: 5250 },
  { name: "Nexus Megalodon", min: 5251, max: 6000 },
  { name: "Data Overlord", min: 6001, max: Infinity },
];

export const STAKING_DURATION = 60 * 60; // 1 hour in seconds
