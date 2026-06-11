import React from "react";
import "./styles.css";

export default function WearablePrivacyFrameworkDashboard() {
    const [participants, setParticipants] = React.useState({});
    const [selected, setSelected] = React.useState("P01");
    const [processed, setProcessed] = React.useState(false);

    React.useEffect(() => {
        fetch(`/data/${selected}.csv`)
            .then((res) => res.text())
            .then((text) => {
                const rows = text
                    .split("\n")
                    .slice(1)
                    .filter((r) => r.trim());

                const records = rows.map((row) => {
                    const c = row.split(",");

                    return {
                        totalSleep: Number(c[2]),
                        deepSleep: Number(c[3]),
                        rem: Number(c[5]),
                        awake: Number(c[6]),
                        restingHR: Number(c[7]),
                        hrv: Number(c[12]),
                    };
                });

                const avg = (key) =>
                    records.reduce((sum, r) => sum + (r[key] || 0), 0) /
                    (records.length || 1);

                const meta = {
                    P01: { age: 22, device: "Apple Watch" },
                    P02: { age: 45, device: "Samsung Galaxy Watch" },
                    P03: { age: 61, device: "Garmin" },
                    P04: { age: 30, device: "Apple Watch" },
                };

                setParticipants((prev) => ({
                    ...prev,
                    [selected]: {
                        id: selected,
                        age: meta[selected].age,
                        device: meta[selected].device,
                        sleep: Number(avg("totalSleep").toFixed(2)),
                        deepSleep: Number(avg("deepSleep").toFixed(2)),
                        rem: Number(avg("rem").toFixed(2)),
                        awake: Number(avg("awake").toFixed(2)),
                        hr: Number(avg("restingHR").toFixed(0)),
                        hrv: Number(avg("hrv").toFixed(0)),
                    },
                }));
            });
    }, [selected]);

    const data = participants[selected];

    if (!data) return <div>Loading participant data...</div>;

    const runFramework = () => setProcessed(true);

    const getInsight = () => {
        const p = participants[selected];

        if (!p) return "No data available.";

        const sleep = Number(p.sleep);
        const hrv = Number(p.hrv);
        const hr = Number(p.hr);

        // 🔴 HIGH RISK
        if (sleep < 6 && hrv < 45 && hr > 60) {
            return "High risk pattern detected: poor sleep, low HRV, and elevated heart rate.";
        }

        // 🟡 MODERATE RISK
        if (sleep < 6.8 || hrv < 55) {
            return "Moderate stress indicators present: reduced recovery quality detected.";
        }

        // 🟢 HEALTHY
        return "Healthy physiological pattern: stable sleep and recovery metrics observed.";
    };

    const anonymisedTable = Object.values(participants).map((p, index) => ({
        id: "PX" + (index + 1),
        ageGroup:
            p.age > 50 ? "50-60" : p.age > 30 ? "30-50" : "20-30",
        sleep: p.sleep,
        hrv: p.hrv,
        hr: p.hr,
        device: "Masked",
    }));

    return (
        <div className="app-container">
            <div className="header">
                <h1>
                    Privacy-Preserving Wearable Mental Health Framework
                </h1>
                <p>Interactive Research Prototype Dashboard</p>
            </div>

            <div className="card">
                <h2>Select Participant</h2>
                <select
                    value={selected}
                    onChange={(e) => {
                        setSelected(e.target.value);
                        setProcessed(false);
                    }}
                >
                    <option value="P01">P01</option>
                    <option value="P02">P02</option>
                    <option value="P03">P03</option>
                    <option value="P04">P04</option>
                </select>
            </div>

            <div className="card">
                <h2>Wearable Data</h2>
                <div className="grid">
                    <div>Age: {data.age}</div>
                    <div>Device: {data.device}</div>
                    <div>Sleep: {data.sleep}</div>
                    <div>HRV: {data.hrv}</div>
                    <div>HR: {data.hr}</div>
                    <div>Awake: {data.awake}</div>
                </div>
            </div>

            <div className="center">
                <button onClick={runFramework}>
                    Run Privacy Framework
                </button>
            </div>

            {processed && (
                <div className="output-container">
                    <div className="card red">
                        <h3>Raw Data Removed</h3>
                        <p>
                            Identifiers, location and device IDs removed.
                        </p>
                    </div>

                    <div className="card green">
                        <h3>Anonymised Data Table</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Age Group</th>
                                <th>Sleep</th>
                                <th>HRV</th>
                                <th>HR</th>
                            </tr>
                            </thead>
                            <tbody>
                            {anonymisedTable.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.ageGroup}</td>
                                    <td>{row.sleep}</td>
                                    <td>{row.hrv}</td>
                                    <td>{row.hr}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="card yellow">
                        <h3>Behavioural Insight</h3>
                        <p>{getInsight()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}