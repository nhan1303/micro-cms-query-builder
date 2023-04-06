import { isEmpty, isFunction, isString } from "lodash";
import { CombiningOperator, OperatorEnum, TOperatorKey } from "../types";
import { ZodError } from "zod";

import {
  MWhereParams,
  TWhereOption,
  TWhereParams,
  WhereType,
} from "./types/where";

export default class MicroCmsQueryBuilder<T = unknown> {
  private combiningOperatorDict: Record<WhereType, CombiningOperator> = {
    [WhereType.where]: CombiningOperator["[and]"],
    [WhereType.orWhere]: CombiningOperator["[or]"],
  };

  private query: string = "";

  private isZodError(input: unknown): input is ZodError {
    return input instanceof ZodError;
  }

  private getValuesFromWhereParams(
    whereParam: TWhereParams<T>
  ): [string, TOperatorKey, string] | ZodError {
    const validationResult = MWhereParams.safeParse(whereParam);

    if (!validationResult.success) {
      return validationResult.error;
    }

    const [fieldName, operatorKey, fieldValue = ""] = validationResult.data;
    return [fieldName, operatorKey, fieldValue];
  }

  private getFilteringKeyword(operatorKey: TOperatorKey): OperatorEnum {
    return OperatorEnum[operatorKey];
  }

  private buildExpressions(
    operatorValue: string,
    fieldName: string,
    fieldValue: string
  ) {
    const expresions = operatorValue
      .split(",")
      .map((conjunction: string) => `${fieldName}${conjunction}${fieldValue}`);
    const query = expresions.join("[or]");
    return `(${query})`;
  }
  private prepareQuery(param: TWhereParams<T>): string | ZodError {
    const values = this.getValuesFromWhereParams(param);
    if (this.isZodError(values)) {
      return values;
    }

    const [fieldName, operatorKey, fieldValue] = values;
    const operatorValue = this.getFilteringKeyword(operatorKey);

    if (operatorValue.includes(",")) {
      return this.buildExpressions(operatorValue, fieldName, fieldValue);
    }

    return `${fieldName}${operatorValue}${fieldValue}`;
  }

  private buildQuery(
    whereType: WhereType,
    param: TWhereParams<T> | string
  ): string | ZodError {
    const currentQuery = this.query;
    const appendQuery = isString(param) ? param : this.prepareQuery(param);
    if (this.isZodError(appendQuery)) return appendQuery;

    const combiningOperator = this.combiningOperatorDict[whereType];

    const newQuery = isEmpty(currentQuery)
      ? appendQuery
      : `${currentQuery}${combiningOperator}${appendQuery}`;

    return newQuery;
  }

  private getStringQueryFromOption(
    whereType: WhereType,
    whereOption: TWhereOption<T>
  ): string | ZodError {
    if (isFunction(whereOption)) {
      const appendQuery = `(${whereOption(new MicroCmsQueryBuilder()).get()})`;
      return this.buildQuery(whereType, appendQuery);
    }

    return this.buildQuery(whereType, whereOption);
  }

  public where(whereOption: TWhereOption<T>) {
    const newQuery = this.getStringQueryFromOption(
      WhereType.where,
      whereOption
    );

    if (this.isZodError(newQuery)) {
      return this;
    }

    this.set(newQuery);
    return this;
  }

  public orWhere(whereOption: TWhereOption<T>) {
    const newQuery = this.getStringQueryFromOption(
      WhereType.orWhere,
      whereOption
    );

    if (this.isZodError(newQuery)) {
      return this;
    }

    this.set(newQuery);
    return this;
  }

  private set(query: string) {
    this.query = query;
  }

  public get() {
    return this.query;
  }
}
