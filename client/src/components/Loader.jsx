export default function Loader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white", marginTop: 12 }}>
      <div style={{ width: 36, height: 36, border: "4px solid #555", borderTopColor: "#00d0ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <p>AI đang sinh code...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
