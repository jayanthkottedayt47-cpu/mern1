// client/src/components/Charts.js
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CategoryDonut({ byCategory }) {
  if (!byCategory || Object.keys(byCategory).length === 0)
    return <div style={{ padding: 10, color: "#64748b" }}>No data available</div>;

  const colors = [
    "#0ea5e9", // blue
    "#10b981", // green
    "#6366f1", // indigo
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
  ];

  const data = Object.entries(byCategory).map(([cat, amt], i) => ({
    name: cat,
    value: amt,
    color: colors[i % colors.length],
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="white"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>

          {/* Minimal clean tooltip */}
          <Tooltip
            formatter={(v) => `₹${v}`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #eee",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />

          {/* Clean compact legend */}
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(name, entry) => {
              const value = data.find((d) => d.name === name)?.value || 0;
              return `${name} (₹${value})`;
            }}
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total */}
      <div
        style={{
          position: "relative",
          marginTop: "-160px",
          textAlign: "center",
          fontSize: 18,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Total <div style={{ fontSize: 22 }}>₹{total}</div>
      </div>
    </div>
  );
}
