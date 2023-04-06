import { MOperatorKey, TOperatorKey } from "../../types/operator";
import { z } from "zod";
import { TMicroCmsQueryBuilder } from "./class";

export enum WhereType {
  "where" = "where",
  "orWhere" = "orWhere",
}

export const MWhereParamsFull = z.tuple([z.string(), MOperatorKey, z.string()]);
export const MWhereParamsOmitFieldValue = z.tuple([z.string(), MOperatorKey]);

export const MWhereParams = z.union([
  MWhereParamsFull,
  MWhereParamsOmitFieldValue,
]);

export type TWhereParams<T> =
  | [T extends Record<string, string> ? keyof T : T, TOperatorKey, string]
  | [T extends Record<string, string> ? keyof T : T, TOperatorKey];

export type TWhereOption<T> =
  | TWhereParams<T>
  | ((builder: TMicroCmsQueryBuilder<T>) => TMicroCmsQueryBuilder<T>);
