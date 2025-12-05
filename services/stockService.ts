export interface StockData {
  symbol: string;
  price: number;
  change: number; // Percentage
  name: string;
}

// CoinGecko is free and requires no key for simple price data
const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";

export const fetchMarketData = async (): Promise<StockData[]> => {
  const items: StockData[] = [];

  try {
    // 1. Fetch Real Crypto Data
    const response = await fetch(COINGECKO_URL);
    if (response.ok) {
        const data = await response.json();
        if (data.bitcoin) items.push({ symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change });
        if (data.ethereum) items.push({ symbol: 'ETH', name: 'Ethereum', price: data.ethereum.usd, change: data.ethereum.usd_24h_change });
        if (data.solana) items.push({ symbol: 'SOL', name: 'Solana', price: data.solana.usd, change: data.solana.usd_24h_change });
    }
  } catch (e) {
    console.error("Crypto fetch failed", e);
  }

  // 2. Add Simulated Stock Data (Since real-time Stock APIs usually need keys/CORS proxies)
  // We simulate "live" movement for the demo feel
  const baseStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 173.50 },
      { symbol: 'TSLA', name: 'Tesla', basePrice: 205.60 },
      { symbol: 'NVDA', name: 'NVIDIA', basePrice: 875.20 },
  ];

  baseStocks.forEach(stock => {
      const volatility = (Math.random() * 2 - 1) * 1.5; // Random move between -1.5% and +1.5%
      items.push({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.basePrice + (Math.random() * 5),
          change: volatility
      });
  });

  return items;
};