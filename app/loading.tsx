export default function Loading() {
  return (
    <div style={{
      background: "#FFFFFF",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <img
        src="/p-logo.png"
        alt="Peacock"
        style={{ height: 80, objectFit: "contain" }}
      />
    </div>
  );
}
