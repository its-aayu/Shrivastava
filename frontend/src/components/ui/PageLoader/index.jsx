import "./style.css";

export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <div className="page-loader__ring" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
      <span className="page-loader__text">Loading</span>
    </div>
  );
}
