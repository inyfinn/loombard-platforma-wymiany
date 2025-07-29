import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "Jak dodać nową walutę?",
    answer: "Przejdź do sekcji Portfel i kliknij 'Dodaj walutę'. Wybierz walutę i wprowadź kwotę.",
  },
  {
    id: 2,
    question: "Jak ustawić alert cenowy?",
    answer: "W sekcji Alerty cenowe kliknij 'Dodaj alert' i ustaw warunki cenowe.",
  },
  {
    id: 3,
    question: "Czy mogę cofnąć transakcję?",
    answer: "Transakcje są nieodwracalne. Sprawdź dokładnie dane przed potwierdzeniem.",
  },
  {
    id: 4,
    question: "Jak działa kalkulator wymiany?",
    answer: "Wprowadź kwotę i wybierz waluty. Kalkulator pokaże aktualny kurs wymiany.",
  },
];

export const FAQWidget = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <Card className="bg-[#00071c] border-[#02c349]/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#02c349] flex items-center">
          <HelpCircle className="w-4 h-4 mr-2" />
          FAQ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-[#02c349]/10 last:border-b-0">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between text-left py-2 hover:text-[#02c349] transition-colors"
              >
                <span className="text-sm font-medium text-white">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="w-4 h-4 text-[#02c349]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {openFaq === faq.id && (
                <div className="pb-2">
                  <p className="text-xs text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 