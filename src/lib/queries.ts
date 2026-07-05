import { query } from "./db";

export interface YearlyRow {
  Year: string;
  TotalMT: number;
  TotalValueTK: number;
}

export interface MonthlyPriceRow {
  Year: number;
  Month: string;
  AvgPricePerMT: number | null;
}

export interface CountryRow {
  Origin: string;
  TotalMT: number;
}

export interface ImporterRow {
  ImporterName: string;
  TotalMT: number;
}

const MONTH_ORDER = `CASE Month
  WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3 WHEN 'April' THEN 4
  WHEN 'May' THEN 5 WHEN 'June' THEN 6 WHEN 'July' THEN 7 WHEN 'August' THEN 8
  WHEN 'September' THEN 9 WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12 END`;

export async function getYearly(category: string): Promise<YearlyRow[]> {
  return query<YearlyRow>(
    `
    SELECT CAST(Year AS varchar) AS Year,
           SUM([Quantity In MT]) AS TotalMT,
           SUM([Assessed Value (Tk.)]) AS TotalValueTK
    FROM dbo.tblImportData
    WHERE [Product Category] = @category
    GROUP BY Year
    ORDER BY Year
  `,
    { category }
  );
}

export async function getMonthlyPrice(
  category: string,
  minQty = 0
): Promise<MonthlyPriceRow[]> {
  return query<MonthlyPriceRow>(
    `
    SELECT Year, Month,
           SUM([Assessed Value (Tk.)]) / NULLIF(SUM([Quantity In MT]), 0) AS AvgPricePerMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category AND [Quantity In MT] >= @minQty
    GROUP BY Year, Month
    ORDER BY Year, ${MONTH_ORDER}
  `,
    { category, minQty }
  );
}

export async function getTopCountries(
  category: string,
  limit = 10
): Promise<CountryRow[]> {
  return query<CountryRow>(
    `
    SELECT TOP (@limit) Origin, SUM([Quantity In MT]) AS TotalMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category
    GROUP BY Origin
    ORDER BY TotalMT DESC
  `,
    { category, limit }
  );
}

export async function getTopImporters(
  category: string,
  minQty = 0,
  limit = 8
): Promise<ImporterRow[]> {
  const rows = await query<{ "Importer Name_Clean": string; TotalMT: number }>(
    `
    SELECT TOP (@limit) [Importer Name_Clean], SUM([Quantity In MT]) AS TotalMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category AND [Quantity In MT] >= @minQty
    GROUP BY [Importer Name_Clean]
    ORDER BY TotalMT DESC
  `,
    { category, minQty, limit }
  );
  return rows.map((r) => ({
    ImporterName: r["Importer Name_Clean"],
    TotalMT: r.TotalMT,
  }));
}

export interface WheatMarketPriceRow {
  AssessDate: string;
  CategoryNumber: number;
  Category: string;
  Price: number;
}

export async function getWheatMarketPrices(): Promise<WheatMarketPriceRow[]> {
  const rows = await query<{
    AssessDate: string;
    Category_Number: number;
    Category: string;
    Price: number;
  }>(`
    SELECT CONVERT(varchar, Assessment_Date, 23) AS AssessDate, Category_Number, Category, Price
    FROM dbo.tblWheatPrice
    ORDER BY Assessment_Date, Category_Number
  `);
  return rows.map((r) => ({
    AssessDate: r.AssessDate,
    CategoryNumber: r.Category_Number,
    Category: r.Category,
    Price: r.Price,
  }));
}

export interface CoalMarketPriceRow {
  PDate: string;
  Grade: number;
  PricePerMT: number;
}

export async function getCoalMarketPrices(): Promise<CoalMarketPriceRow[]> {
  const rows = await query<{
    PDate: string;
    strProductCategory: string;
    decPricePerMT: number;
  }>(`
    SELECT CONVERT(varchar, dteDate, 23) AS PDate, strProductCategory, decPricePerMT
    FROM ml.tblCoalPriceForecastingInput
    ORDER BY dteDate, strProductCategory
  `);
  return rows
    .map((r) => {
      const match = r.strProductCategory.match(/GAR-(\d{4})/);
      return {
        PDate: r.PDate,
        Grade: match ? Number(match[1]) : 0,
        PricePerMT: r.decPricePerMT,
      };
    })
    .filter((r) => r.Grade > 0);
}

export interface CommodityData {
  yearly: YearlyRow[];
  monthlyPrice: MonthlyPriceRow[];
  countries: CountryRow[];
  importers: ImporterRow[];
}

export async function getWheatData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("WHEAT"),
    getMonthlyPrice("WHEAT"),
    getTopCountries("WHEAT"),
    getTopImporters("WHEAT"),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}

export async function getCoalData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("COAL"),
    getMonthlyPrice("COAL"),
    getTopCountries("COAL"),
    getTopImporters("COAL"),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}

export async function getSoybeanData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("SOYABEAN"),
    getMonthlyPrice("SOYABEAN", 100), // exclude non-bulk pharma/industrial misclassified rows
    getTopCountries("SOYABEAN"),
    getTopImporters("SOYABEAN", 100),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}

export async function getMaizeData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("MAIZE/ CORN"),
    getMonthlyPrice("MAIZE/ CORN", 100), // exclude tiny non-bulk shipments (e.g. pet food, unrelated goods) misclassified under this category
    getTopCountries("MAIZE/ CORN"),
    getTopImporters("MAIZE/ CORN", 100),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}

export async function getYellowPeasData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("YELLOW PEAS"),
    getMonthlyPrice("YELLOW PEAS"), // no filter — see priceNote: Apr-Aug 2024 has a known customs valuation anomaly, kept as-is
    getTopCountries("YELLOW PEAS"),
    getTopImporters("YELLOW PEAS"),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}

export async function getChickpeasData(): Promise<CommodityData> {
  const [yearly, monthlyPrice, countries, importers] = await Promise.all([
    getYearly("CHICKPEAS"),
    getMonthlyPrice("CHICKPEAS"), // no filter — small-quantity shipments are legitimate trading companies, sustained 2022-2025 price rise matches real global chickpea market shortage
    getTopCountries("CHICKPEAS"),
    getTopImporters("CHICKPEAS"),
  ]);
  return { yearly, monthlyPrice, countries, importers };
}
