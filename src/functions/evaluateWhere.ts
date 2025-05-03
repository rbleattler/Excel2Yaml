/**
 * Evaluates complex conditional expressions in where clauses.
 * @param condition - Condition to evaluate
 * @param row - Current data row
 * @param context - Current context
 * @param config - Global configuration
 * @returns Result of condition evaluation
 */
import { Config } from "../interfaces/Config";
import { resolveTemplateVar } from "./resolveTemplateVar";

export function evaluateWhere(condition: string, row: Record<string, unknown>, context: Record<string, unknown>, config: Config): boolean {
  function evaluateSingleCondition(cond: string): boolean {
    const emptyMatch = cond.match(/^<(.+?)>\s*(==|!=)\s*\[\]\s*$/);
    if (emptyMatch) {
      const [, varName, operator] = emptyMatch;
      const rowValue = resolveTemplateVar(varName, row, context, config);
      const rowStr = rowValue == null || String(rowValue).trim() === '' ? '' : String(rowValue).trim();
      return operator === '==' ? rowStr === '' : rowStr !== '';
    }
    const match = cond.match(/^<(.+?)>\s*(==|!=)\s*['"](.*?)['"]\s*$/);
    if (!match) return true;
    const [, varName, operator, value] = match;
    const rowValue = resolveTemplateVar(varName, row, context, config);
    if (operator === '==') {
      return String(rowValue) === value;
    } else {
      return String(rowValue) !== value;
    }
  }
  function parseAndEvaluate(cond: string): boolean {
    while (cond.includes('(')) {
      cond = cond.replace(/\(([^()]+)\)/g, (_, inner) => String(parseAndEvaluate(inner)));
    }
    const orClauses = cond.split(/\s+OR\s+/i);
    if (orClauses.length > 1) {
      return orClauses.some(clause => parseAndEvaluate(clause));
    }
    const andClauses = cond.split(/\s+AND\s+/i);
    if (andClauses.length > 1) {
      return andClauses.every(clause => parseAndEvaluate(clause));
    }
    const notMatch = cond.match(/^NOT\s+(.+)/i);
    if (notMatch) {
      return !parseAndEvaluate(notMatch[1]);
    }
    return evaluateSingleCondition(cond.trim());
  }
  return parseAndEvaluate(condition);
}
