const { useState } = React;
// Prendiamo le icone direttamente dalla libreria caricata nell'HTML
const { User, Calendar, TrendingUp, CheckCircle, Plus, Camera, ChevronRight } = lucide;

const LOGO = "https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg";

const initialModelle = [
  { id: "m1", nome: "Abir Aouidet", tipo: "Advance" },
  { id: "m2", nome: "Alessandro Mincuzzi", tipo: "Start" },
  { id: "m3", nome: "Alessia Kuli", tipo: "Start" },
  { id: "m4", nome: "Alice Leccese", tipo: "Start" },
  { id: "m5", nome: "Alice Penza", tipo: "Start" }
];

function App() {
  const [modelle] = useState(initialModelle);
  const [selectedModella, setSelectedModella] = useState("");
  const [fatturato, setFatturato] = useState(0);

  const netto = (fatturato * 0.8) * 0.8; // Calcolo semplificato per test

  return (
    <div style={{ fontFamily: 'sans-serif', padding: "24px", color: "#3C3530" }}>
      <center>
        <img src={LOGO} alt="Peacock" style={{ height: "30px", marginBottom: "20px" }} />
      </center>
      
      <div style={{ background: "#FFF", borderRadius: "20px", padding: "20px", maxWidth: "400px", margin: "0 auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Calcolatore Compensi</h2>
        
        <label style={{ fontSize: "12px", color: "#999" }}>MODELLA/O</label>
        <select 
          onChange={(e) => setSelectedModella(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #EEE" }}
        >
          <option value="">Seleziona...</option>
          {modelle.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>

        <label style={{ fontSize: "12px", color: "#999" }}>FATTURATO (€)</label>
        <input 
          type="number" 
          onChange={(e) => setFatturato(Number(e.target.value))}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #EEE" }}
        />

        {fatturato > 0 && (
          <div style={{ marginTop: "20px", padding: "15px", background: "#3C3530", color: "#FFF", borderRadius: "12px" }}>
            <div style={{ fontSize: "10px", opacity: 0.7 }}>NETTO ESTIMATO</div>
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>€ {netto.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Montiamo l'app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
