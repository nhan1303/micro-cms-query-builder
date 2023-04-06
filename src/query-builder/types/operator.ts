import { z } from "zod";

export enum CombiningOperator {
  "[and]" = "[and]",
  "[or]" = "[or]",
}

export enum OperatorEnum {
  "<" = "[less_than]",
  ">" = "[greater_than]",
  "=" = "[equals]",
  "!=" = "[not_equals]",
  "<=" = "[less_than],[equals]",
  ">=" = "[greater_than],[equals]",
  "contains" = "[contains]",
  "begins_with" = "[begins_with]",
  "exists" = "[exists]",
  "not_exists" = "[not_exists]",
}

export const MOperatorKeys = [
  z.literal("<"),
  z.literal(">"),
  z.literal("="),
  z.literal("!="),
  z.literal("<="),
  z.literal(">="),
  z.literal("contains"),
  z.literal("begins_with"),
  z.literal("exists"),
  z.literal("not_exists"),
] as const;

export const MOperatorKey = z.union(MOperatorKeys);
export type TOperatorKey = z.infer<typeof MOperatorKey>;
