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
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">Advanced Analytics & Explainable AI (XAI)</h2>
          <p className="text-slate-500 text-sm font-sans">Deep inspection of neural metrics, sensor timelines, and AI confidence factors.</p>
        </div>
        
        {/* Machine selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(machineNamesMap).map(([mid]) => (
            <button 
              key={mid}
              onClick={() => setSelectedMachine(mid)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-all duration-150 active-press ${selectedMachine === mid ? 'bg-[#0061FF]/10 text-[#0061FF] border-[#0061FF]/30 font-bold shadow-sm shadow-[#0061FF]/10' : 'bg-white border-slate-200 text-slate-650 hover:text-slate-900 hover:border-slate-350'}`}
            >
              {mid}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Recharts Line Graph */}
        <div className="lg:col-span-2 glass-panel border border-slate-200 bg-white rounded-2xl p-6">
          <h3 className="font-bold text-sm uppercase tracking-wider font-hud mb-6 text-slate-800">{machineNamesMap[selectedMachine].toUpperCase()} - Historical Telemetry Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} dy={8} className="font-mono" />
                <YAxis yAxisId="left" stroke="#059669" fontSize={10} tickLine={false} dx={-8} domain={['auto', 'auto']} className="font-mono" />
                <YAxis yAxisId="right" orientation="right" stroke="#d97706" fontSize={10} tickLine={false} dx={8} domain={['auto', 'auto']} className="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#059669" strokeWidth={2.5} activeDot={{ r: 6 }} name="Temperature (°C)"/>
                <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#d97706" strokeWidth={2} activeDot={{ r: 6 }} name="Vibration (mm/s)"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XAI Feature Importance Graph */}
        <div className="lg:col-span-1 glass-panel border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest font-hud border-b border-slate-150 pb-3 mb-5 text-slate-800">Edge AI Feature Importances</h3>
            <p className="text-[11px] text-slate-500 mb-5 leading-normal">Relative weight contributions of parameters driving the failure model score.</p>
            
            <div className="space-y-4">
              {telemetry[selectedMachine]?.ai_prediction.feature_importances && 
                Object.entries(telemetry[selectedMachine].ai_prediction.feature_importances).map(([feature, pct]) => (
                  <div key={feature} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                      <span className="uppercase tracking-wide">{feature}</span>
                      <span className="font-hud text-[#0061FF] font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                      <div 
                        className="h-full bg-gradient-to-r from-[#0061FF] to-[#60A5FA] rounded-full health-bar"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-xl mt-6 text-center">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest mb-1.5 font-mono">Model Confidence Score</span>
            <span className="text-3xl font-hud font-bold text-[#0061FF]">94.2%</span>
            <span className="text-[8px] text-slate-500 block font-mono mt-2 leading-relaxed">Offline Edge inference running interpretable logistic scoring models</span>
          </div>
        </div>
      </div>
    </div>
  );
}
