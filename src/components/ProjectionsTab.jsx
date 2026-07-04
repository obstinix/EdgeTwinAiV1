import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function ProjectionsTab({
  projectionHorizon,
  setProjectionHorizon,
  activeScenario,
  setActiveScenario,
  projectTimeline
}) {
  const proj = projectTimeline(projectionHorizon, activeScenario);
  const healthColor = proj.factoryHealth > 70 ? 'text-emerald-400' : proj.factoryHealth > 40 ? 'text-amber-400' : 'text-rose-400';
  const lossColor = proj.financialLoss > 100000 ? 'text-rose-400' : proj.financialLoss > 0 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">Scenario Projection Engine</h2>
        <p className="text-slate-400 text-sm">Time-horizon forecast simulation of factory health, energy, and financial risk across scenarios.</p>
      </div>

      {/* Timeline & Scenario Selectors */}
      <div className="glass-panel border border-slate-900/60 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest font-hud text-slate-300 mb-4">Projection Time Horizon</h4>
            <div className="flex gap-2 flex-wrap">
              {[{label:"NOW",hours:0},{label:"+6h",hours:6},{label:"+12h",hours:12},{label:"+24h",hours:24},{label:"+3 Days",hours:72}].map(t => (
                <button 
                  key={t.label}
                  onClick={() => setProjectionHorizon(t.hours)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-150 border active-press ${projectionHorizon === t.hours ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/40 shadow-md shadow-indigo-950/20' : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <input 
              type="range" min="0" max="72" step="6" value={projectionHorizon}
              onChange={e => setProjectionHorizon(parseInt(e.target.value))}
              className="w-full mt-5 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2.5">
              <span>NOW</span><span>+6h</span><span>+12h</span><span>+24h</span><span>+3 Days</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest font-hud text-slate-300 mb-4">Scenario Mode</h4>
            <div className="space-y-1.5">
              {[
                {id:"current", label:"Current Trajectory", desc:"No action taken, baseline telemetry"},
                {id:"projected", label:"Projected Decline", desc:"Statistical degradation curve"},
                {id:"best", label:"Best Case", desc:"Immediate maintenance + optimization"},
                {id:"worst", label:"Worst Case", desc:"Failure cascade, no intervention"},
                {id:"recommended", label:"Recommended (AI)", desc:"Night shift bearing replacement"},
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenario(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition border flex items-center justify-between active-press ${activeScenario === s.id ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950/50 border-slate-900/60 text-slate-400 hover:border-slate-800'}`}
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projection KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel border border-slate-900/60 rounded-2xl p-5 card-hover-lift">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block mb-1">FACTORY HEALTH</span>
          <div className={`text-3xl font-hud font-bold ${healthColor}`}>{proj.factoryHealth}%</div>
          <div className="mt-2.5 bg-slate-950 border border-slate-900 rounded-full h-1.5 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${proj.factoryHealth > 70 ? 'bg-emerald-500' : proj.factoryHealth > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width:`${proj.factoryHealth}%`}} />
          </div>
        </div>
        <div className="glass-panel border border-slate-900/60 rounded-2xl p-5 card-hover-lift">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block mb-1">M3 FAILURE RISK</span>
          <div className={`text-3xl font-hud font-bold ${proj.m3Prob > 50 ? 'text-rose-400' : 'text-amber-400'}`}>{proj.m3Prob}%</div>
          <p className="text-[9px] text-slate-500 mt-1.5 font-mono uppercase tracking-wider">{proj.m3Prob > 90 ? 'IMMINENT FAILURE' : proj.m3Prob > 50 ? 'HIGH RISK' : 'MODERATE RISK'}</p>
        </div>
        <div className="glass-panel border border-slate-900/60 rounded-2xl p-5 card-hover-lift">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block mb-1">ENERGY USAGE</span>
          <div className="text-3xl font-hud font-bold text-sky-400">{proj.energyConsumption} <span className="text-sm font-sans font-normal text-slate-500">KWH</span></div>
          <p className="text-[9px] text-slate-500 mt-1.5 font-mono uppercase tracking-wider">{proj.energyConsumption > 380 ? '▲ Elevated' : proj.energyConsumption < 335 ? '▼ Optimized' : '● Nominal'}</p>
        </div>
        <div className="glass-panel border border-slate-900/60 rounded-2xl p-5 card-hover-lift">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono block mb-1">FINANCIAL EXPOSURE</span>
          <div className={`text-2xl font-hud font-bold ${lossColor}`}>₹{proj.financialLoss.toLocaleString()}</div>
          <p className="text-[9px] text-slate-500 mt-1.5 font-mono uppercase tracking-wider">
            {proj.financialLoss === 0 ? 'No immediate exposure' : 'Projected avoidable loss'}
          </p>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="glass-panel border border-slate-900/60 rounded-2xl p-6">
        <h4 className="font-bold text-xs uppercase tracking-widest font-hud text-slate-200 mb-6">Factory Health Timeline — Scenario: <span className="text-indigo-400 capitalize">{activeScenario.replace('_', ' ')}</span></h4>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[0,6,12,24,72].map(h => {
              const p = projectTimeline(h, activeScenario);
              return { time: h === 0 ? 'NOW' : `+${h}h`, health: p.factoryHealth, risk: p.m3Prob, energy: p.energyConsumption };
            })}>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} dy={8} className="font-mono" />
              <YAxis yAxisId="left" stroke="#10b981" fontSize={10} tickLine={false} dx={-8} domain={[0,100]} className="font-mono" />
              <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={10} tickLine={false} dx={8} domain={[0,100]} className="font-mono" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(8,12,22,0.9)', borderColor: 'rgba(255,255,255,0.06)', borderRadius: '12px', backdropFilter: 'blur(8px)', fontSize: 10, color: '#fff' }}/>
              <Area yAxisId="left" type="monotone" dataKey="health" stroke="#10b981" fill="rgba(16,185,129,0.05)" strokeWidth={2.5} name="Factory Health (%)" />
              <Area yAxisId="right" type="monotone" dataKey="risk" stroke="#f43f5e" fill="rgba(244,63,94,0.04)" strokeWidth={2} name="M3 Failure Risk (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
