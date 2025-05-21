
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return "₹0.00";

  // Handle values below 1
  if (Math.abs(amount) < 1) {
    return `₹${amount.toFixed(2)}`;
  }

  // Format with Indian number system (special handling for decimals)
  const absAmount = Math.abs(amount);
  let formattedNumber = "";
  
  // Extract integer and decimal parts
  const integerPart = Math.floor(absAmount);
  const decimalPart = Math.round((absAmount - integerPart) * 100) / 100;
  
  // Format integer part with commas
  const intStr = integerPart.toString();
  let result = "";
  
  // Add first 3 digits
  const mod = intStr.length % 3;
  if (mod !== 0) {
    result += intStr.substring(0, mod);
    if (intStr.length > mod) result += ",";
  }
  
  // Add the rest with commas after every 2 digits
  for (let i = mod; i < intStr.length; i += 2) {
    result += intStr.substring(i, Math.min(i + 2, intStr.length));
    if (i + 2 < intStr.length) result += ",";
  }
  
  // Add decimal part
  const decimalStr = decimalPart.toFixed(2).substring(2);
  if (decimalStr !== "00") {
    result += "." + decimalStr;
  }
  
  formattedNumber = result;
  
  // Add negative sign if needed
  return `₹${amount < 0 ? "-" : ""}${formattedNumber}`;
};

export const formatPercentage = (num: number): string => {
  if (Math.abs(num) < 0.01) return "0.00%";
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
};

export const formatNumber = (num: number): string => {
  if (Math.abs(num) < 0.00001) return "0.00";
  
  // For very small numbers, use scientific notation
  if (Math.abs(num) < 0.001) {
    return num.toExponential(2);
  }
  
  // For small numbers, show more decimals
  if (Math.abs(num) < 1) {
    return num.toFixed(5);
  }
  
  // For larger numbers
  return num.toLocaleString("en-IN", { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};

export const getGainClass = (gain: number): string => {
  if (gain === 0) return "";
  return gain > 0 ? "gain-positive" : "gain-negative";
};
