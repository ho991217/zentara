import type { SuggestionItem, SuggestionRule } from '../types';

interface MatchResult<T extends SuggestionItem = string> {
  rule: SuggestionRule<T>;
  trigger: string;
  match: RegExpMatchArray | null;
}

/**
 * * Find a matching rule for the given text
 * * Look for the longest match in the text
 * @param text - The text to search for a match
 * @param rules - The rules to search for a match
 * @returns The matching rule or null if no match is found
 */
export const findMatchingRule = <T extends SuggestionItem = string>(
  text: string,
  rules: SuggestionRule<T>[]
): MatchResult<T> | null => {
  let longestMatch: (MatchResult<T> & { length: number }) | null = null;

  for (const rule of rules) {
    for (const trigger of rule.triggers) {
      if (typeof trigger === 'string') {
        if (text.endsWith(trigger)) {
          const length = trigger.length;
          if (!longestMatch || length > longestMatch.length) {
            longestMatch = { rule, trigger, match: null, length };
          }
        }
      } else {
        const regExp = new RegExp(`${trigger.source}$`, trigger.flags);
        const match = text.match(regExp);
        if (match) {
          const length = match[0].length;
          if (!longestMatch || length > longestMatch.length) {
            longestMatch = { rule, trigger: match[0], match, length };
          }
        }
      }
    }
  }

  return longestMatch
    ? {
        rule: longestMatch.rule,
        trigger: longestMatch.trigger,
        match: longestMatch.match,
      }
    : null;
};
