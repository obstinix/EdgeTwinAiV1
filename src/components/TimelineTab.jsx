import React from "react";
import { machineNamesMap } from "../utils/constants";

export default function TimelineTab({
  incidents
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">Factory Incident & Event Log</h2>
        <p className="text-slate-500 text-sm">Chronological registry of anomalies, model triggers, and maintenance event audits.</p>
      </div>

      <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-6">
        <h3 className="font-bold text-xs uppercase tracking-widest font-hud border-b border-slate-150 pb-3 mb-6 text-slate-800">Edge Logger Events</h3>
        {incidents.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs font-mono uppercase tracking-widest">
            No incidents recorded. Edge twin system tracking running normally.
          </div>
        ) : (
          <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6 font-mono text-[11px]">
            {incidents.map((incident, i) => (
              <div key={i} className="relative transition-all duration-200 hover:translate-x-0.5">
                <div className="absolute -left-[30px] top-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse" />
                <div className="flex justify-between items-start gap-4 flex-wrap text-slate-500">
                  <div className="space-y-1 flex-1">
                    <span className="text-rose-600 font-hud font-bold block tracking-wider text-[10px]">{incident.type.toUpperCase()}</span>
                    <p className="text-slate-700 font-sans text-xs font-semibold leading-normal">{incident.event}</p>
                    <span className="text-slate-500 text-[10px] block">ASSET ID: {incident.machine_id} ({machineNamesMap[incident.machine_id] || incident.machine_id})</span>
                  </div>
                  <span className="text-slate-500 text-[10px] shrink-0 font-mono tracking-tighter">{incident.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
