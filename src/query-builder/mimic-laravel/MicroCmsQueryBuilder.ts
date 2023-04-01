import { isEmpty, isFunction, isString } from "lodash";
import { MOperatorKey, OperatorEnum, TOperatorKey } from "../types";
import { TWhereOption, TWhereParams } from "./types/where";

export default class MicroCmsQueryBuilder {
  private query: string = "";

  private getParams(param: TWhereParams): [string, TOperatorKey, string] {
    const fieldName = param[0];

    const operatorKey =
      MOperatorKey.safeParse(param[1]).success == true
        ? (param[1] as TOperatorKey)
        : "=";
    const fieldValue = param[2] || "";

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
  private prepareQuery(param: TWhereParams): string {
    const [fieldName, operatorKey, fieldValue] = this.getParams(param);
    const operatorValue = this.getFilteringKeyword(operatorKey);

    if (operatorValue.includes(",")) {
      return this.buildExpressions(operatorValue, fieldName, fieldValue);
    }

    return `${fieldName}${operatorValue}${fieldValue}`;
  }

  private buildQuery(whereType: string, param: TWhereParams | string): string {
    const currentQuery = this.query;

    switch (whereType) {
      case "where": {
        const appendQuery = isString(param) ? param : this.prepareQuery(param);
        const newQuery = isEmpty(currentQuery)
          ? appendQuery
          : `${currentQuery}[and]${appendQuery}`;

        return newQuery;
      }

      case "orWhere": {
        const appendQuery = isString(param) ? param : this.prepareQuery(param);
        const newQuery = isEmpty(currentQuery)
          ? appendQuery
          : `${currentQuery}[or]${appendQuery}`;

        return newQuery;
      }

      default:
        return "";
    }
  }

  private getStringQueryFromOption(
    whereType: string,
    whereOption: TWhereOption
  ): string {
    if (isFunction(whereOption)) {
      const appendQuery = `(${whereOption(new MicroCmsQueryBuilder()).get()})`;
      const newQuery = this.buildQuery(whereType, appendQuery);
      return `${newQuery}`;
    }

    return this.buildQuery(whereType, whereOption);
  }

  public where(whereOption: TWhereOption) {
    const newQuery = this.getStringQueryFromOption("where", whereOption);
    this.set(newQuery);
    return this;
  }

  public orWhere(whereOption: TWhereOption) {
    const newQuery = this.getStringQueryFromOption("orWhere", whereOption);
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
