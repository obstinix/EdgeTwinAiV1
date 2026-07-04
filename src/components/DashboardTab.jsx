import React from "react";
import { Sparkles, CheckCircle, AlertCircle, Cpu, TrendingUp, ChevronRight } from "lucide-react";
import { machineNamesMap, advisorData } from "../utils/constants";

export default function DashboardTab({
  telemetry,
  financials,
  failuresPrevented,
  selectedMachine,
  setSelectedMachine,
  topRiskEntry,
  setActiveTab,
  optimizeSchedule,
  wsConnected,
  walkthroughStep,
  getMachineColor,
  getStatusBadge,
  renderMachineNode,
  approveRecommendation,
  resetAllLocal,
  injectAnomalyLocal,
  completeTaskLocal,
  schedule,
  approvedMachines,
  decisionQualityScore,
  esgMetrics
}) {
  const selAdv = advisorData[selectedMachine] || advisorData["M3"];
  const selStatus = telemetry[selectedMachine]?.status || "healthy";
  const selRUL = telemetry[selectedMachine]?.ai_prediction?.rul_hours ?? 980;
  const decisionWindowHrs = Math.max(0, selRUL - 6);
  const decisionWindowH = Math.floor(decisionWindowHrs);
  const decisionWindowM = Math.round((decisionWindowHrs % 1) * 60);
  const recommendedByTime = new Date(Date.now() + decisionWindowHrs * 3600000)
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const selConfidence = selStatus === "critical" ? 94 : selStatus === "warning" ? 91 : 98;
  const selConfidenceLabel = selStatus === "critical" ? "High Confidence" : selStatus === "warning" ? "High Confidence" : "Very High Confidence";
  const selROI = (selAdv.netSavings / selAdv.maintCost).toFixed(1);

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display leading-normal drop-shadow-sm">Factory Floor Digital Twin</h2>
            <p className="text-slate-400 text-sm">Real-time machinery layout, operational health, and executive decision flow.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-slate-300 font-mono">Live WebSocket Broadcast</span>
          </div>
        </div>

        {/* Executive AI Summary Ribbon */}
        {(() => {
          const topM = topRiskEntry;
          const topAdv = advisorData[topM.mid] || advisorData["M3"];
          const topName = machineNamesMap[topM.mid] || topM.mid;
          const topRec = telemetry[topM.mid]?.ai_prediction?.recommendation || "Continue Normal Operations";
          const isCrit = topM.status === "critical";
          const isWarn = topM.status === "warning";
          const borderClass = isCrit ? "border-rose-900/40" : isWarn ? "border-amber-900/40" : "border-slate-800";
          const accent = isCrit ? "text-rose-400" : isWarn ? "text-amber-400" : "text-emerald-400";
          const conf = isCrit ? "94%" : isWarn ? "91%" : "98%";
          return (
            <div className={`border rounded-xl px-4 py-2.5 bg-[#0c101b] ${borderClass}`}>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Sparkles className="w-3 h-3 text-slate-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest font-mono text-slate-400">AI Executive Summary</span>
                </div>
                <div className="h-3 w-px bg-slate-800 shrink-0" />
                <div className="flex items-center gap-5 flex-1 min-w-0 flex-wrap">
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Priority Asset</span>
                    <span className={`text-[11px] font-bold ${accent}`}>{topName}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Recommended Action</span>
                    <span className="text-[11px] font-semibold text-slate-300 truncate block">{topRec}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Net Business Gain</span>
                    <span className="text-[11px] font-bold text-emerald-400">↑ ₹{(topAdv.netSavings / 100000).toFixed(2)} Lakh</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Loss if Ignored</span>
                    <span className="text-[11px] font-bold text-slate-400">₹{(topAdv.potentialLoss / 100000).toFixed(2)} Lakh</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Decision Confidence</span>
                    <span className="text-[11px] font-bold text-emerald-400">{conf}</span>
                  </div>
                </div>
                {(isCrit || isWarn) && (
                  <button
                    onClick={() => { setActiveTab("planner"); optimizeSchedule(); }}
                    className={`shrink-0 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition active:scale-95 text-white ${isCrit ? "bg-rose-700 hover:bg-rose-600" : "bg-amber-600 hover:bg-amber-500"}`}
                  >
                    Approve Plan
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* AI Value Generated — Business Value Through AI Decisions */}
        <div className="glass-panel border border-slate-800 rounded-xl p-3 relative overflow-hidden bg-[#0c101b]/80 card-hover-lift">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <TrendingUp className="w-16 h-16 text-slate-400" />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-48 shrink-0">
              <h3 className="text-xs uppercase tracking-widest text-slate-300 font-bold flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" /> AI Value Generated
              </h3>
              <p className="text-[9px] text-slate-500 leading-tight">Business Value Generated Through AI Decisions</p>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 uppercase tracking-wider">Estimated Savings</span>
                <span className="text-xl font-display font-bold text-white tracking-tight flex items-baseline gap-0.5">
                  <span className="text-emerald-400 text-sm font-semibold">&#x20B9;</span>
                  <span className="animate-[countUp_2s_ease-out_forwards] inline-block">{financials.cost_saved.toLocaleString()}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 uppercase tracking-wider">Downtime Prevented</span>
                <span className="text-xl font-display font-bold text-white tracking-tight">{financials.downtime_prevented} <span className="text-[10px] font-normal text-slate-500">Hrs</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 uppercase tracking-wider">Energy Saved</span>
                <span className="text-xl font-display font-bold text-white tracking-tight">{financials.energy_saved} <span className="text-[10px] font-normal text-slate-500">kWh</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 uppercase tracking-wider">Failures Prevented</span>
                <span className="text-xl font-display font-bold text-emerald-400 tracking-tight">{failuresPrevented}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-slate-400">Last Updated: <span className="text-slate-300 font-semibold">Real-time</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Split: Floorplan on left, inspection panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Floorplan & Executive Panels */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Visual SVG floor plan layout */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/60 relative overflow-hidden flex flex-col justify-between flex-1 min-h-[460px]">
            {/* Live System Indicator Chips */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[9px] font-mono font-semibold text-white uppercase tracking-wider">Edge AI · ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 rounded-full px-2.5 py-1">
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[9px] font-mono font-semibold text-white uppercase tracking-wider">
                  WebSocket · {wsConnected ? 'CONNECTED' : 'RECONNECTING'}
                </span>
              </div>
            </div>

            <svg viewBox="0 0 580 360" className="w-full h-auto drop-shadow-lg select-none">
              {/* Grid backdrop */}
              <defs>
                <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30, 41, 59, 0.2)" strokeWidth="0.5"/>
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#floor-grid)" rx="16" />

              {/* FLOW LINES BETWEEN STATIONS */}
              {/* Flow M1 -> M5 */}
              <path d="M 120 140 L 300 140" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 120 140 L 300 140" fill="none" stroke="#10b981" strokeWidth="2" className="flow-active" />
              
              {/* Flow M5 -> M3 (Robot) */}
              <path d="M 340 100 L 480 100" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 340 100 L 480 100" fill="none" stroke="#10b981" strokeWidth="2" className="flow-active" />
              
              {/* Flow M2 -> M5 */}
              <path d="M 300 240 L 300 130" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 300 240 L 300 130" fill="none" stroke="#10b981" strokeWidth="2" className="flow-active" />

              {/* Flow M3 -> M6 */}
              <path d="M 480 130 L 480 240" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
              <path d="M 480 130 L 480 240" fill="none" stroke="#10b981" strokeWidth="2" className="flow-active" />

              {/* Flow M4 (Compressor) -> M6 (Hydraulic Pneumatics) */}
              <path d="M 120 260 L 420 260" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="5,5" strokeLinecap="round"/>
              {/* DYNAMIC MACHINERY SVG NODES */}
              {renderMachineNode("M1", 100, 100, "CNC Mill")}
              {renderMachineNode("M5", 300, 100, "Conveyor Belt")}
              {renderMachineNode("M3", 480, 100, "Robot Arm")}
              {renderMachineNode("M4", 100, 260, "Air Compressor")}
              {renderMachineNode("M2", 300, 260, "Injection Molder")}
              {renderMachineNode("M6", 480, 260, "Hydraulic Press")} 
            </svg>
          </div>
        </div>
        
        {/* 1. Operational Decision Intelligence Engine™ */}
        <div className={`glass-panel rounded-2xl p-5 border border-slate-800 shrink-0 ${walkthroughStep === 3 ? 'demo-highlight-ring' : ''}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Operational Decision Intelligence Engine™
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Prescriptive simulator comparing strategies for {machineNamesMap[selectedMachine]}</p>
            </div>
            <span className="bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 font-bold uppercase">Pat. Pending</span>
          </div>

          {telemetry[selectedMachine]?.status !== "healthy" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option A */}
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex flex-col justify-between min-h-[140px] text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200">OPTION A</span>
                      <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">Immediate</span>
                    </div>
                    <h5 className="font-semibold text-emerald-400 text-sm mb-2">Repair Today</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Shut down immediately during current shift to replace joint bearing.</p>
                  </div>
                  <div className="space-y-1 font-mono text-[10px] border-t border-slate-900 pt-2 text-slate-300">
                    <div className="flex justify-between"><span>Est. Savings:</span><span className="font-bold text-emerald-400">₹4.17 Lakh</span></div>
                    <div className="flex justify-between"><span>Downtime:</span><span>1.5 Hours</span></div>
                    <div className="flex justify-between"><span>Prod. Loss:</span><span>2% Shift Delay</span></div>
                  </div>
                </div>

                {/* Option B */}
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850 flex flex-col justify-between min-h-[140px] text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200">OPTION B</span>
                      <span className="text-[9px] bg-rose-950/20 px-1 py-0.5 rounded text-rose-400">High Risk</span>
                    </div>
                    <h5 className="font-semibold text-slate-400 text-sm mb-2">Delay Maintenance</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Defer maintenance to end of week. Run at 100% load.</p>
                  </div>
                  <div className="space-y-1 font-mono text-[10px] border-t border-slate-900 pt-2 text-slate-300">
                    <div className="flex justify-between"><span>Est. Savings:</span><span className="font-bold text-amber-400">₹80,000</span></div>
                    <div className="flex justify-between"><span>Failure Risk:</span><span className="text-rose-400">74% inside 48h</span></div>
                    <div className="flex justify-between"><span>Reactive Down:</span><span>5.0 Hours</span></div>
                  </div>
                </div>

                {/* Option C */}
                <div className="p-3 bg-teal-950/10 rounded-xl border border-teal-500/20 flex flex-col justify-between min-h-[140px] text-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full translate-x-6 -translate-y-6"></div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-200">OPTION C</span>
                      <span className="text-[9px] bg-teal-950/40 px-1.5 py-0.5 rounded text-teal-400 font-bold tracking-wider flex items-center gap-0.5">★ RECOMMENDED</span>
                    </div>
                    <h5 className="font-semibold text-teal-300 text-sm mb-2">Shift Production</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Reroute active cycles to Hydraulic Press; repair joint during night shift.</p>
                  </div>
                  <div className="space-y-1 font-mono text-[10px] border-t border-slate-900 pt-2 text-slate-300">
                    <div className="flex justify-between"><span>Est. Savings:</span><span className="font-bold text-emerald-400">₹3.80 Lakh</span></div>
                    <div className="flex justify-between"><span>Delivery Risk:</span><span className="text-emerald-400">None</span></div>
                    <div className="flex justify-between"><span>Downtime:</span><span>1.5 Hours</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-1 border-t border-slate-850">
                <span className="text-slate-400 flex items-center gap-1.5 mr-auto italic text-[11px]">
                  *Decision optimizer ranks Option C highest based on risk mitigation & zero delivery delay.
                </span>
                <button
                  onClick={() => {
                    approveRecommendation(selectedMachine);
                  }}
                  className={`bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-4 rounded-lg transition active:scale-95 flex items-center gap-1 glow-emerald ${walkthroughStep === 3 ? 'demo-highlight-ring' : ''}`}
                >
                  Approve Recommended Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 font-mono">
              ✨ Operational Decision Intelligence Engine: Spindle calibrated. Spindle telemetry nominal. Next inspection in 980 hours.
            </div>
          )}
        </div>

        {/* PRESENTER WALKTHROUGH GUIDE CONTROLLER */}
        {walkthroughStep === 0 ? (
          <div className="bg-[#0b1329] border border-emerald-500/20 rounded-xl px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-300">EdgeTwin AI Presenter Mode:</span>
              <span className="text-slate-400">Interactive walkthrough for customer pitching &amp; client demonstrations.</span>
            </div>
            <button onClick={() => { resetAllLocal(); setWalkthroughStep(1); setActiveTab("dashboard"); }} className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-1.5 rounded font-bold uppercase tracking-wider transition text-[10px]">
              START WALKTHROUGH
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-300">WALKTHROUGH ACTIVE —</span>
              <span className="text-slate-300">
                {walkthroughStep === 1 && "1. Baseline Operations"}
                {walkthroughStep === 2 && "2. Anomaly Detected"}
                {walkthroughStep === 3 && "3. Explainable AI & Options"}
                {walkthroughStep === 4 && "4. Approval & Dispatch"}
                {walkthroughStep === 5 && "5. Scheduler Integration"}
                {walkthroughStep === 6 && "6. Factory Recovery"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {walkthroughStep === 1 && <button onClick={() => { injectAnomalyLocal("M3", "vibration"); setWalkthroughStep(2); }} className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">Inject Fault</button>}
              {walkthroughStep === 2 && <button onClick={() => { setSelectedMachine("M3"); setWalkthroughStep(3); }} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">View M3</button>}
              {walkthroughStep === 3 && <button onClick={() => setWalkthroughStep(4)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">Compare</button>}
              {walkthroughStep === 4 && <button onClick={() => approveRecommendation("M3")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">Approve</button>}
              {walkthroughStep === 5 && <button onClick={() => { completeTaskLocal(schedule.length > 0 ? schedule[0].id : "slot_m3"); setWalkthroughStep(6); }} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">Complete</button>}
              {walkthroughStep === 6 && <button onClick={() => resetAllLocal()} className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1 rounded font-bold transition active:scale-95 text-[10px] uppercase">Reset</button>}
              <button onClick={() => resetAllLocal()} className="text-slate-400 hover:text-rose-400 text-[10px] font-bold uppercase transition">Quit</button>
            </div>
          </div>
        )}

        {/* 11A: Current Operational Objective + 11B: Decision Window */}
        {(() => {
          const critCount = Object.values(telemetry).filter(m => m.status === "critical").length;
          const warnCount = Object.values(telemetry).filter(m => m.status === "warning").length;
          let objective = "Monitor & Optimize Factory Performance for Maximum Efficiency";
          let objAccent = "text-emerald-300";
          let objBg = "bg-emerald-950/25 border-emerald-500/15";
          if (critCount > 0) {
            objective = `Maintain Production While Preventing Critical Failure — ${machineNamesMap[topRiskEntry.mid]}`;
            objAccent = "text-rose-300";
            objBg = "bg-rose-950/25 border-rose-500/15";
          } else if (warnCount > 0) {
            objective = "Schedule Preventive Maintenance to Avoid Unexpected Production Downtime";
            objAccent = "text-amber-300";
            objBg = "bg-amber-950/25 border-amber-500/15";
          }
          return (
            <div className={`border rounded-xl px-4 py-2.5 flex items-center justify-between gap-4 ${objBg}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono whitespace-nowrap shrink-0">Current Objective</span>
                <span className="w-px h-3 bg-slate-700 shrink-0" />
                <span className={`text-xs font-semibold truncate ${objAccent}`}>{objective}</span>
              </div>
              {(critCount > 0 || warnCount > 0) && (
                <div className="shrink-0 flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Decision Window</span>
                    <span className="text-[11px] font-bold text-white font-mono">
                      {String(decisionWindowH).padStart(2, "0")}h {String(decisionWindowM).padStart(2, "0")}m Remaining
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Recommended Before</span>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">{recommendedByTime}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 2. Executive Business & Proactive Advisor Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          {/* Business Impact Projections */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="font-display font-bold text-sm text-white mb-4 border-b border-white/5 pb-2">Business Impact (Annualized Projection)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Projected Savings</span>
                <span className="text-2xl font-bold text-emerald-400 font-display">₹2.4 Cr</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Downtime Reduction</span>
                <span className="text-2xl font-bold text-white font-display">34%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Maintenance Cost</span>
                <span className="text-xl font-bold text-white font-display">-18%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Energy Efficiency</span>
                <span className="text-xl font-bold text-emerald-400 font-display">+12%</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 mt-4 italic">*Projected using simulated operational data across 6 assets.</p>
          </div>

          {/* Sustainability & ESG Impact Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
            <h4 className="font-display font-bold text-sm text-emerald-400 mb-4 border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Sustainability & ESG Impact
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Energy Saved</span>
                <span className="text-xl font-bold text-white font-display">{esgMetrics.energy_saved} <span className="text-xs font-normal text-slate-400">kWh</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Carbon Reduction</span>
                <span className="text-xl font-bold text-emerald-400 font-display">{esgMetrics.carbon_reduction} <span className="text-xs font-normal text-slate-400">kg CO₂</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Annual Projected</span>
                <span className="text-lg font-bold text-white font-display">{esgMetrics.annual_reduction} <span className="text-xs font-normal text-slate-400">Tons</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">ESG Audit Rank</span>
                <span className="text-lg font-bold text-emerald-400 font-display">{esgMetrics.score}</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 mt-4 italic">*Monitored local edge loads mapped to Scope 2 emission standards.</p>
          </div>

          {/* Proactive AI Business Advisor */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0c101b]/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-slate-500" />
                <h4 className="font-display font-bold text-sm text-slate-200">AI Business Advisor</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Today's Biggest Opportunity: Energy Optimization</strong>
                Reducing <span className="text-slate-300 font-mono">Conveyor M5</span> load by 8% during non-peak hours could save approximately <strong className="text-emerald-400">₹48,000 per month</strong> without affecting production volume.
              </p>
            </div>
            <button onClick={() => sendCopilotQuery("Show energy opportunities")} className="mt-4 text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-end gap-1 w-full transition">
              Simulate Scenario <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Decision Center & Explainable Inspection Panel */}
      <div className="lg:col-span-1 flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar sticky top-0 animate-[fadeIn_0.3s_ease-out_forwards]" style={{maxHeight: 'calc(100vh - 180px)'}}>
        {telemetry[selectedMachine] ? (
          <>
            {/* AI Executive Advisor & Financial Justification Panel */}
            <div className={`glass-panel rounded-2xl p-5 border ${getMachineColor(telemetry[selectedMachine].status)} relative`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full blur-2xl" style={{transform: 'translate(30%, -30%)'}}></div>
              
              <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4 gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-base font-display text-white">🧠 AI Executive Advisor</h3>
                  <p className="text-[10px] text-slate-300 uppercase tracking-widest font-mono mt-0.5 truncate">{machineNamesMap[selectedMachine]}</p>
                </div>
                <div className="shrink-0">{getStatusBadge(telemetry[selectedMachine].status)}</div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/40 rounded-lg p-3 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Recommended Action</span>
                  <span className="font-bold text-sm text-white block">
                    {selStatus === 'critical' ? 'Replace Bearing During Night Shift' : selStatus === 'warning' ? 'Schedule Inspection Within 48 Hours' : 'Continue Normal Operations'}
                  </span>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Risk Assessment:</span>
                      <span className={`text-[10px] font-bold status-transition ${selStatus === 'critical' ? 'text-rose-400' : selStatus === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {selStatus === 'critical' ? 'CRITICAL RISK' : selStatus === 'warning' ? 'MEDIUM RISK' : 'LOW RISK'}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[8px] text-slate-500 block uppercase tracking-wider font-mono">Decision Confidence</span>
                      <div className="flex items-center gap-1 justify-end">
                        <span className={`text-xs font-bold ${selStatus === 'critical' ? 'text-rose-400' : selStatus === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>{selConfidence}%</span>
                        <span className="text-[8px] text-slate-500">· {selConfidenceLabel}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-500 italic mt-1.5 leading-relaxed border-t border-white/5 pt-1.5">
                    This recommendation maximizes operational availability while minimizing production loss.
                  </p>
                </div>

                {selStatus !== 'healthy' ? (
                  <div className="space-y-3">
                    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-mono">Business Justification Ledger</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Maintenance Cost:</span>
                        <span className="font-mono text-white">₹{selAdv.maintCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Failure Cost if Ignored:</span>
                        <span className="font-mono text-white">₹{selectedMachine === 'M3' ? '2,45,000' : selectedMachine === 'M2' ? '2,40,000' : '2,10,000'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Estimated Production Loss:</span>
                        <span className="font-mono text-rose-400">{selAdv.prodSaved > 0 ? `₹${selAdv.prodSaved.toLocaleString()}` : '—'}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-semibold text-emerald-300">Net Business Gain</span>
                        <span className="font-mono text-emerald-400 font-bold text-base">↑ ₹{selAdv.netSavings.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Business Impact Summary */}
                    <div className="bg-slate-950/30 rounded-xl p-3 border border-slate-800/60 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Downtime Prevented</span>
                        <span className="text-xs font-bold text-white">{selAdv.downtimeHrs.toFixed(1)} hrs</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Production Saved</span>
                        <span className="text-xs font-bold text-emerald-400">{selAdv.prodSaved > 0 ? `₹${selAdv.prodSaved.toLocaleString()}` : '—'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Estimated ROI</span>
                        <span className="text-xs font-bold text-white">{selROI}×</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {approvedMachines.has(selectedMachine) ? (
                        <div className="flex-1 bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Dispatched ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => approveRecommendation(selectedMachine)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 glow-emerald"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve Plan
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab("opportunities")}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white py-2 rounded-lg font-semibold text-xs transition border border-slate-700"
                      >
                        Compare Alternatives
                      </button>
                    </div>

                    {/* 11E: Recommendation Workflow Indicator */}
                    <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-1">
                        {[
                          { label: "Approve\nRecommendation", done: approvedMachines.has(selectedMachine), active: !approvedMachines.has(selectedMachine) },
                          { label: "Auto Maintenance\nScheduling", done: approvedMachines.has(selectedMachine), active: false },
                          { label: "Incident\nLogged", done: approvedMachines.has(selectedMachine), active: false },
                          { label: "Factory\nRecovery", done: false, active: false },
                        ].map((step, i, arr) => (
                          <React.Fragment key={i}>
                            <div className="flex flex-col items-center gap-1 flex-1 text-center">
                              <div
                                className={`w-2 h-2 rounded-full ${step.done ? 'bg-emerald-500' : step.active ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}
                                style={step.done ? { boxShadow: '0 0 6px rgba(16,185,129,0.55)' } : {}}
                              />
                              <span className={`text-[8px] font-mono leading-tight whitespace-pre-line ${step.done ? 'text-emerald-400' : step.active ? 'text-amber-400' : 'text-slate-600'}`}>
                                {step.label}
                              </span>
                            </div>
                            {i < arr.length - 1 && (
                              <div className={`h-px w-3 mt-1 flex-shrink-0 self-start ${step.done ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 text-[11px] text-slate-400 leading-relaxed font-mono">
                    ✓ All telemetry trends are nominal. Telemetry updates indicate no structural degradation. Continuous edge model monitoring active.
                  </div>
                )}
              </div>
            </div>

            {/* Decision Quality Score Metric Card */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-200">Decision Quality Score</h4>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">Weighted metrics score</p>
                </div>
                <span className="bg-slate-900 text-slate-200 px-2 py-1 rounded text-base font-mono font-bold border border-slate-800">{decisionQualityScore}%</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-850 pt-2 mt-2">
                Evaluates operational decision safety, cost recovery ratio, energy impact, downtime offset, and model classification confidence.
              </p>
            </div>

            {/* AI Explainability & Engineering report */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <h4 className="font-display font-bold text-sm text-white mb-3 pb-2 border-b border-slate-850">🛡️ AI Explainability Engineering Report</h4>
              
              <div className="space-y-4">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono block">Why was {selectedMachine} selected?</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">TEMPERATURE TREND</span>
                    <span className={`font-bold ${telemetry[selectedMachine].status === 'healthy' ? 'text-slate-300' : 'text-rose-400'}`}>
                      {telemetry[selectedMachine].status === 'healthy' ? 'Nominal (70°C)' : '↑ 18% (104°C)'}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">VIBRATION TREND</span>
                    <span className={`font-bold ${telemetry[selectedMachine].status === 'healthy' ? 'text-slate-300' : 'text-rose-400'}`}>
                      {telemetry[selectedMachine].status === 'healthy' ? 'Nominal (0.05 mm/s)' : '↑ 24% (0.89 mm/s)'}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">BEARING WEAR SCORE</span>
                    <span className={`font-bold ${telemetry[selectedMachine].status === 'healthy' ? 'text-slate-300' : 'text-rose-400'}`}>
                      {telemetry[selectedMachine].status === 'healthy' ? '12%' : '91%'}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">PATTERN MATCH</span>
                    <span className="font-bold text-slate-300">
                      {telemetry[selectedMachine].status === 'healthy' ? 'Nominal' : '94% Match'}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">REMAINING LIFE</span>
                    <span className="font-bold text-slate-300">
                      {telemetry[selectedMachine].status === 'healthy' ? '>980 Hours' : '18 Hours'}
                    </span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-[10px] text-slate-500 block">POTENTIAL LOSS</span>
                    <span className="font-bold text-slate-300">
                      ₹{telemetry[selectedMachine].status === 'healthy' ? '0' : '4,35,000'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/20 p-3 rounded-lg border border-slate-850 text-xs text-slate-300 font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Expert Reasoning</span>
                  <p className="leading-relaxed font-sans">
                    {telemetry[selectedMachine].status === 'healthy' ? (
                      "All predictive models agree that the machinery joints are operating in nominal health baselines. No preventative action required."
                    ) : (
                      "Maintenance is recommended because multiple independent indicators (spindle head thermal deviation, acoustic vibration signature) consistently suggest progressive bearing degradation."
                    )}
                  </p>
                  {telemetry[selectedMachine].status !== 'healthy' && (
                    <p className="font-sans text-[11px] font-bold text-emerald-400 mt-2">
                      Conclusion: Maintenance is recommended because multiple independent indicators consistently suggest progressive bearing degradation.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation Lifecycle */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <h4 className="font-display font-bold text-sm text-slate-200 mb-4">Enterprise Action Workflow</h4>
              <div className="relative border-l border-slate-700 ml-2 pl-4 space-y-4 text-xs font-medium">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-emerald-400">Detected & Analyzed</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-emerald-400">Recommendation Generated</span>
                </div>
                <div className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${telemetry[selectedMachine].status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                  <span className={telemetry[selectedMachine].status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}>{telemetry[selectedMachine].status === 'healthy' ? 'Approved' : 'Pending Executive Approval'}</span>
                </div>
                <div className="relative opacity-40">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <span className="text-slate-400">Maintenance Scheduled</span>
                </div>
                <div className="relative opacity-40">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                  <span className="text-slate-400">Savings Recorded</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/60 flex flex-col items-center justify-center h-full text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 mb-2 text-slate-600" />
            Select a machine on the grid to inspect.
          </div>
        )}
      </div>
    </div>
  );
}
