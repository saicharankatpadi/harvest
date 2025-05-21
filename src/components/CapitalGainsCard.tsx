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
  savings = null,
}: CapitalGainsCardProps) => {
  const cardStyle =
    type === "pre"
      ? "bg-koinx-dark-card border border-gray-800"
      : "bg-koinx-blue text-white";

  const stcgNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const ltcgNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const totalNet = stcgNet + ltcgNet;
  const netTitle = type === "pre" ? "Realised Capital Gains:" : "Effective Capital Gains:";

  const renderValueWithTooltip = (value: number, label: string) => (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <span className="cursor-default underline decoration-dotted decoration-1 underline-offset-4">
          {formatCurrency(value)}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="bg-white text-black border border-gray-300 text-xs px-2 py-1 shadow-md rounded-sm font-medium w-fit max-w-xs">
        {value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </HoverCardContent>
    </HoverCard>
  );

  return (
    <div className={`rounded-lg p-6 ${cardStyle}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Short-term Section */}
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
                <span>{renderValueWithTooltip(capitalGains.stcg.profits, "Short-term Profits")}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses</span>
                <span>{renderValueWithTooltip(capitalGains.stcg.losses, "Short-term Losses")}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Capital Gains</span>
                <span>{renderValueWithTooltip(stcgNet, "Short-term Net Gains")}</span>
              </div>
            </div>
          </div>

          {/* Long-term Section */}
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
                <span>{renderValueWithTooltip(capitalGains.ltcg.profits, "Long-term Profits")}</span>
              </div>
              <div className="flex justify-between">
                <span>Losses</span>
                <span>{renderValueWithTooltip(capitalGains.ltcg.losses, "Long-term Losses")}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net Capital Gains</span>
                <span>{renderValueWithTooltip(ltcgNet, "Long-term Net Gains")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Net Gains Section */}
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
          <span className="text-lg font-bold">
            {renderValueWithTooltip(totalNet, "Effective Capital Gains")}
          </span>
        </div>

        {savings && (
          <div className="mt-4 p-2 bg-green-900/30 rounded text-white text-center text-sm">
            <span role="img" aria-label="emoji">⚖️</span> Your taxable capital gains are reduced by: {savings}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapitalGainsCard;

