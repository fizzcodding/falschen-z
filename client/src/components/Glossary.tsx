/* Glossary term: clickable/hoverable inline term that opens a sharp tooltip with a plain definition.
 * Uses the radix tooltip primitive already wired into the app, so it inherits
 * the navy/paper palette and the global zero-radius rule.
 */
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Glossary({ term, definition }: { term: string; definition: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="glossary-term mono" aria-describedby={`glossary-${term}`}>
          {term}
          <span className="glossary-mark" aria-hidden="true">ⓘ</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="glossary-tip">
        <span id={`glossary-${term}`} className="glossary-def mono">{definition}</span>
      </TooltipContent>
    </Tooltip>
  );
}
