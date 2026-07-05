import RefreshButton from "./RefreshButton";

export default function PageHeader({
  icon,
  title,
  category,
  accent,
}: {
  icon: string;
  title: string;
  category: string;
  accent: string;
}) {
  return (
    <div className="page-header" style={{ ["--accent" as string]: `var(${accent})` }}>
      <div className="page-header-eyebrow">{category}</div>
      <h1>
        <span>{icon}</span> {title}
      </h1>
      <div
        className="subtitle"
        style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}
      >
        <span>
          Source: dbo.tblImportData — Bangladesh customs bill-of-entry records.
          Cached for speed — click Refresh to pull the latest data.
        </span>
        <RefreshButton />
      </div>
    </div>
  );
}
