import React from "react";
import { ChevronRight } from "lucide-react";

export default function OpportunitiesTab({
  sendCopilotQuery
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">AI Opportunity Finder</h2>
        <p className="text-slate-400 text-sm">Autonomous search results flagging structural savings, load balancing, and energy conservation.</p>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Opportunity 1 */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded tracking-wide font-mono uppercase text-[10px]">ENERGY WASTE DETECTED</span>
              <span className="text-slate-400 font-mono">Asset M2 (Injection Molder)</span>
            </div>
            <h3 className="font-bold text-sm text-white font-display">Deteriorating Motor Efficiency (Friction Build-up)</h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The local ML model detects that M2 is consuming **24.2 kWh**, which is **14% higher** than baseline parameters for an 80% operating load. Vibration levels show low-amplitude bearing noise (0.6 mm/s). 
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹1,200/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
            >
              Simulate load reduction <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 2 */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded tracking-wide font-mono uppercase text-[10px]">PEAK LOAD OFFSET</span>
              <span className="text-slate-400 font-mono">Asset M6 (Hydraulic Press)</span>
            </div>
            <h3 className="font-bold text-sm text-white font-display">Industrial Power Cost Load Shifting Opportunity</h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Hydraulic Press M6 has a high peak draw of **40 kW**. Moving heavy stamping jobs from the high-tariff afternoon window (14:00 - 18:00) to the night shift (22:00 - 06:00) yields significant savings under time-of-day billing.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹3,600/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
            >
              Simulate peak shift <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 3 */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded tracking-wide font-mono uppercase text-[10px]">STANDBY POWER LEAK</span>
              <span className="text-slate-400 font-mono">Asset M4 (Air Compressor)</span>
            </div>
            <h3 className="font-bold text-sm text-white font-display">Unproductive Idle Leakage (Zero Pressure Output)</h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Air Compressor M4 remains fully powered during plant lunch/break shifts, drawing **12.4 kWh** in standby mode despite zero pneumatic cylinder pressure demand. Automatic standby shutoff trigger recommended.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹950/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
            >
              Configure standby timer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 4 */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="bg-rose-500/10 text-rose-400 font-semibold px-2 py-0.5 rounded tracking-wide font-mono uppercase text-[10px]">DOWNTIME COST AVOIDANCE</span>
              <span className="text-slate-400 font-mono">Asset M3 (6-Axis Robot)</span>
            </div>
            <h3 className="font-bold text-sm text-white font-display">Bearings Preventive Re-greasing Window</h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Vibration anomalies on joint 3 indicate lubricant film breakdown. Scheduling grease replenishment now costs ₹18,000, but avoids a sudden gearbox seizure costing ₹2.10 Lakh in parts and 6 hours of line downtime.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹4.17 Lakh (Avoided Loss)</span>
            <button 
              onClick={() => sendCopilotQuery("Which machine should be repaired first?")}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
            >
              Analyze avoidance ROI <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
