import React from "react";
import { RefreshCw, Activity, CheckCircle } from "lucide-react";
import { machineNamesMap } from "../utils/constants";

export default function WhatIfTab({
  simMachine,
  setSimMachine,
  setSelectedMachine,
  simAction,
  setSimAction,
  simValue,
  setSimValue,
  simLoading,
  simResult
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">Cost-Aware What-If Sandbox</h2>
        <p className="text-slate-400 text-sm">Compare the financial consequences of operational decisions before scheduling shutdowns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Controls */}
        <div className="lg:col-span-1 glass-panel border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-md font-display border-b border-slate-800 pb-3">Simulation Variables</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Select Target Asset</label>
              <select 
                value={simMachine} 
                onChange={(e) => {
                  setSimMachine(e.target.value);
                  setSelectedMachine(e.target.value); // Sync active inspection view
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
              >
                {Object.entries(machineNamesMap).map(([mid, name]) => (
                  <option key={mid} value={mid}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Choose Scenario Action</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSimAction("postpone"); setSimValue(48); }}
                  className={`flex-1 py-2 px-3 border rounded-lg text-center transition ${simAction === 'postpone' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/40 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Postpone Service
                </button>
                <button
                  type="button"
                  onClick={() => { setSimAction("shutdown"); setSimValue(4); }}
                  className={`flex-1 py-2 px-3 border rounded-lg text-center transition ${simAction === 'shutdown' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/40 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                >
                  Planned Stop
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-400 font-medium">Duration</label>
                <span className="font-mono text-white font-bold">{simValue} Hours</span>
              </div>
              <input 
                type="range" 
                min={simAction === 'postpone' ? 12 : 1}
                max={simAction === 'postpone' ? 120 : 12}
                step={simAction === 'postpone' ? 12 : 1}
                value={simValue}
                onChange={(e) => setSimValue(e.target.value)}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>{simAction === 'postpone' ? '12 hrs' : '1 hr'}</span>
                <span>{simAction === 'postpone' ? '120 hrs' : '12 hrs'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Output results */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          {simLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
              <RefreshCw className="w-7 h-7 animate-spin mb-2 text-emerald-400" />
              Recomputing factory flows...
            </div>
          ) : simResult ? (
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-md font-display border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Simulated Factory Impact Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Financial Cost Column */}
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                    <span className="text-slate-500 block uppercase tracking-wider font-mono">PROJECTED COST</span>
                    <span className="text-2xl font-bold text-rose-400 font-display">
                      &#x20B9;{(simResult.estimated_financial_loss || simResult.net_financial_impact || 0).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-relaxed pt-1.5 mt-1 border-t border-slate-800">
                      {simAction === "postpone" ? "Expected reactive repair and production halt cost scaled to failure risk." : "Controlled production delay cost minus saved standby electricity."}
                    </p>
                  </div>

                  {/* Technical impact list */}
                  <div className="space-y-2">
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                      <span className="text-slate-400">Post-Scenario Failure Risk:</span>
                      <span className={`font-bold font-mono ${simResult.post_action_failure_risk > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{simResult.post_action_failure_risk || simResult.failure_probability_change || 0}%</span>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                      <span className="text-slate-400">Energy Consumption Saved:</span>
                      <span className="font-bold text-emerald-400 font-mono">{(simResult.energy_saved_kwh || 0).toFixed(1)} kWh</span>
                    </div>
                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                      <span className="text-slate-400">Delivery Delay Impact:</span>
                      <span className="font-bold font-mono text-white">{simResult.delivery_delay_risk || "None"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-800 pt-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Scenario Validation Justification</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{simResult.justification || "No justification provided."}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-xs py-8">
              Adjust variables on the left configuration column to query scenario outcomes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
