
import { InfoIcon } from "lucide-react";

const TaxOptimizationHint = () => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-5 mb-8">
      <div className="flex items-center mb-3">
        <InfoIcon size={20} className="text-blue-400 mr-2" />
        <h3 className="text-lg font-medium">Important Notes And Disclaimers</h3>
      </div>
      
      <ul className="space-y-3 text-sm text-gray-300">
        <li className="flex items-start">
          <span className="font-semibold text-white mr-2">Price Source Disclaimer:</span>
          Please note that the current price of your coins may differ from the prices listed on specific exchanges. This is because we use CoinGecko as our default price source for certain exchanges, rather than fetching prices directly from the exchange.
        </li>
        
        <li className="flex items-start">
          <span className="font-semibold text-white mr-2">Country-specific Availability:</span>
          Tax loss harvesting may not be supported in all countries. We strongly recommend consulting with your local tax advisor or accountant before performing any related actions on your exchange.
        </li>
        
        <li className="flex items-start">
          <span className="font-semibold text-white mr-2">Utilization of Losses:</span>
          Tax loss harvesting typically allows you to offset capital gains. However, if you have zero or no applicable crypto capital gains, the usability of these harvested losses may be limited. Kindly confirm with your tax advisor how such losses can be applied in your situation.
        </li>
      </ul>
    </div>
  );
};

export default TaxOptimizationHint;
