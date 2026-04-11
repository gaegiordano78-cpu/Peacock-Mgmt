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
        src="/logo-peacock.png"
        alt="Peacock"
        style={{ width: "60%", objectFit: "contain", paddingLeft: "11%" }}
      />
    </div>
  );
}
