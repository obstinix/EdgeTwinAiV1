import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { machineNamesMap } from "../utils/constants";

export default function AnalyticsTab({
  selectedMachine,
  setSelectedMachine,
  telemetry,
  historyData
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight">Advanced Analytics & Explainable AI (XAI)</h2>
          <p className="text-slate-400 text-sm">Deep inspection of neural metrics, sensor timelines, and AI confidence factors.</p>
        </div>
        
        {/* Machine selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(machineNamesMap).map(([mid]) => (
            <button 
              key={mid}
              onClick={() => setSelectedMachine(mid)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition ${selectedMachine === mid ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/40 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
            >
              {mid}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Recharts Line Graph */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-md font-display mb-4">{machineNamesMap[selectedMachine]} - Historical Telemetry Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false}/>
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} domain={['auto', 'auto']}/>
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickLine={false} domain={['auto', 'auto']}/>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2.5} name="Temperature (°C)"/>
                <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} name="Vibration (mm/s)"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XAI Feature Importance Graph */}
        <div className="lg:col-span-1 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-md font-display border-b border-slate-800 pb-3 mb-4">Edge AI Feature Importances</h3>
            <p className="text-[11px] text-slate-400 mb-4">Relative weight contributions of parameters driving the failure model score.</p>
            
            <div className="space-y-4">
              {telemetry[selectedMachine]?.ai_prediction.feature_importances && 
                Object.entries(telemetry[selectedMachine].ai_prediction.feature_importances).map(([feature, pct]) => (
                  <div key={feature} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{feature}</span>
                      <span className="font-mono text-emerald-400 font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl mt-6 text-center">
            <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1 font-mono">Model Confidence Score</span>
            <span className="text-3xl font-extrabold text-emerald-400 font-display">94.2%</span>
            <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Offline Edge inference running interpretable logistic scoring models</span>
          </div>
        </div>
      </div>
    </div>
  );
}
