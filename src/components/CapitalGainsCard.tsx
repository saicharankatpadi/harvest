
import { CapitalGains } from "@/types";
import { formatCurrency } from "@/utils/formatter";

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
    ? "bg-koinx-dark-card" 
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
            <p className="text-sm text-gray-300 mb-2">Short-term</p>
            
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
                <span className={stcgNet < 0 ? "text-koinx-red" : ""}>
                  {formatCurrency(stcgNet)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-300 mb-2">Long-term</p>
            
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
                <span className={ltcgNet < 0 ? "text-koinx-red" : ""}>
                  {formatCurrency(ltcgNet)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">{netTitle}</h4>
          <span className={`text-lg font-bold ${totalNet < 0 ? "text-koinx-red" : ""}`}>
            {formatCurrency(totalNet)}
          </span>
        </div>
        
        {savings && (
          <div className="mt-4 p-2 bg-green-900/30 rounded text-koinx-green text-center">
            You're going to save {savings}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalGainsCard;
