const isLoading = (v) => v === "…" || v === null || v === undefined;

export default function DashboardCard({ icon, label, value, tag, tagVariant = "neutral" }) {
  const loading = isLoading(value);

  return (
    <div className={`dash-card ${loading ? "dash-card--loading" : ""}`}>
      <div className={`dash-card-icon ${icon.variant}`}>{icon.el}</div>
      {loading ? (
        <>
          <div className="dash-card-skeleton dash-card-skeleton--value" />
          <div className="dash-card-skeleton dash-card-skeleton--label" />
        </>
      ) : (
        <>
          <div className="dash-card-value">{value}</div>
          <div className="dash-card-label">{label}</div>
          {tag && <div className={`dash-card-tag tag-${tagVariant}`}>{tag}</div>}
        </>
      )}
    </div>
  );
}
