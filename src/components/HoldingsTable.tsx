
import { Holding } from "@/types";
import { formatCurrency, formatNumber, getGainClass } from "@/utils/formatter";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface HoldingsTableProps {
  holdings: Holding[];
  onSelectHolding: (index: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

const HoldingsTable = ({ 
  holdings,
  onSelectHolding,
  onSelectAll
}: HoldingsTableProps) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    onSelectAll(checked);
  };

  const handleSelect = (index: number, checked: boolean) => {
    onSelectHolding(index, checked);
    
    // Update selectAll state
    const allSelected = holdings.every((_, i) => 
      i === index ? checked : holdings[i].isSelected
    );
    setSelectAll(allSelected);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900/50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left">
              <Checkbox 
                id="selectAll" 
                checked={selectAll}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)} 
              />
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Asset
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Holdings<br />
              <span className="font-normal text-gray-400">Avg Buy Price</span>
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Current Price
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Short-Term Gain
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Long-Term Gain
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Amount to Sell
            </th>
          </tr>
        </thead>
        <tbody className="bg-koinx-dark-card divide-y divide-gray-800">
          {holdings.map((holding, index) => (
            <tr key={holding.coin} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap">
                <Checkbox 
                  id={`select-${holding.coin}`}
                  checked={holding.isSelected || false}
                  onCheckedChange={(checked) => handleSelect(index, checked as boolean)}
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  <img
                    src={holding.logo}
                    alt={holding.coin}
                    className="h-8 w-8 rounded-full mr-3"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                    }}
                  />
                  <div>
                    <div className="font-medium">{holding.coin}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{holding.coinName}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div>{formatNumber(holding.totalHolding)}</div>
                <div className="text-xs text-gray-400">{formatCurrency(holding.averageBuyPrice)}</div>
              </td>
              <td className="px-4 py-4">
                {formatCurrency(holding.currentPrice)}
              </td>
              <td className="px-4 py-4">
                <div className={getGainClass(holding.stcg.gain)}>
                  {formatCurrency(holding.stcg.gain)}
                </div>
                <div className="text-xs text-gray-400">{formatNumber(holding.stcg.balance)}</div>
              </td>
              <td className="px-4 py-4">
                <div className={getGainClass(holding.ltcg.gain)}>
                  {formatCurrency(holding.ltcg.gain)}
                </div>
                <div className="text-xs text-gray-400">{formatNumber(holding.ltcg.balance)}</div>
              </td>
              <td className="px-4 py-4">
                {holding.isSelected ? formatNumber(holding.totalHolding) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
