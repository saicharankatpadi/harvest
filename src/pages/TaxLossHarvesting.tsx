
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCapitalGains, fetchHoldings } from "@/services/api";
import { CapitalGains, Holding } from "@/types";
import { formatCurrency } from "@/utils/formatter";
import CapitalGainsCard from "@/components/CapitalGainsCard";
import HoldingsTable from "@/components/HoldingsTable";
import { InfoIcon } from "lucide-react";
import TaxOptimizationHint from "@/components/TaxOptimizationHint";
import HowItWorks from "@/components/HowItWorks";

const TaxLossHarvesting = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [originalCapitalGains, setOriginalCapitalGains] = useState<CapitalGains | null>(null);
  const [afterHarvestingGains, setAfterHarvestingGains] = useState<CapitalGains | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  // Fetch initial data
  const { data: holdingsData, isLoading: isLoadingHoldings } = useQuery({
    queryKey: ["holdings"],
    queryFn: fetchHoldings,
  });

  const { data: capitalGainsData, isLoading: isLoadingCapitalGains } = useQuery({
    queryKey: ["capitalGains"],
    queryFn: fetchCapitalGains,
  });

  // Set initial data
  useEffect(() => {
    if (holdingsData) {
      const initialHoldings = holdingsData.map(holding => ({ 
        ...holding, 
        isSelected: false 
      }));
      setHoldings(initialHoldings);
    }
  }, [holdingsData]);

  useEffect(() => {
    if (capitalGainsData) {
      setOriginalCapitalGains(capitalGainsData);
      setAfterHarvestingGains(capitalGainsData);
    }
  }, [capitalGainsData]);

  // Handle checkbox selection
  const handleSelectHolding = (index: number, checked: boolean) => {
    const updatedHoldings = [...holdings];
    updatedHoldings[index].isSelected = checked;
    setHoldings(updatedHoldings);
    
    // Update after harvesting gains
    updateAfterHarvestingGains(updatedHoldings);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    const updatedHoldings = holdings.map(holding => ({
      ...holding,
      isSelected: checked
    }));
    setHoldings(updatedHoldings);
    
    // Update after harvesting gains
    updateAfterHarvestingGains(updatedHoldings);
  };

  // Handle selecting a specific gain type (stcg or ltcg)
  const handleSelectGain = (index: number, gainType: 'stcg' | 'ltcg') => {
    if (!originalCapitalGains || !afterHarvestingGains) return;

    // Create a new reference of afterHarvestingGains to avoid direct mutation
    const newGains: CapitalGains = {
      stcg: { ...afterHarvestingGains.stcg },
      ltcg: { ...afterHarvestingGains.ltcg }
    };

    const holding = holdings[index];
    const gain = holding[gainType].gain;

    // Update the appropriate profit or loss in the capital gains
    if (gainType === 'stcg') {
      if (gain < 0) {
        // For losses, we add to the losses total
        newGains.stcg.losses += Math.abs(gain);
      } else {
        // For profits, we add to the profits total
        newGains.stcg.profits += gain;
      }
    } else if (gainType === 'ltcg') {
      if (gain < 0) {
        newGains.ltcg.losses += Math.abs(gain);
      } else {
        newGains.ltcg.profits += gain;
      }
    }

    setAfterHarvestingGains(newGains);
  };

  // Calculate new gains after selection
  const updateAfterHarvestingGains = (updatedHoldings: Holding[]) => {
    if (!originalCapitalGains) return;

    // Start with original values
    const newGains: CapitalGains = {
      stcg: { ...originalCapitalGains.stcg },
      ltcg: { ...originalCapitalGains.ltcg }
    };

    // Calculate additional gains from selected holdings
    updatedHoldings.forEach(holding => {
      if (holding.isSelected) {
        // Short-term capital gains
        if (holding.stcg.gain > 0) {
          newGains.stcg.profits += holding.stcg.gain;
        } else if (holding.stcg.gain < 0) {
          newGains.stcg.losses += Math.abs(holding.stcg.gain);
        }
        
        // Long-term capital gains
        if (holding.ltcg.gain > 0) {
          newGains.ltcg.profits += holding.ltcg.gain;
        } else if (holding.ltcg.gain < 0) {
          newGains.ltcg.losses += Math.abs(holding.ltcg.gain);
        }
      }
    });

    setAfterHarvestingGains(newGains);
  };

  // Calculate savings
  const calculateSavings = (): number | null => {
    if (!originalCapitalGains || !afterHarvestingGains) return null;
    
    const originalNet = 
      (originalCapitalGains.stcg.profits - originalCapitalGains.stcg.losses) + 
      (originalCapitalGains.ltcg.profits - originalCapitalGains.ltcg.losses);
    
    const afterNet = 
      (afterHarvestingGains.stcg.profits - afterHarvestingGains.stcg.losses) + 
      (afterHarvestingGains.ltcg.profits - afterHarvestingGains.ltcg.losses);
    
    // Only return savings if it's a positive number
    const savings = originalNet - afterNet;
    return savings > 0 ? savings : null;
  };

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-koinx-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <h1 className="text-4xl font-bold">Tax Optimisation</h1>
          <HowItWorks />
        </div>
        
        <div className="flex items-center mb-4">
          <button 
            className="flex items-center text-2xl font-semibold"
            onClick={() => setIsInfoVisible(!isInfoVisible)}
          >
            <InfoIcon size={22} className="text-blue-400 mr-2" />
            <span>Important Notes And Disclaimers</span>
          </button>
        </div>
        
        {/* Info Box */}
        {isInfoVisible && <TaxOptimizationHint />}
        
        {isLoadingCapitalGains || isLoadingHoldings ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Capital Gains Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Pre Harvesting Card */}
              {originalCapitalGains && (
                <CapitalGainsCard 
                  title="Pre Harvesting"
                  type="pre"
                  capitalGains={originalCapitalGains}
                />
              )}
              
              {/* After Harvesting Card */}
              {afterHarvestingGains && (
                <CapitalGainsCard 
                  title="After Harvesting"
                  type="after"
                  capitalGains={afterHarvestingGains}
                  savings={savings ? formatCurrency(savings) : null}
                />
              )}
            </div>
            
            {/* Holdings Table */}
            <HoldingsTable 
              holdings={holdings}
              onSelectHolding={handleSelectHolding}
              onSelectAll={handleSelectAll}
              onSelectGain={handleSelectGain}
              visibleCount={4}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TaxLossHarvesting;
