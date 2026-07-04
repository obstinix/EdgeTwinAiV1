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
          <p className="text-slate-400 text-sm font-sans">Deep inspection of neural metrics, sensor timelines, and AI confidence factors.</p>
        </div>
        
        {/* Machine selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(machineNamesMap).map(([mid]) => (
            <button 
              key={mid}
              onClick={() => setSelectedMachine(mid)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-all duration-150 active-press ${selectedMachine === mid ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/40 font-bold shadow-md shadow-emerald-950/20' : 'bg-[#090d16] border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'}`}
            >
              {mid}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Recharts Line Graph */}
        <div className="lg:col-span-2 glass-panel border border-slate-900/60 rounded-2xl p-6">
          <h3 className="font-bold text-sm uppercase tracking-wider font-hud mb-6 text-slate-200">{machineNamesMap[selectedMachine].toUpperCase()} - Historical Telemetry Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} dy={8} className="font-mono" />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={10} tickLine={false} dx={-8} domain={['auto', 'auto']} className="font-mono" />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} tickLine={false} dx={8} domain={['auto', 'auto']} className="font-mono" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(8,12,22,0.9)', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', backdropFilter: 'blur(8px)', color: '#fff' }} />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} name="Temperature (°C)"/>
                <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 6 }} name="Vibration (mm/s)"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XAI Feature Importance Graph */}
        <div className="lg:col-span-1 glass-panel border border-slate-900/60 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest font-hud border-b border-slate-900 pb-3 mb-5 text-slate-200">Edge AI Feature Importances</h3>
            <p className="text-[11px] text-slate-500 mb-5 leading-normal">Relative weight contributions of parameters driving the failure model score.</p>
            
            <div className="space-y-4">
              {telemetry[selectedMachine]?.ai_prediction.feature_importances && 
                Object.entries(telemetry[selectedMachine].ai_prediction.feature_importances).map(([feature, pct]) => (
                  <div key={feature} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400 font-mono text-[10px]">
                      <span className="uppercase tracking-wide">{feature}</span>
                      <span className="font-hud text-emerald-400 font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/60">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full health-bar"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-900 p-4.5 rounded-xl mt-6 text-center">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest mb-1.5 font-mono">Model Confidence Score</span>
            <span className="text-3xl font-hud font-bold text-emerald-400">94.2%</span>
            <span className="text-[8px] text-slate-500 block font-mono mt-2 leading-relaxed">Offline Edge inference running interpretable logistic scoring models</span>
          </div>
        </div>
      </div>
    </div>
  );
}
