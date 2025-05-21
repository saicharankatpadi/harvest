
import { CapitalGains } from "@/types";
import { formatCurrency } from "@/utils/formatter";
import { InfoIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CapitalGainsCardProps {
  title: string;
  type: "pre" | "after";
  capitalGains: CapitalGains;
  savings?: string | null;
}

const CapitalGainsCard = ({ 
  title, 
  type, 
  capitalGains, 
  savings = null 
}: CapitalGainsCardProps) => {
  const cardStyle = type === "pre" 
    ? "bg-koinx-dark-card border border-gray-800" 
    : "bg-koinx-blue text-white";
  
  // Calculate net values
  const stcgNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const ltcgNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const totalNet = stcgNet + ltcgNet;
  
  // Determine title based on type
  const netTitle = type === "pre" ? "Realised Capital Gains:" : "Effective Capital Gains:";
  
  return (
    <div className={`rounded-lg p-6 ${cardStyle}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-300">Short-term</p>
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Profits</span>
                <span>{formatCurrency(capitalGains.stcg.profits)}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses</span>
                <span>{formatCurrency(capitalGains.stcg.losses)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Capital Gains</span>
                <span className="text-white">
                  {formatCurrency(stcgNet)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <p className="text-sm text-gray-300">Long-term</p>
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
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Profits</span>
                <span>{formatCurrency(capitalGains.ltcg.profits)}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses</span>
                <span>{formatCurrency(capitalGains.ltcg.losses)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Capital Gains</span>
                <span className="text-white">
                  {formatCurrency(ltcgNet)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h4 className="text-lg font-semibold">{netTitle}</h4>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="ml-1">
                  <InfoIcon size={14} className="text-gray-400 hover:text-gray-300" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-gray-800 text-white border border-gray-700 p-3 text-xs">
                <p>The sum of short-term and long-term capital gains after accounting for profits and losses.</p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <span className="text-lg font-bold text-white">
            {formatCurrency(totalNet)}
          </span>
        </div>
        
        {savings && (
          <div className="mt-4 p-2 bg-green-900/30 rounded text-white text-center">
            You're going to save {savings}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalGainsCard;
