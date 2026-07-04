import React from "react";
import { ChevronRight } from "lucide-react";

export default function OpportunitiesTab({
  sendCopilotQuery
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">AI Opportunity Finder</h2>
        <p className="text-slate-500 text-sm">Autonomous search results flagging structural savings, load balancing, and energy conservation.</p>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Opportunity 1 */}
        <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between card-hover-lift">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded tracking-widest font-mono uppercase text-[9px] border border-amber-200/60">ENERGY WASTE DETECTED</span>
              <span className="text-slate-500 font-mono text-[10px]">Asset M2 (Injection Molder)</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">Deteriorating Motor Efficiency (Friction Build-up)</h3>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              The local ML model detects that M2 is consuming **24.2 kWh**, which is **14% higher** than baseline parameters for an 80% operating load. Vibration levels show low-amplitude bearing noise (0.6 mm/s). 
            </p>
          </div>
          <div className="border-t border-slate-150 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold font-hud">Est. Savings: ₹1,200/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-[#0061FF] hover:text-[#0052D9] font-bold font-display uppercase tracking-wider text-[10px] flex items-center gap-0.5 transition active-press"
            >
              Simulate load reduction <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 2 */}
        <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between card-hover-lift">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded tracking-widest font-mono uppercase text-[9px] border border-indigo-200/60">PEAK LOAD OFFSET</span>
              <span className="text-slate-500 font-mono text-[10px]">Asset M6 (Hydraulic Press)</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">Industrial Power Cost Load Shifting Opportunity</h3>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Hydraulic Press M6 has a high peak draw of **40 kW**. Moving heavy stamping jobs from the high-tariff afternoon window (14:00 - 18:00) to the night shift (22:00 - 06:00) yields significant savings under time-of-day billing.
            </p>
          </div>
          <div className="border-t border-slate-150 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold font-hud">Est. Savings: ₹3,600/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-[#0061FF] hover:text-[#0052D9] font-bold font-display uppercase tracking-wider text-[10px] flex items-center gap-0.5 transition active-press"
            >
              Simulate peak shift <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 3 */}
        <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between card-hover-lift">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded tracking-widest font-mono uppercase text-[9px] border border-emerald-200/60">STANDBY POWER LEAK</span>
              <span className="text-slate-500 font-mono text-[10px]">Asset M4 (Air Compressor)</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">Unproductive Idle Leakage (Zero Pressure Output)</h3>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Air Compressor M4 remains fully powered during plant lunch/break shifts, drawing **12.4 kWh** in standby mode despite zero pneumatic cylinder pressure demand. Automatic standby shutoff trigger recommended.
            </p>
          </div>
          <div className="border-t border-slate-150 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold font-hud">Est. Savings: ₹950/day</span>
            <button 
              onClick={() => sendCopilotQuery("Show energy opportunities")}
              className="text-[#0061FF] hover:text-[#0052D9] font-bold font-display uppercase tracking-wider text-[10px] flex items-center gap-0.5 transition active-press"
            >
              Configure standby timer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Opportunity 4 */}
        <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-5 flex flex-col justify-between card-hover-lift">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-150">
              <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded tracking-widest font-mono uppercase text-[9px] border border-rose-200/60">DOWNTIME COST AVOIDANCE</span>
              <span className="text-slate-500 font-mono text-[10px]">Asset M3 (6-Axis Robot)</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 font-display">Bearings Preventive Re-greasing Window</h3>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Vibration anomalies on joint 3 indicate lubricant film breakdown. Scheduling grease replenishment now costs ₹18,000, but avoids a sudden gearbox seizure costing ₹2.10 Lakh in parts and 6 hours of line downtime.
            </p>
          </div>
          <div className="border-t border-slate-150 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold font-hud">Est. Savings: ₹4.17 Lakh (Avoided Loss)</span>
            <button 
              onClick={() => sendCopilotQuery("Which machine should be repaired first?")}
              className="text-[#0061FF] hover:text-[#0052D9] font-bold font-display uppercase tracking-wider text-[10px] flex items-center gap-0.5 transition active-press"
            >
              Analyze avoidance ROI <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
