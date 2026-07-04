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
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">Cost-Aware What-If Sandbox</h2>
        <p className="text-slate-500 text-sm">Compare the financial consequences of operational decisions before scheduling shutdowns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Controls */}
        <div className="lg:col-span-1 glass-panel border border-slate-200 bg-white rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest font-hud border-b border-slate-150 pb-3 text-slate-800">Simulation Variables</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-500 block mb-2 uppercase tracking-wider font-mono text-[9px]">Select Target Asset</label>
              <select 
                value={simMachine} 
                onChange={(e) => {
                  setSimMachine(e.target.value);
                  setSelectedMachine(e.target.value); // Sync active inspection view
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-805 outline-none transition-all duration-150 focus:border-[#0061FF]/40"
              >
                {Object.entries(machineNamesMap).map(([mid, name]) => (
                  <option key={mid} value={mid}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-2 uppercase tracking-wider font-mono text-[9px]">Choose Scenario Action</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSimAction("postpone"); setSimValue(48); }}
                  className={`flex-1 py-2 px-3 border rounded-lg text-center transition-all duration-150 active-press uppercase tracking-wider text-[9px] font-bold ${simAction === 'postpone' ? 'bg-[#0061FF]/10 text-[#0061FF] border-[#0061FF]/30' : 'bg-slate-50 border-slate-200 text-slate-650 hover:text-slate-900 hover:border-slate-350'}`}
                >
                  Postpone Service
                </button>
                <button
                  type="button"
                  onClick={() => { setSimAction("shutdown"); setSimValue(4); }}
                  className={`flex-1 py-2 px-3 border rounded-lg text-center transition-all duration-150 active-press uppercase tracking-wider text-[9px] font-bold ${simAction === 'shutdown' ? 'bg-[#0061FF]/10 text-[#0061FF] border-[#0061FF]/30' : 'bg-slate-50 border-slate-200 text-slate-650 hover:text-slate-900 hover:border-slate-350'}`}
                >
                  Planned Stop
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-slate-500 uppercase tracking-wider font-mono text-[9px]">Duration</label>
                <span className="font-hud text-slate-800 font-bold text-xs">{simValue} Hours</span>
              </div>
              <input 
                type="range" 
                min={simAction === 'postpone' ? 12 : 1}
                max={simAction === 'postpone' ? 120 : 12}
                step={simAction === 'postpone' ? 12 : 1}
                value={simValue}
                onChange={(e) => setSimValue(e.target.value)}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0061FF]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2.5">
                <span>{simAction === 'postpone' ? '12 hrs' : '1 hr'}</span>
                <span>{simAction === 'postpone' ? '120 hrs' : '12 hrs'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Output results */}
        <div className="lg:col-span-2 glass-panel border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between">
          {simLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs py-16">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#0061FF]" />
              <span className="uppercase tracking-widest font-mono text-[10px] text-slate-500">Recomputing factory flows...</span>
            </div>
          ) : simResult ? (
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest font-hud border-b border-slate-150 pb-3 flex items-center gap-2 text-slate-800">
                  <Activity className="w-4 h-4 text-[#0061FF] animate-pulse" />
                  Simulated Factory Impact Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Financial Cost Column */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-slate-500 block uppercase tracking-widest font-mono text-[9px]">PROJECTED COST</span>
                    <span className="text-2xl font-bold text-rose-600 font-hud">
                      &#x20B9;{(simResult.estimated_financial_loss || simResult.net_financial_impact || 0).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500 leading-relaxed pt-2.5 mt-2 border-t border-slate-200">
                      {simAction === "postpone" ? "Expected reactive repair and production halt cost scaled to failure risk." : "Controlled production delay cost minus saved standby electricity."}
                    </p>
                  </div>

                  {/* Technical impact list */}
                  <div className="space-y-2">
                    <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-500">Post-Scenario Failure Risk:</span>
                      <span className={`font-bold font-hud ${simResult.post_action_failure_risk > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>{simResult.post_action_failure_risk || simResult.failure_probability_change || 0}%</span>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-500">Energy Consumption Saved:</span>
                      <span className="font-bold text-emerald-600 font-hud">{(simResult.energy_saved_kwh || 0).toFixed(1)} <span className="text-[9px] font-sans font-normal text-slate-500">KWH</span></span>
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-500">Delivery Delay Impact:</span>
                      <span className="font-bold font-hud text-slate-800 uppercase text-[10px]">{simResult.delivery_delay_risk || "None"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-150 pt-4.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0061FF] shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-800 block uppercase tracking-widest font-mono">Scenario Justification</span>
                  <p className="text-[11px] text-slate-650 leading-normal mt-1">{simResult.justification || "No justification provided."}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-500 text-xs py-16">
              <span className="uppercase tracking-widest font-mono text-[10px]">Adjust variables on the left configuration column to query scenario outcomes.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
