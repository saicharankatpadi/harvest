
import { Holding } from "@/types";
import { formatCurrency, formatNumber, getGainClass } from "@/utils/formatter";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface HoldingsTableProps {
  holdings: Holding[];
  onSelectHolding: (index: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectGain: (index: number, gainType: 'stcg' | 'ltcg') => void;
  visibleCount?: number;
}

const HoldingsTable = ({ 
  holdings,
  onSelectHolding,
  onSelectAll,
  onSelectGain,
  visibleCount = 4
}: HoldingsTableProps) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAll, setShowAll] = useState(false);

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    switch (sortField) {
      case 'stcg':
        valueA = a.stcg.gain;
        valueB = b.stcg.gain;
        break;
      case 'ltcg':
        valueA = a.ltcg.gain;
        valueB = b.ltcg.gain;
        break;
      case 'price':
        valueA = a.currentPrice;
        valueB = b.currentPrice;
        break;
      case 'holdings':
        valueA = a.totalHolding;
        valueB = b.totalHolding;
        break;
      default:
        return 0;
    }
    
    return sortDirection === 'asc' 
      ? valueA - valueB 
      : valueB - valueA;
  });

  const displayHoldings = showAll ? sortedHoldings : sortedHoldings.slice(0, visibleCount);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Holdings</h2>
        <button 
          className="text-blue-400 text-sm hover:text-blue-300"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <Checkbox 
                  id="selectAll" 
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  className="border-white text-white" 
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Asset
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('holdings')}
              >
                <div className="flex items-center">
                  Holdings
                  {renderSortIcon('holdings')}
                </div>
                <span className="font-normal text-gray-400">Avg Buy Price</span>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Current Price
                  {renderSortIcon('price')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('stcg')}
              >
                <div className="flex items-center">
                  <span>Short-Term Gain</span>
                  {renderSortIcon('stcg')}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="ml-1">
                        <InfoIcon size={14} className="text-gray-400 hover:text-gray-300" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 bg-gray-800 text-white border border-gray-700 p-3 text-xs">
                      <p>Short-term capital gains are realized from assets held for one year or less.</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </th>
              <th 
                scope="col" 
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('ltcg')}
              >
                <div className="flex items-center">
                  <span>Long-Term Gain</span>
                  {renderSortIcon('ltcg')}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="ml-1">
                        <InfoIcon size={14} className="text-gray-400 hover:text-gray-300" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 bg-gray-800 text-white border border-gray-700 p-3 text-xs">
                      <p>Long-term capital gains are realized from assets held for more than one year.</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody className="bg-koinx-dark-card divide-y divide-gray-800">
            {displayHoldings.map((holding, index) => (
              <tr key={holding.coin} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <Checkbox 
                    id={`select-${holding.coin}`}
                    checked={holding.isSelected || false}
                    onCheckedChange={(checked) => handleSelect(sortedHoldings.indexOf(holding), checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
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
                <td 
                  className="px-4 py-4 cursor-pointer hover:bg-gray-700/30" 
                  onClick={() => onSelectGain(sortedHoldings.indexOf(holding), 'stcg')}
                >
                  <div className={`${holding.stcg.gain < 0 ? "text-koinx-red" : "text-koinx-green"}`}>
                    {formatCurrency(holding.stcg.gain)}
                  </div>
                  <div className="text-xs text-gray-400">{formatNumber(holding.stcg.balance)}</div>
                </td>
                <td 
                  className="px-4 py-4 cursor-pointer hover:bg-gray-700/30"
                  onClick={() => onSelectGain(sortedHoldings.indexOf(holding), 'ltcg')}
                >
                  <div className={`${holding.ltcg.gain < 0 ? "text-koinx-red" : "text-koinx-green"}`}>
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
    </div>
  );
};

export default HoldingsTable;
