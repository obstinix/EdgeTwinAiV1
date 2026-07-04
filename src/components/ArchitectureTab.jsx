import React from "react";

export default function ArchitectureTab() {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">Deployment &amp; Innovation</h2>
        <p className="text-slate-400 text-sm">EdgeTwin Intelligence Engine™ architecture, technology readiness levels, and competitive differentiation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EdgeTwin Intelligence Engine™ */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 col-span-1">
          <h3 className="font-bold text-md font-display text-white mb-1">EdgeTwin Intelligence Engine™</h3>
          <p className="text-[11px] text-slate-400 mb-4">A proprietary multi-layer AI decision framework combining 6 intelligence disciplines into one cohesive pipeline.</p>
          
          {/* SVG Pipeline Diagram */}
          <svg viewBox="0 0 280 480" className="w-full max-h-96" style={{fontSize:11}}>
            {[
              {label:"Sensor Telemetry",sub:"Temperature · Vibration · RPM",color:"#64748b",y:0},
              {label:"AI Risk Engine",sub:"Logistic Deviation Model",color:"#f59e0b",y:60},
              {label:"Decision Engine",sub:"Multi-criteria Decision Analysis",color:"#6366f1",y:120},
              {label:"Business Optimizer",sub:"ROI · ROM · Cost-Benefit Analysis",color:"#10b981",y:180},
              {label:"Maintenance Planner",sub:"NLP Scheduling + Technician Dispatch",color:"#10b981",y:240},
              {label:"Savings Calculator",sub:"Live avoided-loss ledger",color:"#22d3ee",y:300},
              {label:"Learning Engine",sub:"Model weight adjustment + Audit log",color:"#a855f7",y:360},
              {label:"Future Recommendations",sub:"Proactive factory intelligence",color:"#f43f5e",y:420},
            ].map((node, i) => (
              <g key={i}>
                {i > 0 && <line x1="140" y1={node.y - 3} x2="140" y2={node.y + 3} stroke="#1e293b" strokeWidth="2"/>}
                <rect x="20" y={node.y + 6} width="240" height="44" rx="8" fill="#060913" stroke={node.color} strokeWidth="1.5" opacity="0.95"/>
                <text x="140" y={node.y + 24} textAnchor="middle" fill={node.color} fontWeight="700" fontSize="11">{node.label}</text>
                <text x="140" y={node.y + 38} textAnchor="middle" fill="#64748b" fontSize="9">{node.sub}</text>
                {i < 7 && (
                  <>
                    <line x1="140" y1={node.y + 52} x2="140" y2={node.y + 64} stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow)"/>
                    <polygon points={`135,${node.y+61} 145,${node.y+61} 140,${node.y+68}`} fill="#1e293b"/>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Right column: TRL + Competitive Advantage + Risk Mitigation */}
        <div className="col-span-1 space-y-5">
          
          {/* Technology Readiness Level */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm font-display text-white mb-3">Technology Readiness Level (TRL)</h4>
            <div className="space-y-3 text-xs">
              {[
                {label:"Predictive AI Model",trl:8,color:"bg-emerald-500",textColor:"text-emerald-400"},
                {label:"Edge Offline Inference",trl:8,color:"bg-emerald-500",textColor:"text-emerald-400"},
                {label:"Digital Twin Visualization",trl:7,color:"bg-emerald-500",textColor:"text-emerald-400"},
                {label:"OPC-UA Production Integration",trl:5,color:"bg-amber-500",textColor:"text-amber-400"},
                {label:"Cross-Factory Learning Federation",trl:4,color:"bg-amber-500",textColor:"text-amber-400"},
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className={`font-bold font-mono ${item.textColor}`}>TRL {item.trl}</span>
                  </div>
                  <div className="bg-slate-800 rounded-full h-1.5">
                    <div className={`h-full rounded-full ${item.color}`} style={{width:`${(item.trl/9)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Advantages */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm font-display text-white mb-3">Why EdgeTwin AI?</h4>
            <div className="space-y-2 text-xs">
              {[
                {icon:"⚡",title:"Edge AI Offline-First",desc:"Runs locally — no cloud dependency, no latency, no data leak risk"},
                {icon:"🧠",title:"Explainable AI (XAI)",desc:"Every decision justified with engineering evidence, not a black box"},
                {icon:"💰",title:"Business ROI Engine",desc:"Converts sensor data into rupee-level financial impact instantly"},
                {icon:"🔁",title:"Continuous Learning",desc:"Model weight adjustments based on accepted/rejected decisions"},
                {icon:"🏭",title:"OPC-UA / MQTT Ready",desc:"Designed to plug into PLC and SCADA systems in production"},
              ].map(item => (
                <div key={item.title} className="flex gap-2.5 p-2.5 bg-slate-900/40 rounded-lg border border-slate-850">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <div>
                    <span className="font-bold text-slate-200 block">{item.title}</span>
                    <span className="text-slate-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Mitigation Table */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm font-display text-white mb-3">Risk Mitigation Matrix</h4>
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="pb-2 text-left">Risk</th>
                  <th className="pb-2 text-left">Mitigation</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {[
                  {risk:"Network Outage",mitigation:"Full offline local inference",status:"RESOLVED"},
                  {risk:"Sensor Failure",mitigation:"Cross-machine redundancy check",status:"RESOLVED"},
                  {risk:"False Positive Alert",mitigation:"96% confidence threshold gate",status:"RESOLVED"},
                  {risk:"Model Drift",mitigation:"Continuous learning engine + audit log",status:"ACTIVE"},
                  {risk:"Data Privacy",mitigation:"On-premise deployment, zero cloud",status:"RESOLVED"},
                ].map(row => (
                  <tr key={row.risk}>
                    <td className="py-1.5 text-slate-300">{row.risk}</td>
                    <td className="py-1.5 text-slate-400">{row.mitigation}</td>
                    <td className="py-1.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${row.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Production Deployment Architecture */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <h4 className="font-bold text-sm font-display text-white mb-4">Production Deployment Architecture</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex flex-col items-center gap-1 text-xs font-mono text-slate-300">
              {[
                {label:"Industrial Machines",color:"text-slate-400"},
                {label:"↓"},
                {label:"PLC / OPC-UA",color:"text-amber-400"},
                {label:"↓"},
                {label:"MQTT / Modbus",color:"text-amber-400"},
                {label:"↓"},
                {label:"Edge Device",color:"text-indigo-400"},
                {label:"↓"},
                {label:"EdgeTwin AI Engine",color:"text-emerald-400"},
                {label:"↓"},
                {label:"Local AI Inference",color:"text-emerald-400"},
                {label:"↓"},
                {label:"Dashboard",color:"text-indigo-400"},
                {label:"↓"},
                {label:"Maintenance Team",color:"text-slate-300"},
              ].map((item, i) => (
                <span key={i} className={item.color || "text-slate-600"}>{item.label}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono block mb-2">Current Demo Source</span>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Simulated Telemetry (Vercel-safe)</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Local AI Inference (Frontend Engine)</div>
                <div className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Offline Financial Calculations</div>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono block mb-2">Supported Production Sources</span>
              <div className="space-y-1 text-xs text-slate-300">
                {["PLC","OPC-UA","MQTT","Modbus RTU","REST API","WebSocket Stream"].map(src => (
                  <div key={src} className="flex items-center gap-2"><span className="text-indigo-400">✓</span> {src}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Partners + Scalability Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enterprise Integration Partners */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6">
          <h4 className="font-bold text-sm font-display text-white mb-1">Enterprise Integration Partners</h4>
          <p className="text-[10px] text-slate-400 font-mono mb-4">Designed to connect with enterprise-grade industrial and IT systems out of the box.</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              {vendor:"Siemens PLC",category:"Control Systems",color:"text-sky-400"},
              {vendor:"Rockwell PLC",category:"Control Systems",color:"text-sky-400"},
              {vendor:"OPC-UA / MQTT",category:"Protocol Layer",color:"text-amber-400"},
              {vendor:"Azure IoT Edge",category:"Cloud Edge",color:"text-sky-400"},
              {vendor:"NVIDIA Jetson",category:"Edge AI Hardware",color:"text-emerald-400"},
              {vendor:"SAP PM",category:"ERP / Work Orders",color:"text-rose-400"},
              {vendor:"IBM Maximo",category:"Asset Management",color:"text-slate-400"},
              {vendor:"Modbus RTU",category:"Legacy Protocol",color:"text-slate-350"},
            ].map(item => (
              <div key={item.vendor} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850 flex flex-col gap-0.5">
                <span className={`font-bold font-mono text-[11px] ${item.color}`}>{item.vendor}</span>
                <span className="text-[10px] text-slate-500">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scalability Roadmap + TRL Maturity */}
        <div className="space-y-5">
          {/* TRL 5 → TRL 8 Maturity framing */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm font-display text-white mb-3">Deployment Maturity (TRL)</h4>
            <div className="flex items-center justify-between mb-3">
              <div className="text-center">
                <span className="text-2xl font-extrabold text-amber-400 font-display">TRL 5</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Current — Pilot Validation</p>
              </div>
              <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full relative">
                <div className="absolute inset-y-0 left-0 w-[56%] bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"/>
                <div className="absolute top-[-6px] left-[56%] w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"/>
              </div>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-emerald-400 font-display">TRL 8</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Target — System Qualified</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
              Validated in controlled simulation (TRL 5). Production integration targets TRL 8 with real PLC data within 6–12 months.
            </p>
          </div>

          {/* Scalability Roadmap */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <h4 className="font-bold text-sm font-display text-white mb-3">Scalability Roadmap</h4>
            <div className="space-y-2.5 text-xs font-mono">
              {[
                {phase:"Phase 1",label:"Single Factory",status:"NOW",color:"text-emerald-400",dot:"bg-emerald-500"},
                {phase:"Phase 2",label:"Multiple Production Lines",status:"Q3 2025",color:"text-amber-400",dot:"bg-amber-500"},
                {phase:"Phase 3",label:"Multiple Plant Sites",status:"Q1 2026",color:"text-sky-400",dot:"bg-sky-500"},
                {phase:"Phase 4",label:"Global Manufacturing Network",status:"2027+",color:"text-slate-400",dot:"bg-slate-500"},
              ].map((r,i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.dot}`}/>
                  <span className="text-slate-500 w-14 shrink-0">{r.phase}</span>
                  <span className={`flex-1 font-bold ${r.color}`}>{r.label}</span>
                  <span className="text-slate-500 shrink-0">{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
