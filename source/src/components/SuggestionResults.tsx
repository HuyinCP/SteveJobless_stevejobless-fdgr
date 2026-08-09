import type { FormationResult } from "../types";
import { DeficiencyPanel } from "./DeficiencyPanel";
import { SuggestionCard } from "./SuggestionCard";

interface Props {
  result: FormationResult;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SuggestionResults({ result, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <DeficiencyPanel deficiencies={result.deficiencies} totalSuggestions={result.suggestions.length} />
      {result.suggestions.map((s, i) => (
        <SuggestionCard
          key={s.id}
          suggestion={s}
          rank={i + 1}
          selected={selectedId === s.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
