import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Currency {
  code: string;
  name: string;
  flag: string;
  rate: number;
  available: number;
  change24h: number;
  aliases?: string[];
}

interface CurrencySelectProps {
  currencies: Currency[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showBalance?: boolean;
  getBalance?: (code: string) => number;
  formatCurrency?: (amount: number, currency: string) => string;
  className?: string;
}

export function CurrencySelect({
  currencies,
  value,
  onValueChange,
  placeholder = "Wybierz walutę...",
  showBalance = false,
  getBalance,
  formatCurrency,
  className
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCurrency = currencies.find(currency => currency.code === value);

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return currencies;
    
    const query = searchQuery.toLowerCase();
    return currencies.filter(currency => {
      const matchesCode = currency.code.toLowerCase().includes(query);
      const matchesName = currency.name.toLowerCase().includes(query);
      const matchesAliases = currency.aliases?.some(alias => 
        alias.toLowerCase().includes(query)
      ) || false;
      
      return matchesCode || matchesName || matchesAliases;
    });
  }, [currencies, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-[#00071c]/50 border-[#02c349]/20 text-white hover:bg-[#02c349]/10",
            className
          )}
        >
          {selectedCurrency ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCurrency.flag}</span>
              <span className="font-medium">{selectedCurrency.code}</span>
              {showBalance && getBalance && formatCurrency && (
                <span className="text-xs text-gray-400">
                  ({formatCurrency(getBalance(selectedCurrency.code), selectedCurrency.code)})
                </span>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-[#00071c] border-[#02c349]/20">
        <Command>
          <div className="flex items-center border-b border-[#02c349]/20 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-[#02c349]" />
            <CommandInput
              placeholder="Wyszukaj walutę..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0 text-white placeholder:text-gray-400"
            />
          </div>
          <CommandList className="max-h-60">
            <CommandEmpty className="text-gray-400 py-6 text-center">
              Nie znaleziono waluty.
            </CommandEmpty>
            <CommandGroup>
              {filteredCurrencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.code}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-white hover:bg-[#02c349]/10 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currency.flag}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-gray-400">{currency.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {showBalance && getBalance && formatCurrency && (
                        <span className="text-xs text-gray-400">
                          {formatCurrency(getBalance(currency.code), currency.code)}
                        </span>
                      )}
                      {currency.change24h !== 0 && (
                        <Badge 
                          variant={currency.change24h > 0 ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {currency.change24h > 0 ? "+" : ""}{currency.change24h.toFixed(2)}%
                        </Badge>
                      )}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === currency.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 