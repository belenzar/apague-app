import { useState, useEffect } from "react";

const ITEMS = [
  "Planchita apagada",
  "Plancha apagada",
  "Aire acondicionado apagado",
  "Luces apagadas",
  "Gas cerrado",
  "Estufa apagada",
  "Ventanas cerradas",
  "Puerta con llave",
];

export default function App() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data) {
      setNombre(data.nombre);
      setTelefono(data.telefono);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify({ nombre, telefono }));
  }, [nombre, telefono]);

  const toggleItem = (item) => {
    setChecked({ ...checked, [item]: !checked[item] });
  };

  const enviarWhatsapp = () => {
    if (!nombre || !telefono) {
      alert("Completá tu nombre y teléfono");
      return;
    }

    const completados = ITEMS.filter((item) => checked[item])
      .map((item) => `• ${item}`)
      .join("\n");

    const mensaje = `✅ Checklist antes de salir:\n\n👤 ${nombre}\n\n${completados}\n\nTodo listo 👌`;
    const telefonoLimpio = telefono.replace(/\D/g, "");

    window.open(
      `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
    );
  };

  return (
    <main className="app-container">
      <div className="card">
        <h1 className="title">¿Apagué?</h1>
        <p>
          ¿Te pasa que salís de casa y al ratito te olvidás si apagaste todo?{" "}
          <br /> Seleccioná lo que apagaste antes de salir y te llegará un
          recordatorio a tu Whatsapp
        </p>

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

        <section className="list">
          {ITEMS.map((item) => (
            <label key={item} className="item">
              <input
                type="checkbox"
                checked={checked[item] || false}
                onChange={() => toggleItem(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </section>

        <button className="button" onClick={enviarWhatsapp}>
          Salir de casa ✅
        </button>
      </div>
    </main>
  );
}
