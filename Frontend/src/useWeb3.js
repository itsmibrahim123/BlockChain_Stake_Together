import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { USE_MOCK_DATA as INITIAL_MOCK, CONTRACT_ADDRESSES, STAKE_TOGETHER_ABI, CLOUD_COIN_ABI, STAKING_DURATION } from './constants';

export const useWeb3 = () => {
  const [useMock, setUseMock] = useState(INITIAL_MOCK);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [stakedAmount, setStakedAmount] = useState('0');
  const [totalStaked, setTotalStaked] = useState('0');
  const [reward, setReward] = useState('0');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [topStaker, setTopStaker] = useState({ address: '0x0', amount: '0' });
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');

  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

  const connectWallet = async () => {
    if (useMock) {
      const mockAccounts = ['0xDEADBEEF...C0DE', '0x71A4...B3E1', '0x1234...5678'];
      const nextIndex = (mockAccounts.indexOf(account) + 1) % mockAccounts.length;
      setAccount(mockAccounts[nextIndex]);
      setBalance((Math.random() * 10000).toFixed(2));
      return;
    }

    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== SEPOLIA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: { name: 'SepoliaETH', symbol: 'SepoliaETH', decimals: 18 },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                }],
              });
            } else {
              throw switchError;
            }
          }
        }

        const _provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await _provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setProvider(_provider);
      } catch (err) {
        console.error("Connection failed", err);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  const toggleMock = () => {
    setUseMock(!useMock);
    setAccount(null); // Reset connection on mode toggle
  };

  const [isRewardPoolFunded, setIsRewardPoolFunded] = useState(false);

  const fetchData = useCallback(async () => {
    if (useMock) {
      setTotalStaked((prev) => (parseFloat(prev) + Math.random() * 0.1).toFixed(4));
      setTimeRemaining((prev) => Math.max(0, prev > 0 ? prev - 1 : STAKING_DURATION));
      setTopStaker({ address: '0x71...A4', amount: '8500' });
      setIsRewardPoolFunded(true);
      return;
    }

    if (!account || !provider) return;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.STAKE_TOGETHER, STAKE_TOGETHER_ABI, provider);
      const token = new ethers.Contract(CONTRACT_ADDRESSES.CLOUD_COIN, CLOUD_COIN_ABI, provider);

      // Fetch basic token balance first
      try {
        const bal = await token.balanceOf(account);
        setBalance(ethers.formatEther(bal));
      } catch (e) { console.error("Error fetching balance", e); }

      // Fetch StakeTogether data individually to prevent one failure from stopping others
      try {
        const staked = await contract.stakes(account);
        setStakedAmount(ethers.formatEther(staked));
      } catch (e) { console.error("Error fetching stake", e); }

      try {
        const total = await contract.totalStaked();
        setTotalStaked(ethers.formatEther(total));
      } catch (e) { console.error("Error fetching total staked", e); }

      try {
        const rem = await contract.timeRemaining();
        setTimeRemaining(Number(rem));
      } catch (e) { console.error("Error fetching time", e); }

      try {
        const lb = await contract.getLeaderboard();
        setTopStaker({ address: lb[0], amount: ethers.formatEther(lb[1]) });
      } catch (e) { console.error("Error fetching leaderboard", e); }

      try {
        const funded = await contract.rewardPoolFunded();
        setIsRewardPoolFunded(funded);
      } catch (e) { console.error("Error fetching funding status", e); }

      try {
        const preview = await contract.previewReward(account);
        setReward(ethers.formatEther(preview));
      } catch (e) { console.error("Error fetching preview", e); }

    } catch (err) {
      console.error("Critical error in fetchData", err);
    }
  }, [account, provider, useMock]);

  const fundRewardPool = async () => {
    setLoading(true);
    if (useMock) {
      await new Promise(r => setTimeout(r, 2000));
      setIsRewardPoolFunded(true);
      setLoading(false);
      return true;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.STAKE_TOGETHER, STAKE_TOGETHER_ABI, signer);
      const token = new ethers.Contract(CONTRACT_ADDRESSES.CLOUD_COIN, CLOUD_COIN_ABI, signer);
      
      const amount = "1000000000000000000000000"; // 1M CC
      
      // Transaction 1: Approve
      const txApprove = await token.approve(CONTRACT_ADDRESSES.STAKE_TOGETHER, amount);
      await txApprove.wait();
      
      // Transaction 2: Fund
      const txFund = await contract.fundRewardPool();
      await txFund.wait();
      
      fetchData();
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Funding failed", err);
      setLoading(false);
      return false;
    }
  };

  const stake = async (amount) => {
    setLoading(true);
    if (useMock) {
      await new Promise(r => setTimeout(r, 2000));
      setStakedAmount(prev => (parseFloat(prev) + parseFloat(amount)).toFixed(2));
      setBalance(prev => (parseFloat(prev) - parseFloat(amount)).toFixed(2));
      setLoading(false);
      return true;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.STAKE_TOGETHER, STAKE_TOGETHER_ABI, signer);
      const token = new ethers.Contract(CONTRACT_ADDRESSES.CLOUD_COIN, CLOUD_COIN_ABI, signer);
      
      const parsedAmount = ethers.parseEther(amount);
      const txApprove = await token.approve(CONTRACT_ADDRESSES.STAKE_TOGETHER, parsedAmount);
      await txApprove.wait();
      
      const tx = await contract.stake(parsedAmount);
      await tx.wait();
      fetchData();
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Staking failed", err);
      setLoading(false);
      return false;
    }
  };

  const claim = async () => {
    setLoading(true);
    if (useMock) {
      await new Promise(r => setTimeout(r, 2000));
      setBalance(prev => (parseFloat(prev) + parseFloat(stakedAmount) + parseFloat(reward)).toFixed(2));
      setStakedAmount('0');
      setReward('0');
      setLoading(false);
      return true;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESSES.STAKE_TOGETHER, STAKE_TOGETHER_ABI, signer);
      const tx = await contract.claim();
      await tx.wait();
      fetchData();
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Claim failed", err);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (useMock) {
      setStakedAmount('120');
      setReward('5.4');
      setTimeRemaining(600);
    }
  }, [useMock]);

  useEffect(() => {
    const interval = setInterval(fetchData, useMock ? 3000 : 15000);
    return () => clearInterval(interval);
  }, [fetchData, useMock]);

  useEffect(() => {
    if (parseFloat(stakedAmount) > 0) {
      const ticker = setInterval(() => {
        setReward(prev => (parseFloat(prev) + 0.0001).toFixed(6));
      }, 1000);
      return () => clearInterval(ticker);
    }
  }, [stakedAmount]);

  // Listen for account changes in live mode
  useEffect(() => {
    if (window.ethereum && !useMock) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, [useMock]);

  return {
    account,
    connectWallet,
    disconnectWallet,
    useMock,
    toggleMock,
    stakedAmount,
    totalStaked,
    reward,
    timeRemaining,
    topStaker,
    loading,
    balance,
    isRewardPoolFunded,
    fundRewardPool,
    stake,
    claim
  };
};
