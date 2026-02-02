import React, { useMemo, useState } from "react";

const HOUSE1_SENSORS = [
  { key: "temp", label: "온도", unit: "°C" },
  { key: "humid", label: "습도", unit: "%" },
  { key: "ec", label: "EC", unit: "dS/m" },
  { key: "ph", label: "PH", unit: "" },
];

export default function House1SensorsForm() {
  const [open, setOpen] = useState(false);

  const initial = useMemo(() => {
    const o = {};
    for (const s of HOUSE1_SENSORS) {
      o[s.key] = { sensorId: "", value: "" };
    }
    return o;
  }, []);

  const [sensors, setSensors] = useState(initial);

  const updateField = (sensorKey, field, value) => {
    setSensors((prev) => ({
      ...prev,
      [sensorKey]: { ...prev[sensorKey], [field]: value },
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Example payload you can send to backend
    const payload = {
      house: "house_1",
      sensors, // { temp:{sensorId,value}, humid:{...} ... }
      createdAt: new Date().toISOString(),
    };

    console.log("SUBMIT:", payload);
  };

  return (
    <div style={{ maxWidth: 520, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{ margin: 0 }}>배지 (house_1)</h3>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            marginLeft: "auto",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {open ? "Close" : "Create"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={onSubmit}
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ddd",
            display: "grid",
            gap: 12,
          }}
        >
          {HOUSE1_SENSORS.map((s) => (
            <div
              key={s.key}
              style={{
                border: "1px solid #2b2b2b",
                borderRadius: 12,
                padding: 12,
                display: "grid",
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {s.label} {s.unit ? `(${s.unit})` : ""}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 13 }}>Sensor ID</label>
                <input
                  value={sensors[s.key].sensorId}
                  onChange={(e) => updateField(s.key, "sensorId", e.target.value)}
                  placeholder="ex) sensor_001"
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 13 }}>Value</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    value={sensors[s.key].value}
                    onChange={(e) => updateField(s.key, "value", e.target.value)}
                    placeholder="ex) 24.8"
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid #ccc",
                      outline: "none",
                    }}
                  />
                  <div style={{ minWidth: 70, textAlign: "right", opacity: 0.8 }}>
                    {s.unit || "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            style={{
              marginTop: 6,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}
