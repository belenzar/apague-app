import { useState, useEffect } from "react";

const ITEMS = [
  { id: "planchita", label: "Planchita apagada", icon: "🔌" },
  { id: "plancha", label: "Plancha apagada", icon: "👔" },
  { id: "aire", label: "Aire acondicionado apagado", icon: "❄️" },
  { id: "luces", label: "Luces apagadas", icon: "💡" },
  { id: "gas", label: "Gas cerrado", icon: "🔥" },
  { id: "estufa", label: "Estufa apagada", icon: "🍳" },
  { id: "ventanas", label: "Ventanas cerradas", icon: "🪟" },
  { id: "puerta", label: "Puerta con llave", icon: "🔑" },
];

export default function App() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contexto, setContexto] = useState("");
  const [checked, setChecked] = useState({});
  const [recomendaciones, setRecomendaciones] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData") || "null");
    if (data) {
      setNombre(data.nombre || "");
      setTelefono(data.telefono || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify({ nombre, telefono }));
  }, [nombre, telefono]);

  const toggleItem = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const todosCheckeados = ITEMS.every((item) => checked[item.id]);
  const cantidadCheckeada = ITEMS.filter((item) => checked[item.id]).length;

  const generarRecomendacionesIA = async () => {
    if (!contexto.trim()) {
      setError("Escribí un contexto para que la IA pueda ayudarte.");
      return;
    }
    setError("");
    setCargando(true);
    setRecomendaciones("");

    try {
      const itemsCheckeados = ITEMS.filter((i) => checked[i.id]).map((i) => i.label);
      const itemsPendientes = ITEMS.filter((i) => !checked[i.id]).map((i) => i.label);

      const response = await fetch(
        "https://mariazar.app.n8n.cloud/webhook/apague",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contexto,
            items_apagados: itemsCheckeados,
            items_pendientes: itemsPendientes,
            nombre,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // n8n puede devolver texto plano o JSON
      const contentType = response.headers.get("content-type") || "";
      let texto = "";

      if (contentType.includes("application/json")) {
        const json = await response.json();
        // Intentar extraer el texto de la respuesta de n8n
        texto =
          json.output ||
          json.text ||
          json.message ||
          json.respuesta ||
          (typeof json === "string" ? json : JSON.stringify(json));
      } else {
        texto = await response.text();
      }

      setRecomendaciones(texto || "La IA no devolvió recomendaciones. Revisá el flujo de n8n.");
    } catch (err) {
      setError(
        "No se pudo conectar con n8n. Verificá que el webhook esté activo y que el flujo esté publicado."
      );
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const enviarWhatsapp = () => {
    if (!nombre || !telefono) {
      alert("Completá tu nombre y teléfono antes de continuar.");
      return;
    }
    const completados = ITEMS.filter((item) => checked[item.id])
      .map((item) => `• ${item.label}`)
      .join("\n");
    const pendientes = ITEMS.filter((item) => !checked[item.id])
      .map((item) => `• ${item.label}`)
      .join("\n");

    const mensaje =
      `✅ *Checklist antes de salir* — ¿Apagué?\n\n` +
      `👤 ${nombre}\n\n` +
      (completados ? `*Apagado/cerrado:*\n${completados}\n\n` : "") +
      (pendientes ? `*Pendiente:*\n${pendientes}\n\n` : "") +
      (recomendaciones ? `*Recomendaciones IA:*\n${recomendaciones}\n\n` : "") +
      `Todo listo para salir 👌`;

    const telefonoLimpio = telefono.replace(/\D/g, "");
    window.open(
      `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <main className="app-container">
      <div className="card">
        <h1 className="title">¿Apagué?</h1>
        <p className="subtitle">
          ¿Te pasa que salís de casa y al ratito te olvidás si apagaste todo?{" "}
          <br />
          Seleccioná lo que apagaste, describí tu situación y la IA te da recomendaciones.
          Luego te llegará un recordatorio a tu WhatsApp.
        </p>

        {/* Datos personales */}
        <div className="form-section">
          <input
            className="input"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="input"
            placeholder="Teléfono WhatsApp (ej: 549221...)"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {/* Contexto para la IA */}
        <div className="ia-section">
          <label className="section-label">
            Contexto para la IA
          </label>
          <textarea
            className="input textarea"
            placeholder="Ej: Voy al trabajo y está lloviendo. Vuelvo a la noche."
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            rows={3}
          />
          <button
            className={`button button-ia ${cargando ? "loading" : ""}`}
            onClick={generarRecomendacionesIA}
            disabled={cargando}
          >
            {cargando ? "Generando recomendaciones..." : "Generar recomendaciones IA 🤖"}
          </button>

          {error && (
            <div className="error-box">
              ⚠️ {error}
            </div>
          )}

          {recomendaciones && (
            <div className="ia-response">
              <div className="ia-response-header">
                <span>✨ Recomendaciones de la IA</span>
              </div>
              <p className="ia-response-text">{recomendaciones}</p>
            </div>
          )}
        </div>

        {/* Progreso */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="section-label">Checklist</span>
            <span className="progress-count">
              {cantidadCheckeada}/{ITEMS.length}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(cantidadCheckeada / ITEMS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <section className="list">
          {ITEMS.map((item) => (
            <label
              key={item.id}
              className={`item ${checked[item.id] ? "item-checked" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked[item.id] || false}
                onChange={() => toggleItem(item.id)}
              />
              <span className="item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </label>
          ))}
        </section>

        {todosCheckeados && (
          <div className="all-done-message">
            🎉 ¡Todo apagado! Ya podés salir tranquilo/a.
          </div>
        )}

        <button className="button button-main" onClick={enviarWhatsapp}>
          Salir de casa ✅
        </button>

        <footer className="footer">Apagué App · by María Zárate · 2026</footer>
      </div>
    </main>
  );
}
