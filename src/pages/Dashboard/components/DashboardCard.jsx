export default function DashboardCard({ icon, label, value, tag, tagVariant = "neutral" }) {
  return (
    <div className="dash-card">
      <div className={`dash-card-icon ${icon.variant}`}>{icon.el}</div>
      <div className="dash-card-value">{value}</div>
      <div className="dash-card-label">{label}</div>
      {tag && <div className={`dash-card-tag tag-${tagVariant}`}>{tag}</div>}
    </div>
  );
}
