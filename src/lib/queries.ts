import { query, queryMulti } from "./db";

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

// Runs all 4 queries for a commodity as ONE batched round trip instead of 4
// separate ones. The DW server is a cross-region connection, so cutting
// round trips matters a lot more here than it would for a local database —
// this was a real contributor to pages feeling slow / occasionally timing
// out under load.
async function getCommodityData(
  category: string,
  minQty = 0,
  importerLimit = 8
): Promise<CommodityData> {
  const recordsets = await queryMulti(
    `
    SELECT CAST(Year AS varchar) AS Year,
           SUM([Quantity In MT]) AS TotalMT,
           SUM([Assessed Value (Tk.)]) AS TotalValueTK
    FROM dbo.tblImportData
    WHERE [Product Category] = @category
    GROUP BY Year
    ORDER BY Year;

    SELECT Year, Month,
           SUM([Assessed Value (Tk.)]) / NULLIF(SUM([Quantity In MT]), 0) AS AvgPricePerMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category AND [Quantity In MT] >= @minQty
    GROUP BY Year, Month
    ORDER BY Year, ${MONTH_ORDER};

    SELECT TOP (10) Origin, SUM([Quantity In MT]) AS TotalMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category
    GROUP BY Origin
    ORDER BY TotalMT DESC;

    SELECT TOP (@importerLimit) [Importer Name_Clean], SUM([Quantity In MT]) AS TotalMT
    FROM dbo.tblImportData
    WHERE [Product Category] = @category AND [Quantity In MT] >= @minQty
    GROUP BY [Importer Name_Clean]
    ORDER BY TotalMT DESC;
    `,
    { category, minQty, importerLimit }
  );

  const [yearly, monthlyPrice, countries, importersRaw] = recordsets as [
    YearlyRow[],
    MonthlyPriceRow[],
    CountryRow[],
    { "Importer Name_Clean": string; TotalMT: number }[],
  ];

  const importers: ImporterRow[] = importersRaw.map((r) => ({
    ImporterName: r["Importer Name_Clean"],
    TotalMT: r.TotalMT,
  }));

  return { yearly, monthlyPrice, countries, importers };
}

export async function getWheatData(): Promise<CommodityData> {
  return getCommodityData("WHEAT");
}

export async function getCoalData(): Promise<CommodityData> {
  return getCommodityData("COAL");
}

export async function getSoybeanData(): Promise<CommodityData> {
  // exclude non-bulk pharma/industrial misclassified rows
  return getCommodityData("SOYABEAN", 100);
}

export async function getMaizeData(): Promise<CommodityData> {
  // exclude tiny non-bulk shipments (e.g. pet food, unrelated goods) misclassified under this category
  return getCommodityData("MAIZE/ CORN", 100);
}

export async function getYellowPeasData(): Promise<CommodityData> {
  // no filter — see priceNote: Apr-Aug 2024 has a known customs valuation anomaly, kept as-is
  return getCommodityData("YELLOW PEAS");
}

export async function getChickpeasData(): Promise<CommodityData> {
  // no filter — small-quantity shipments are legitimate trading companies, sustained 2022-2025 price rise matches real global chickpea market shortage
  return getCommodityData("CHICKPEAS");
}

export async function getCanolaSeedData(): Promise<CommodityData> {
  // no filter — small-quantity share is only 8% of rows with a modest ~12% price difference, no contamination pattern
  return getCommodityData("CANOLA SEED");
}

export async function getLentilData(): Promise<CommodityData> {
  // no filter — small-quantity share is legitimate dal/pulse trading companies (same names as Chickpeas/Yellow Peas), no contamination pattern
  return getCommodityData("LENTIL");
}
