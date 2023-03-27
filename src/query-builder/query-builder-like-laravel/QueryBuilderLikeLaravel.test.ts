import MicroCmsQueryBuilder from "./QueryBuilderLikeLaravel";

describe("MicroCmsQueryBuilder - operators", () => {
  it("should use [equals] if declare operator '='", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["gender", "=", "male"]).get();

    const expected = "gender[equals]male";

    expect(query).toEqual(expected);
  });

  it("should use [not_equals] if declare operator '!='", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["gender", "!=", "male"]).get();

    const expected = "gender[not_equals]male";

    expect(query).toEqual(expected);
  });

  it("should use [greater_than] if declare operator '>'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["age", ">", "18"]).get();

    const expected = "age[greater_than]18";

    expect(query).toEqual(expected);
  });

  it("should use [less_than] if declare operator '<'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["age", "<", "18"]).get();

    const expected = "age[less_than]18";

    expect(query).toEqual(expected);
  });

  it("should use (fieldName[greater_than]fieldValue[or]fieldName[equals]fieldValue) if declare operator '>='", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["age", ">=", "18"]).get();

    const expected = "(age[greater_than]18[or]age[equals]18)";

    expect(query).toEqual(expected);
  });

  it("should use (fieldName[less_than]fieldValue[or]fieldName[equals]fieldValue) if declare operator '<='", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["age", "<=", "18"]).get();

    const expected = "(age[less_than]18[or]age[equals]18)";

    expect(query).toEqual(expected);
  });

  it("should use [contains] if declare operator 'contains'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["name", "contains", "john"]).get();

    const expected = "name[contains]john";

    expect(query).toEqual(expected);
  });

  it("should use [begins_with] if declare operator 'begins_with'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["pushlishedAt", "begins_with", "2023-03-03"]).get();

    const expected = "pushlishedAt[begins_with]2023-03-03";

    expect(query).toEqual(expected);
  });

  it("should use [exists] if declare operator 'exists'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["logo_thumnail", "exists"]).get();

    const expected = "logo_thumnail[exists]";

    expect(query).toEqual(expected);
  });

  it("should use [not_exists] if declare operator 'not_exists'", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder.where(["logo_thumnail", "not_exists"]).get();

    const expected = "logo_thumnail[not_exists]";

    expect(query).toEqual(expected);
  });
});

describe("MicroCmsQueryBuilder - conjunctions", () => {
  it("should use [and] if where method is called", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder
      .where(["gender", "=", "male"])
      .where(["age", ">", "18"])
      .get();

    const expected = "gender[equals]male[and]age[greater_than]18";

    expect(query).toEqual(expected);
  });

  it("should use [or] if orWhere method is called", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder
      .where(["gender", "=", "male"])
      .orWhere(["age", ">", "18"])
      .get();

    const expected = "gender[equals]male[or]age[greater_than]18";

    expect(query).toEqual(expected);
  });
});

describe("MicroCmsQueryBuilder - grouping", () => {
  it("should grouping [and] format as: (expresion1)[and](expression2)", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder
      .where((builder: MicroCmsQueryBuilder) => {
        const groupingExpressionBuilder = builder
          .where(["gender", "=", "male"])
          .orWhere(["age", ">", "18"]);

        return groupingExpressionBuilder;
      })
      .where((builder: MicroCmsQueryBuilder) => {
        const groupingExpressionBuilder = builder
          .where(["gender", "=", "female"])
          .orWhere(["age", ">", "30"]);

        return groupingExpressionBuilder;
      })
      .get();

    const expression1 = `(gender[equals]male[or]age[greater_than]18)`;
    const expression2 = `(gender[equals]female[or]age[greater_than]30)`;
    const expected = `${expression1}[and]${expression2}`;

    expect(query).toEqual(expected);
  });

  it("should grouping [or] format as: (expresion1)[or](expression2)", () => {
    const queryBuilder = new MicroCmsQueryBuilder();
    const query = queryBuilder
      .where((builder: MicroCmsQueryBuilder) => {
        const groupingExpression = builder
          .where(["gender", "=", "male"])
          .where(["age", ">", "18"]);

        return groupingExpression;
      })
      .orWhere((builder: MicroCmsQueryBuilder) => {
        const groupingExpression = builder
          .where(["gender", "=", "female"])
          .where(["age", ">", "30"]);

        return groupingExpression;
      })
      .get();

    const expression1 = `(gender[equals]male[and]age[greater_than]18)`;
    const expression2 = `(gender[equals]female[and]age[greater_than]30)`;
    const expected = `${expression1}[or]${expression2}`;

    expect(query).toEqual(expected);
  });
});
