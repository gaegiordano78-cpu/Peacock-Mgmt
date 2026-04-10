import React, { useState } from "react";
import { 
  User, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Clock, 
  Camera,
  ChevronRight
} from "lucide-react";

const LOGO = "https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg";

const initialModelle = [
  { id: "m1", nome: "Abir Aouidet", tipo: "Advance" },
  { id: "m2", nome: "Alessandro Mincuzzi", tipo: "Start" },
  { id: "m3", nome: "Alessia Kuli", tipo: "Start" },
  { id: "m4", nome: "Alice Leccese", tipo: "Start" },
  { id: "m5", nome: "Alice Penza", tipo: "Start" },
  { id: "m6", nome: "Amedeo D'Amicis", tipo: "Start" },
  { id: "m7", nome: "Andres Chen", tipo: "Start" },
  { id: "m8", nome: "Angela Tesoro", tipo: "Start" },
  { id: "m9", nome: "Angelica Facchini", tipo: "Start" },
  { id: "m10", nome: "Angelica", tipo: "Start" },
  { id: "m11", nome: "Anna Gaggero", tipo: "Advance" },
  { id: "m12", nome: "Arianna Gigli", tipo: "Start" },
  { id: "m13", nome: "Asia Lucidi", tipo: "Start" },
  { id: "m14", nome: "Aurora Costantini", tipo: "Start" },
  { id: "m15", nome: "Beatrice Perini", tipo: "Start" }
];

export default function App() {
  const [modelle] = useState(initialModelle);
  const [selectedModella, setSelectedModella] = useState("");
  const [fatturato, setFatturato] = useState(0);
  const [fee, setFee] = useState(20);
  const [rimborso, setRimborso] = useState(0);

  const feeEur = (fatturato * fee) / 100;
  const lordo = fatturato - feeEur + Number(rimborso);
  const ritenuta = lordo * 0.20;
  const netto = lordo - ritenuta;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: "#FBF9F6", minHeight: "100vh", padding: "24px", color: "#3C3530" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <img src={LOGO} alt="Peacock" style={{ height: "32px", marginBottom: "12px" }} />
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#9C948A", textTransform: "uppercase" }}>
          Internal Management
        </div>
      </header>

      <main style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "28px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #F0EAE0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <TrendingUp size={20} color="#3C3530" />
            <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Calcolatore Compensi</h2>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#9C948A", marginBottom: "8px", textTransform: "uppercase" }}>Modella/o</label>
              <select 
                value={selectedModella}
                onChange={(e) => setSelectedModella(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #F0EAE0", backgroundColor: "#FBF9F6" }}
              >
                <option value="">Seleziona...</option>
                {modelle.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#9C948A", marginBottom: "8px", textTransform: "uppercase" }}>Fatturato (€)</label>
              <input 
                type="number" 
                placeholder="0.00"
                onChange={(e) => setFatturato(Number(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1.5px solid #F0EAE0" }}
              />
            </div>

            {fatturato > 0 && (
              <div style={{ marginTop: "10px", padding: "20px", background: "#3C3530", borderRadius: "16px", color: "#FFF" }}>
                <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "4px" }}>NETTO DA PAGARE</div>
                <div style={{ fontSize: "32px", fontWeight: 700 }}>€ {netto.toFixed(2)}</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
  );
}
