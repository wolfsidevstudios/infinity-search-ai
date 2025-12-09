
export interface GasPrice {
  currency: string;
  name: string; // State name
  gasoline: string; // Regular
  midGrade: string;
  premium: string;
  diesel: string;
}

const MOCK_GAS_DATA: GasPrice[] = [
    { currency: 'usd', name: 'National Avg', gasoline: '3.54', midGrade: '3.98', premium: '4.32', diesel: '4.05' },
    { currency: 'usd', name: 'California', gasoline: '4.89', midGrade: '5.12', premium: '5.35', diesel: '5.20' },
    { currency: 'usd', name: 'Texas', gasoline: '3.12', midGrade: '3.45', premium: '3.78', diesel: '3.55' },
    { currency: 'usd', name: 'New York', gasoline: '3.65', midGrade: '4.10', premium: '4.45', diesel: '4.25' },
    { currency: 'usd', name: 'Florida', gasoline: '3.45', midGrade: '3.85', premium: '4.15', diesel: '3.90' },
];

export const fetchGasPrices = async (): Promise<GasPrice[]> => {
  try {
    // Note: CollectAPI requires a paid key sent in headers. 
    // const response = await fetch('https://api.collectapi.com/gasPrice/allUsaPrice', {
    //     headers: { 'content-type': 'application/json', 'authorization': 'apikey YOUR_KEY_HERE' }
    // });
    
    // Simulating API call for demonstration as specific key was not provided in prompt context
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation with key:
    // if (response.ok) { const data = await response.json(); return data.result; }

    return MOCK_GAS_DATA;
  } catch (error) {
    console.error("Gas Price API Error:", error);
    return MOCK_GAS_DATA;
  }
};
