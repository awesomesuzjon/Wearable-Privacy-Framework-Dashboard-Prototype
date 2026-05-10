import React from "react";
import "./styles.css";

export default function WearablePrivacyFrameworkDashboard() {
    const participants = {
        P01: {
            id: "P01",
            age: 22,
            device: "Apple Watch",
            sleep: 5.8,
            deepSleep: 0.6,
            rem: 1.0,
            awake: 1.2,
            hr: 72,
            hrv: 42,
        },
        P02: {
            id: "P02",
            age: 45,
            device: "Samsung Galaxy Watch",
            sleep: 7.2,
            deepSleep: 1.4,
            rem: 1.6,
            awake: 0.8,
            hr: 64,
            hrv: 58,
        },
        P03: {
            id: "P03",
            age: 61,
            device: "Garmin",
            sleep: 6.1,
            deepSleep: 0.7,
            rem: 1.1,
            awake: 1.5,
            hr: 69,
            hrv: 39,
        },
        P04: {
            id: "P04",
            age: 30,
            device: "Apple Watch",
            sleep: 7.8,
            deepSleep: 1.8,
            rem: 2.0,
            awake: 0.5,
            hr: 60,
            hrv: 65,
        },
    };

    const [selected, setSelected] = React.useState("P01");
    const [processed, setProcessed] = React.useState(false);

    const data = participants[selected];

    const runFramework = () => {
        setProcessed(true);
    };

    const getInsight = () => {
        if (data.sleep < 6 && data.hrv < 45) {
            return "High stress behavioural pattern detected (low sleep + low HRV).";
        } else if (data.sleep >= 7 && data.hrv >= 55) {
            return "Healthy recovery pattern observed (good sleep + strong HRV).";
        } else {
            return "Moderate behavioural pattern detected. No strong stress indicators.";
        }
    };

    const anonymisedTable = Object.values(participants).map((p, index) => ({
        id: "PX" + (index + 1),
        ageGroup: p.age > 50 ? "50-60" : p.age > 30 ? "30-50" : "20-30",
        sleep: p.sleep,
        hrv: p.hrv,
        hr: p.hr,
        device: "Masked",
    }));

    return (
        <div className="app-container">
            <div className="header">
                <h1>Privacy-Preserving Wearable Mental Health Framework</h1>
                <p>Interactive Research Prototype Dashboard</p>
            </div>

            {/* Selector */}
            <div className="card">
                <h2>Select Participant</h2>
                <div className="center selector-button-wrapper">
                    <select
                        className="modern-select-button"
                        value={selected}
                        onChange={(e) => {
                            setSelected(e.target.value);
                            setProcessed(false);
                        }}
                    >
                        {Object.keys(participants).map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Data */}
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

            {/* Button */}
            <div className="center">
                <button onClick={runFramework}>Run Privacy Framework</button>
            </div>

            {/* Output */}
            {processed && (
                <div className="output-container">
                    <div className="card red">
                        <h3>Raw Data Removed</h3>
                        <p>Identifiers, location and device IDs removed.</p>
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

                    <div className="card blue">
                        <h3>Privacy Controls</h3>
                        <ul>
                            <li>✔ Anonymisation Applied</li>
                            <li>✔ Aggregation Enabled</li>
                            <li>✔ Consent Verified</li>
                            <li>✔ No Third-Party Sharing</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
