"use client";

const models = [
  { name: "Abir Aouidet", type: "Advance" },
  { name: "Alessandro Mincuzzi", type: "Start" },
  { name: "Alessia Kuli", type: "Start" },
];

export default function Page() {
  return (
    <main style={{
      padding: "40px",
      fontFamily: "Helvetica, Arial, sans-serif",
      background: "#f7f7f7",
      minHeight: "100vh"
    }}>
      <h1 style={{
        fontSize: "32px",
        marginBottom: "30px"
      }}>
        Peacock Models
      </h1>

      <div style={{
        display: "grid",
        gap: "12px"
      }}>
        {models.map((m, i) => (
          <div key={i} style={{
            background: "white",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #eee"
          }}>
            <strong>{m.name}</strong>
            <div style={{ opacity: 0.6 }}>{m.type}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
