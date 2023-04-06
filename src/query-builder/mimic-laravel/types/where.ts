import { z } from "zod";
import { MOperatorKey } from "../../types/operator";
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

export type TWhereParams = z.infer<typeof MWhereParams>;

export type TWhereOption =
  | TWhereParams
  | ((builder: TMicroCmsQueryBuilder) => TMicroCmsQueryBuilder);
