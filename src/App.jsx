import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, ShieldAlert, Cpu, TrendingUp, Calendar, AlertCircle, 
  Send, Layers, BarChart2, DollarSign, Clock, Zap, Download, 
  CheckCircle, Play, Sparkles, RefreshCw, ChevronRight, HelpCircle, Volume2
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Cell, AreaChart, Area
} from "recharts";

// Helper to format markdown responses from the local copilot
const formatMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return <h4 key={idx} className="text-md font-bold text-slate-200 mt-4 mb-2 font-display flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400"/>{line.replace("### ", "")}</h4>;
    }
    if (line.startsWith("- ")) {
      const content = line.replace("- ", "");
      return (
        <li key={idx} className="ml-4 list-disc text-sm text-slate-300 my-1.5">
          {parseInlineFormatting(content)}
        </li>
      );
    }
    if (line.trim() === "") return <div key={idx} className="h-2" />;
    return <p key={idx} className="text-sm text-slate-300 my-1">{parseInlineFormatting(line)}</p>;
  });
};

const parseInlineFormatting = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-emerald-400 font-semibold">{part.replace(/\*\*/g, "")}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="bg-slate-800 text-amber-400 px-1 py-0.5 rounded text-xs font-mono">{part.replace(/`/g, "")}</code>;
    }
    return part;
  });
};

export default function App() {
  // Tab control
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Real-time state
  // Default mock telemetry — ensures charts & UI work on Vercel (no backend needed)
  const defaultTelemetry = {
    M1: { status: "healthy", anomaly_active: false, metrics: { temperature: 72, load: 64, vibration: 0.12, rpm: 1450 }, ai_prediction: { failure_probability: 1.4, rul_hours: 980, recommendation: "Continue Normal Operations", action: "monitor", feature_importances: { "Temperature": 42, "Vibration": 28, "Load Cycle": 18, "RPM Drift": 12 } }, name: "CNC Mill" },
    M2: { status: "warning", anomaly_active: true,  metrics: { temperature: 88, load: 81, vibration: 0.38, rpm: 1380 }, ai_prediction: { failure_probability: 13.7, rul_hours: 320, recommendation: "Schedule Inspection within 48 hrs", action: "inspect", feature_importances: { "Vibration": 51, "Temperature": 29, "Load Cycle": 14, "RPM Drift": 6 } }, name: "Injection Molder" },
    M3: { status: "critical", anomaly_active: true,  metrics: { temperature: 104, load: 97, vibration: 0.89, rpm: 1210 }, ai_prediction: { failure_probability: 97.5, rul_hours: 12, recommendation: "Replace Bearing Today", action: "urgent", feature_importances: { "Vibration": 63, "Temperature": 22, "Load Cycle": 10, "RPM Drift": 5 } }, name: "6-Axis Robot" },
    M4: { status: "healthy", anomaly_active: false, metrics: { temperature: 65, load: 52, vibration: 0.09, rpm: 960 },  ai_prediction: { failure_probability: 1.8, rul_hours: 1200, recommendation: "Continue Normal Operations", action: "monitor", feature_importances: { "Temperature": 38, "Load Cycle": 35, "Vibration": 17, "RPM Drift": 10 } }, name: "Air Compressor" },
    M5: { status: "healthy", anomaly_active: false, metrics: { temperature: 68, load: 71, vibration: 0.14, rpm: 720 },  ai_prediction: { failure_probability: 1.4, rul_hours: 850, recommendation: "Continue Normal Operations", action: "monitor", feature_importances: { "Load Cycle": 45, "Vibration": 30, "Temperature": 16, "RPM Drift": 9 } }, name: "Conveyor Belt" },
    M6: { status: "healthy", anomaly_active: false, metrics: { temperature: 70, load: 60, vibration: 0.11, rpm: 1100 }, ai_prediction: { failure_probability: 1.4, rul_hours: 1050, recommendation: "Continue Normal Operations", action: "monitor", feature_importances: { "Temperature": 40, "Vibration": 32, "Load Cycle": 20, "RPM Drift": 8 } }, name: "Hydraulic Press" },
  };
  const [telemetry, setTelemetry] = useState(defaultTelemetry);
  const [financials, setFinancials] = useState({
    cost_saved: 482000,
    downtime_prevented: 18.5,
    energy_saved: 342,
    hours_recovered: 12.0
  });
  const [failuresPrevented, setFailuresPrevented] = useState(4);
  const [expandedWhy, setExpandedWhy] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("M3"); // Default to M3 Robot Arm (showcase example)
  const [wsConnected, setWsConnected] = useState(false);

  // Walkthrough & Scenario states
  const [walkthroughStep, setWalkthroughStep] = useState(0); // 0 = inactive, 1-6 = steps
  const [projectionHorizon, setProjectionHorizon] = useState(0); // in hours: 0, 6, 12, 24, 72
  const [activeScenario, setActiveScenario] = useState("current"); // current, projected, best, worst, recommended
  const [aiLearningLog, setAiLearningLog] = useState([
    { timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), type: "System Audit", event: "Model weights updated with historical vibration patterns on CNC joint.", status: "optimized" },
    { timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), type: "Recommendation Ignored", event: "Air Compressor M4 standby shutoff deferred. Energy loss recorded.", status: "logged" }
  ]);
  const [decisionsAccepted, setDecisionsAccepted] = useState(14);
  const [decisionQualityScore, setDecisionQualityScore] = useState(94);
  const [approvedMachines, setApprovedMachines] = useState(new Set());
  const [esgMetrics, setEsgMetrics] = useState({
    energy_saved: 241,
    carbon_reduction: 31,
    annual_reduction: 4.8,
    score: "A+"
  });

  // Anomaly injector controls
  const [anomalyMachine, setAnomalyMachine] = useState("M1");
  const [anomalyType, setAnomalyType] = useState("bearing_vibration");
  const [simLabOpen, setSimLabOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // What-if simulator controls
  const [simMachine, setSimMachine] = useState("M3");
  const [simAction, setSimAction] = useState("postpone");
  const [simValue, setSimValue] = useState(48); // 48 hours postponed
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Copilot chatbot controls
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "copilot",
      text: "### 👋 EdgeTwin AI Copilot\n\nHello! I am your local Edge Twin Copilot. I can query our machines' physical sensors, model predictions, and financial databases to recommend optimal decisions.\n\nTry asking me:\n- *Why is Machine 3 overheating?*\n- *Which machine should be repaired first?*\n- *Show the most energy inefficient machine.*"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Offline TTS Speech Synthesis
  const speakResponse = (text) => {
    window.speechSynthesis.cancel();
    let cleanText = text
      .replace(/###\s+/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/-\s+/g, ", ")
      .replace(/\n+/g, " ");
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const synthVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Natural")) || 
                       voices.find(v => v.lang.startsWith("en"));
    if (synthVoice) utterance.voice = synthVoice;
    window.speechSynthesis.speak(utterance);
  };

  // SVG Machine Node Renderer for Floorplan
  const renderMachineNode = (mid, cx, cy, name) => {
    const data = telemetry[mid] || {};
    const status = data.status || "healthy";
    
    let strokeColor = "#10b981"; // Emerald
    let glowClass = "";
    if (status === "critical") {
      strokeColor = "#f43f5e"; // Rose
      glowClass = "animate-pulse";
    } else if (status === "warning") {
      strokeColor = "#f59e0b"; // Amber
    }
    
    const isSelected = selectedMachine === mid;

    // Derive concise fault reason label for floorplan badge
    let faultLabel = "";
    if (status !== "healthy") {
      const vib  = data.metrics?.vibration   || 0;
      const temp = data.metrics?.temperature || 0;
      const load = data.metrics?.load        || 0;
      if      (vib  > 0.5)           faultLabel = "BEARING WEAR";
      else if (vib  > 0.25)          faultLabel = "HIGH VIBRATION";
      else if (temp > 98)            faultLabel = "HIGH TEMP";
      else if (load > 90)            faultLabel = "MOTOR OVERLOAD";
      else if (status === "critical") faultLabel = "CRITICAL FAULT";
      else                           faultLabel = "INSPECT REQUIRED";
    }

    return (
      <g 
        key={mid}
        onClick={() => setSelectedMachine(mid)}
        className="cursor-pointer group"
      >
        {/* Hover Tooltip implementation via SVG title (simple native) */}
        <title>{`Asset: ${name}\nHealth: ${100 - (data.ai_prediction?.failure_probability || 0)}%\nRisk: ${data.ai_prediction?.failure_probability || 0}%\nTemp: ${data.metrics?.temperature}°C\nLoad: ${data.metrics?.load}%\nRUL: ${data.ai_prediction?.rul_hours} hrs`}</title>
        
        <rect 
          x={cx - 50} 
          y={cy - 40} 
          width="100" 
          height="80" 
          rx="10" 
          fill="#060913" 
          stroke={strokeColor} 
          strokeWidth={isSelected ? 2.5 : 1} 
          className="transition-all duration-300"
        />
        
        {/* Health % Indicator pill */}
        <rect x={cx - 24} y={cy - 54} width="48" height="20" rx="6" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
        <text x={cx} y={cy - 40} textAnchor="middle" fill={strokeColor} fontSize="12" fontWeight="900" className="font-mono tracking-wider">
          {Math.max(0, 100 - (data.ai_prediction?.failure_probability || 0)).toFixed(1).replace(/\.0$/, '')}%
        </text>
        
        {/* High-tech Warning corner marker */}
        {status !== "healthy" && (
          <g transform={`translate(${cx + 34}, ${cy - 26})`} className="animate-pulse">
            {/* Warning neon triangle */}
            <path d="M0 -6 L6 4 L-6 4 Z" fill={strokeColor} />
            {/* Inverted Exclamation Mark in warning */}
            <rect x="-0.6" y="-3.5" width="1.2" height="3" fill="#000" rx="0.2" />
            <circle cx="0" cy="1" r="0.8" fill="#000" />
          </g>
        )}
        
        {/* Glowing node center */}
        <circle 
          cx={cx} 
          cy={cy} 
          r="20" 
          fill="#0a0e17" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
        />
        
        <text 
          x={cx} 
          y={cy + 5} 
          textAnchor="middle" 
          fill="#f8fafc" 
          fontSize="13" 
          fontWeight="900" 
          className="font-mono tracking-wide"
        >
          {mid}
        </text>
        
        <text 
          x={cx} 
          y={cy + 56} 
          textAnchor="middle" 
          fill="#e2e8f0" 
          fontSize="12" 
          fontWeight="800" 
          className="font-display uppercase tracking-widest drop-shadow-md"
        >
          {name}
        </text>
        {faultLabel && (
          <text
            x={cx}
            y={cy + 70}
            textAnchor="middle"
            fill={status === "critical" ? "#f43f5e" : "#f59e0b"}
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            ⚠ {faultLabel}
          </text>
        )}
      </g>
    );
  };

  // Scenario Projection Engine calculator
  const projectTimeline = (hours, scenario) => {
    let factoryHealth = 99;
    let m3Prob = 97.5;
    let energyConsumption = 342; // kWh baseline
    let productionOutput = 100; // % baseline
    let financialLoss = 0; // ₹
    
    if (scenario === "current" || scenario === "projected") {
      m3Prob = Math.min(99.9, 97.5 + hours * 0.1);
      if (hours === 0) {
        factoryHealth = 85;
        financialLoss = 0;
      } else if (hours === 6) {
        factoryHealth = 74;
        energyConsumption = 368;
        productionOutput = 95;
        financialLoss = 150000;
      } else if (hours === 12) {
        factoryHealth = 58;
        energyConsumption = 392;
        productionOutput = 82;
        financialLoss = 280000;
      } else if (hours === 24) {
        factoryHealth = 35;
        energyConsumption = 412;
        productionOutput = 55;
        financialLoss = 435000;
      } else { // 72 hours (3 Days)
        factoryHealth = 12;
        energyConsumption = 450;
        productionOutput = 20;
        financialLoss = 850000;
      }
    } else if (scenario === "best") {
      m3Prob = Math.max(1.4, 97.5 - hours * 15);
      factoryHealth = Math.min(99, 85 + hours * 4);
      energyConsumption = Math.max(320, 342 - hours * 1.5);
      productionOutput = 100;
      financialLoss = 18000;
    } else if (scenario === "worst") {
      m3Prob = Math.min(99.9, 97.5 + hours * 0.5);
      if (hours === 0) {
        factoryHealth = 80;
        financialLoss = 0;
      } else if (hours === 6) {
        factoryHealth = 60;
        energyConsumption = 385;
        productionOutput = 85;
        financialLoss = 240000;
      } else if (hours === 12) {
        factoryHealth = 30;
        energyConsumption = 420;
        productionOutput = 60;
        financialLoss = 490000;
      } else if (hours === 24) {
        factoryHealth = 15;
        energyConsumption = 460;
        productionOutput = 30;
        financialLoss = 820000;
      } else {
        factoryHealth = 4;
        energyConsumption = 510;
        productionOutput = 5;
        financialLoss = 1450000;
      }
    } else if (scenario === "recommended") {
      if (hours < 12) {
        m3Prob = Math.min(98.5, 97.5 + hours * 0.05);
        factoryHealth = 82;
        energyConsumption = 345;
        productionOutput = 98;
        financialLoss = 50000;
      } else {
        m3Prob = 1.4;
        factoryHealth = 99;
        energyConsumption = 328;
        productionOutput = 100;
        financialLoss = 18000;
      }
    }

    return {
      factoryHealth,
      m3Prob: parseFloat(m3Prob.toFixed(1)),
      energyConsumption: Math.round(energyConsumption),
      productionOutput: parseFloat(productionOutput.toFixed(1)),
      financialLoss: Math.round(financialLoss)
    };
  };

  // Custom What-If Projection Data Generator
  const getSimProjectionData = () => {
    if (!simResult) return [];
    
    const base = telemetry[simMachine] || {};
    const health = base.health_score || 95;
    
    // Machine financial base values
    const financialBases = {
      M1: { planned: 15000, failure_total: 180000 + (60000 * 5.0) },
      M2: { planned: 25000, failure_total: 240000 + (80000 * 6.0) },
      M3: { planned: 18000, failure_total: 210000 + (80000 * 6.0) },
      M4: { planned: 10000, failure_total: 110000 + (40000 * 4.0) },
      M5: { planned: 8000, failure_total: 90000 + (50000 * 3.0) },
      M6: { planned: 20000, failure_total: 220000 + (90000 * 5.0) }
    };
    
    const fBase = financialBases[simMachine] || { planned: 15000, failure_total: 300000 };
    
    if (simAction === "postpone") {
      return [0, 24, 48, 72, 96, 120].map(h => {
        const current_risk = 100.0 - health;
        const prob = Math.min(99.5, current_risk + (h * 1.3));
        const expected_loss = Math.round((prob / 100.0) * fBase.failure_total);
        return {
          hours: `${h}h`,
          "Expected Loss (INR)": expected_loss,
          "Planned Repair (INR)": fBase.planned
        };
      });
    } else {
      return [1, 3, 6, 9, 12].map(h => {
        const planned_loss_rate = (fBase.failure_total - fBase.planned) / 30.0;
        const prod_loss = Math.round(planned_loss_rate * 0.35 * h);
        const total_planned_cost = fBase.planned + prod_loss;
        return {
          hours: `${h}h`,
          "Controlled Stop Cost (INR)": total_planned_cost,
          "Standby Energy Saved (INR)": Math.round(h * 15 * 10)
        };
      });
    }
  };

  // Custom historical metrics simulator for charts
  const [historyData, setHistoryData] = useState([]);

  // Setup WebSocket connection and API polling fallbacks
  useEffect(() => {
    let ws;
    let fallbackInterval;
    
    const connectWS = () => {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/ws/telemetry`;
      
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log("WebSocket connected to EdgeTwin backend");
        setWsConnected(true);
        if (fallbackInterval) clearInterval(fallbackInterval);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.telemetry) setTelemetry(data.telemetry);
        if (data.financials) setFinancials(data.financials);
      };
      
      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        setWsConnected(false);
        // Fallback to active HTTP polling if WS fails
        startFallbackPolling();
        setTimeout(connectWS, 3000);
      };
    };

    const startFallbackPolling = () => {
      fetchData();
      fallbackInterval = setInterval(fetchData, 2000);
    };

    const fetchData = async () => {
      try {
        const mRes = await fetch("/api/machines");
        if (mRes.ok) {
          const mData = await mRes.json();
          setTelemetry(mData);
        }
        
        const fRes = await fetch("/api/financials");
        if (fRes.ok) {
          const fData = await fRes.json();
          setFinancials(fData);
        }
      } catch (err) {
        console.error("Error polling api fallbacks:", err);
      }
    };

    connectWS()
    fetchIncidents();
    fetchSchedule();

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // Live telemetry ticker — fluctuates sensor values every 2s so chart stays animated
  // even without a backend (Vercel-safe)
  useEffect(() => {
    const ticker = setInterval(() => {
      setTelemetry(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(mid => {
          const m = { ...next[mid] };
          const metrics = { ...m.metrics };
          // Small random fluctuation to simulate real sensor noise
          metrics.temperature = parseFloat((metrics.temperature + (Math.random() - 0.48) * 0.6).toFixed(1));
          metrics.vibration = parseFloat(Math.max(0.01, metrics.vibration + (Math.random() - 0.48) * 0.008).toFixed(3));
          metrics.load = parseFloat(Math.min(100, Math.max(10, metrics.load + (Math.random() - 0.48) * 0.5)).toFixed(1));
          m.metrics = metrics;
          next[mid] = m;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(ticker);
  }, []);

  // Fetch incidents list
  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents?all_logs=true");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch maintenance schedule
  const fetchSchedule = async () => {
    try {
      const res = await fetch("/api/maintenance");
      if (res.ok) {
        const data = await res.json();
        setSchedule(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run What-If simulation — pure frontend calculation, no backend needed
  const runSimulation = () => {
    setSimLoading(true);
    const machine = telemetry[simMachine] || {};
    const failureProb = machine.ai_prediction?.failure_probability || 5;
    const baseTemp = machine.metrics?.temperature || 75;
    const baseLoad = machine.metrics?.load || 60;
    
    // Financial base values per machine
    const financialBases = {
      M1: { planned: 15000, failure_total: 280000 },
      M2: { planned: 25000, failure_total: 360000 },
      M3: { planned: 18000, failure_total: 420000 },
      M4: { planned: 10000, failure_total: 200000 },
      M5: { planned: 8000, failure_total: 190000 },
      M6: { planned: 20000, failure_total: 310000 },
    };
    const fBase = financialBases[simMachine] || { planned: 15000, failure_total: 300000 };
    const hours = parseFloat(simValue);

    let result;
    if (simAction === "postpone") {
      const riskAtEnd = Math.min(99, failureProb + hours * 0.8);
      const estimated_financial_loss = Math.round((riskAtEnd / 100) * fBase.failure_total);
      result = {
        failure_risk: riskAtEnd.toFixed(1),
        estimated_financial_loss,
        expected_downtime_hours: Math.round(hours * 0.6),
        delivery_delay_risk: riskAtEnd > 60 ? "HIGH" : riskAtEnd > 30 ? "MEDIUM" : "LOW",
        additional_energy_consumption_pct: (hours * 0.15).toFixed(1),
        justification: `Postponing maintenance on ${simMachine} by ${hours}h increases bearing failure risk from ${failureProb}% to ${riskAtEnd.toFixed(1)}%. Estimated production loss: ₹${estimated_financial_loss.toLocaleString()}. Recommend scheduling preventive maintenance before risk threshold breach.`
      };
    } else {
      const prod_loss_per_hr = fBase.failure_total * 0.002;
      const controlled_cost = Math.round(fBase.planned + prod_loss_per_hr * hours);
      const energy_saved_kwh = Math.round(hours * (baseLoad * 0.5));
      result = {
        failure_risk: Math.max(0, failureProb - hours * 2).toFixed(1),
        net_financial_impact: controlled_cost,
        expected_downtime_hours: hours,
        delivery_delay_risk: hours > 8 ? "MEDIUM" : "LOW",
        energy_saved_kwh,
        justification: `Planned ${hours}h shutdown of ${simMachine} will cost ₹${controlled_cost.toLocaleString()} in production idle time but saves ${energy_saved_kwh} kWh and reduces failure probability by ~${(hours * 2).toFixed(0)}%. Net savings vs reactive repair: ₹${(fBase.failure_total - controlled_cost).toLocaleString()}.`
      };
    }
    
    setTimeout(() => {
      setSimResult(result);
      setSimLoading(false);
    }, 600); // Simulate brief compute time for UX
  };

  // Auto-run simulation on slider change
  useEffect(() => {
    if (activeTab === "whatif") {
      runSimulation();
    }
  }, [simMachine, simAction, simValue, activeTab]);

  // Generate historical data array for Recharts based on selected machine metrics
  useEffect(() => {
    if (!telemetry[selectedMachine]) return;
    const baseTemp = telemetry[selectedMachine].metrics.temperature;
    const baseVib = telemetry[selectedMachine].metrics.vibration;
    
    // Create 15 data points representing historical trend
    const points = Array.from({ length: 15 }, (_, i) => {
      const label = `${14 - i}m ago`;
      const timeVal = i;
      
      // Let it ramp up if anomaly is active in the last points
      const hasAnomaly = telemetry[selectedMachine].anomaly_active;
      let temp = baseTemp + (Math.sin(i / 2) * 1.5);
      let vib = baseVib + (Math.cos(i / 3) * 0.1);
      
      if (hasAnomaly && i > 9) {
        temp = baseTemp - (14 - i) * 3.0 + randomOffset(1);
        vib = baseVib - (14 - i) * 0.2 + randomOffset(0.05);
      }
      
      return {
        name: label,
        temperature: parseFloat(temp.toFixed(1)),
        vibration: parseFloat(vib.toFixed(2))
      };
    });
    setHistoryData(points);
  }, [selectedMachine, telemetry]);

  const randomOffset = (scale) => (Math.random() - 0.5) * scale;

  // Optimize Maintenance Schedule Local Fallback
  const optimizeScheduleLocal = () => {
    const optimized = [
      {
        id: "slot_m3",
        machine_id: "M3",
        machine_name: "6-Axis Robot (M3)",
        scheduled_time: new Date(Date.now() + 3600000 * 2).toISOString(),
        assigned_engineer: "Engineer 2 (Joint & Motor Specialist)",
        required_parts: "Joint Bearings (HB-40), Lubricant",
        priority: "CRITICAL",
        maintenance_cost: 18000,
        failure_cost_avoided: 435000,
        net_savings: 417000,
        justification: "Critical bearing vibration trend. Failure imminent within 12 hours. Immediate night shift repair avoids ₹4.17 Lakh in losses."
      },
      {
        id: "slot_m2",
        machine_id: "M2",
        machine_name: "Injection Molder (M2)",
        scheduled_time: new Date(Date.now() + 3600000 * 6).toISOString(),
        assigned_engineer: "Engineer 1 (Hydraulics Expert)",
        required_parts: "Motor Seals, Hydraulic Fluid",
        priority: "HIGH",
        maintenance_cost: 25000,
        failure_cost_avoided: 360000,
        net_savings: 335000,
        justification: "Elevated motor stress and vibration. Preventative maintenance before seal rupture prevents ₹3.35 Lakh loss."
      },
      {
        id: "slot_m1",
        machine_id: "M1",
        machine_name: "CNC Mill (M1)",
        scheduled_time: new Date(Date.now() + 3600000 * 18).toISOString(),
        assigned_engineer: "Engineer 3 (CNC Systems Tech)",
        required_parts: "Calibration Toolset",
        priority: "MEDIUM",
        maintenance_cost: 15000,
        failure_cost_avoided: 280000,
        net_savings: 265000,
        justification: "Spindle drift detected. Scheduling off-peak morning shift calibration avoids ₹2.65 Lakh failure risk."
      }
    ];

    const activeSchedule = optimized.filter(slot => telemetry[slot.machine_id]?.status !== "healthy");
    setSchedule(activeSchedule);
  };

  // Optimize Maintenance Schedule
  const optimizeSchedule = async () => {
    try {
      const res = await fetch("/api/maintenance/optimize", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.schedule) {
          setSchedule(data.schedule);
          fetchIncidents();
          return;
        }
      }
    } catch (e) {
      console.warn("API optimization failed, running local engine:", e);
    }
    optimizeScheduleLocal();
  };

  // Complete Maintenance Task Local Fallback
  const completeTaskLocal = (slotId) => {
    const slot = schedule.find(s => s.id === slotId) || {};
    const mid = slot.machine_id || "M3";

    setSchedule(prev => prev.map(s => s.id === slotId ? { ...s, status: "completed" } : s));

    setTelemetry(prev => {
      const next = { ...prev };
      if (next[mid]) {
        next[mid] = {
          ...next[mid],
          status: "healthy",
          anomaly_active: false,
          metrics: {
            ...next[mid].metrics,
            temperature: mid === "M3" ? 70 : (mid === "M2" ? 72 : next[mid].metrics.temperature),
            vibration: mid === "M3" ? 0.05 : (mid === "M2" ? 0.12 : next[mid].metrics.vibration),
            load: mid === "M3" ? 60 : (mid === "M2" ? 64 : next[mid].metrics.load)
          },
          ai_prediction: {
            ...next[mid].ai_prediction,
            failure_probability: 1.4,
            rul_hours: 1000,
            recommendation: "Continue Normal Operations",
            action: "monitor"
          }
        };
      }
      return next;
    });

    const newInc = {
      id: "inc_comp_" + Date.now(),
      machine_id: mid,
      timestamp: new Date().toISOString(),
      type: "Maintenance Completed",
      action_taken: `Technician successfully performed scheduled maintenance for ${machineNamesMap[mid]}. Spares calibrated.`,
      resolved: true
    };
    setIncidents(prev => [newInc, ...prev]);

    if (walkthroughStep === 5 && mid === "M3") {
      setWalkthroughStep(6);
      setActiveTab("dashboard");
    }
  };

  // Complete Maintenance Task
  const completeTask = async (slotId) => {
    try {
      const res = await fetch("/api/maintenance/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId, status: "completed" })
      });
      if (res.ok) {
        fetchSchedule();
        fetchIncidents();
        const mRes = await fetch("/api/machines");
        if (mRes.ok) {
          setTelemetry(await mRes.json());
          return;
        }
      }
    } catch (e) {
      console.warn("API completeTask failed, running local engine:", e);
    }
    completeTaskLocal(slotId);
  };

  // Inject Anomaly Local Fallback
  const injectAnomalyLocal = (mid, type) => {
    setTelemetry(prev => {
      const next = { ...prev };
      if (next[mid]) {
        next[mid] = {
          ...next[mid],
          status: mid === "M3" ? "critical" : "warning",
          anomaly_active: true,
          metrics: {
            ...next[mid].metrics,
            temperature: mid === "M3" ? 104 : 88,
            vibration: mid === "M3" ? 0.89 : 0.38,
            load: mid === "M3" ? 97 : 81
          },
          ai_prediction: {
            ...next[mid].ai_prediction,
            failure_probability: mid === "M3" ? 97.5 : 13.7,
            rul_hours: mid === "M3" ? 12 : 320,
            recommendation: mid === "M3" ? "Replace Bearing Today" : "Schedule Inspection within 48 hrs"
          }
        };
      }
      return next;
    });

    const newInc = {
      id: "inc_inj_" + Date.now(),
      machine_id: mid,
      timestamp: new Date().toISOString(),
      type: "Fault Simulation",
      action_taken: `Simulated anomaly (${type}) injected. Dispatching alerts to Edge diagnostic nodes.`,
      resolved: false
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  // Inject Anomaly
  const injectAnomaly = async () => {
    try {
      const res = await fetch("/api/inject-anomaly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machine_id: anomalyMachine,
          anomaly_type: anomalyType
        })
      });
      if (res.ok) {
        fetchIncidents();
        return;
      }
    } catch (e) {
      console.warn("API inject failed, running local engine:", e);
    }
    injectAnomalyLocal(anomalyMachine, anomalyType);
  };

  // Reset All Local Fallback
  const resetAllLocal = () => {
    setTelemetry(defaultTelemetry);
    setSchedule([]);
    setWalkthroughStep(0);
    setFinancials({
      cost_saved: 482000,
      downtime_prevented: 18.5,
      energy_saved: 342,
      hours_recovered: 12.0
    });
    setFailuresPrevented(4);
    setDecisionsAccepted(14);
    setDecisionQualityScore(94);
  };

  // Reset All Machines
  const resetAllMachines = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        fetchIncidents();
        fetchSchedule();
        const mRes = await fetch("/api/machines");
        if (mRes.ok) {
          setTelemetry(await mRes.json());
          return;
        }
      }
    } catch (e) {
      console.warn("API reset failed, running local engine:", e);
    }
    resetAllLocal();
  };

  // Approve Recommendation / Workflow Integration
  const approveRecommendation = (mid) => {
    setTelemetry(prev => {
      const next = { ...prev };
      if (next[mid]) {
        next[mid] = {
          ...next[mid],
          status: "healthy",
          anomaly_active: false,
          metrics: {
            ...next[mid].metrics,
            temperature: mid === "M3" ? 70 : next[mid].metrics.temperature,
            vibration: mid === "M3" ? 0.05 : next[mid].metrics.vibration,
            load: mid === "M3" ? 60 : next[mid].metrics.load
          },
          ai_prediction: {
            ...next[mid].ai_prediction,
            failure_probability: 1.4,
            rul_hours: 1000,
            recommendation: "Continue Normal Operations",
            action: "monitor"
          }
        };
      }
      return next;
    });

    setApprovedMachines(prev => new Set([...prev, mid]));
    setDecisionsAccepted(prev => prev + 1);
    setFailuresPrevented(prev => prev + 1);
    
    let savings = 0;
    let downtime = 0;
    if (mid === "M3") {
      savings = 417000;
      downtime = 6.0;
    } else if (mid === "M2") {
      savings = 335000;
      downtime = 4.0;
    } else {
      savings = 265000;
      downtime = 3.0;
    }

    setFinancials(prev => ({
      ...prev,
      cost_saved: prev.cost_saved + savings,
      downtime_prevented: parseFloat((prev.downtime_prevented + downtime).toFixed(1))
    }));

    const newSlot = {
      id: "slot_" + mid + "_" + Date.now(),
      machine_id: mid,
      machine_name: machineNamesMap[mid],
      scheduled_time: new Date(Date.now() + 3600000 * 2).toISOString(),
      assigned_engineer: "Engineer 2 (Joint & Motor Specialist)",
      required_parts: "Joint Bearings (HB-40), Lubricant",
      priority: mid === "M3" ? "CRITICAL" : "HIGH",
      justification: "Approved by Plant Executive. Maintenance scheduled.",
      status: "scheduled",
      maintenance_cost: mid === "M3" ? 18000 : 25000,
      failure_cost_avoided: mid === "M3" ? 435000 : 360000,
      net_savings: savings
    };
    setSchedule(prev => [newSlot, ...prev]);

    const newInc = {
      id: "inc_" + Date.now(),
      machine_id: mid,
      timestamp: new Date().toISOString(),
      type: "AI Preventive Dispatch",
      action_taken: `Executive approved maintenance for ${machineNamesMap[mid]}. Avoided ₹${(savings + 18000).toLocaleString()} total risk.`,
      resolved: true
    };
    setIncidents(prev => [newInc, ...prev]);

    setDecisionQualityScore(prev => Math.min(100, prev + 1));

    setAiLearningLog(prev => [
      {
        timestamp: new Date().toISOString(),
        type: "Recommendation Accepted",
        event: `Decision to repair M3 dispatched. Scheduled tonight 22:00. Net Savings: ₹${savings.toLocaleString()}.`,
        status: "success"
      },
      ...prev
    ]);

    setChatHistory(prev => [
      ...prev,
      {
        sender: "copilot",
        text: `### ✅ Autonomous Dispatch Completed\n\nI have successfully logged your approval for **${machineNamesMap[mid]}** and scheduled maintenance. The incident log has been updated, and the expected downtime savings of **₹${savings.toLocaleString()}** have been recorded in our ledger.`
      }
    ]);

    if (walkthroughStep === 4 && mid === "M3") {
      setWalkthroughStep(5);
      // Don't auto-navigate — let user see the Dispatched confirmation first
    }
  };

  // Send Copilot Query
  const sendCopilotQuery = async (queryText) => {
    const text = queryText || chatQuery;
    if (!text.trim()) return;

    setChatHistory(prev => [...prev, { sender: "user", text }]);
    setChatQuery("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { sender: "copilot", text: data.answer }]);
        setChatLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Failed to connect to backend copilot API, running local engine:", e);
    }
    sendCopilotQueryLocal(text);
  };

  const sendCopilotQueryLocal = (text) => {
    const answer = respondToCopilotQueryLocal(text);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: "copilot", text: answer }]);
      setChatLoading(false);
    }, 500);
  };

  const respondToCopilotQueryLocal = (query) => {
    const q = query.toLowerCase();
    
    const MACHINE_MAP = {
      "1": "M1", "cnc": "M1", "mill": "M1", "m1": "M1",
      "2": "M2", "molder": "M2", "injection": "M2", "m2": "M2",
      "3": "M3", "robot": "M3", "arm": "M3", "m3": "M3",
      "4": "M4", "compressor": "M4", "air": "M4", "m4": "M4",
      "5": "M5", "conveyor": "M5", "smart": "M5", "m5": "M5",
      "6": "M6", "press": "M6", "hydraulic": "M6", "m6": "M6"
    };

    const MACHINE_NAMES = {
      M1: "CNC Mill (M1)",
      M2: "Injection Molder (M2)",
      M3: "6-Axis Robot Arm (M3)",
      M4: "Air Compressor (M4)",
      M5: "Smart Conveyor (M5)",
      M6: "Hydraulic Press (M6)"
    };

    const MACHINE_FINANCIAL_BASES = {
      M1: { name: "CNC Mill", planned_maint_cost: 15000, failure_repair_cost: 180000, production_loss_per_hour: 60000, downtime_hours_unplanned: 5.0, power_kw: 15.0 },
      M2: { name: "Injection Molder", planned_maint_cost: 25000, failure_repair_cost: 240000, production_loss_per_hour: 80000, downtime_hours_unplanned: 6.0, power_kw: 25.0 },
      M3: { name: "6-Axis Robot Arm", planned_maint_cost: 18000, failure_repair_cost: 210000, production_loss_per_hour: 80000, downtime_hours_unplanned: 6.0, power_kw: 8.0 },
      M4: { name: "Air Compressor", planned_maint_cost: 10000, failure_repair_cost: 110000, production_loss_per_hour: 40000, downtime_hours_unplanned: 4.0, power_kw: 30.0 },
      M5: { name: "Smart Conveyor", planned_maint_cost: 8000, failure_repair_cost: 90000, production_loss_per_hour: 50000, downtime_hours_unplanned: 3.0, power_kw: 5.0 },
      M6: { name: "Hydraulic Press", planned_maint_cost: 20000, failure_repair_cost: 220000, production_loss_per_hour: 90000, downtime_hours_unplanned: 5.0, power_kw: 40.0 }
    };

    const calculateRecommendationRoiLocal = (mid, failureProb) => {
      const base = MACHINE_FINANCIAL_BASES[mid];
      if (!base) return {};
      const probFactor = failureProb / 100.0;
      const maintCost = base.planned_maint_cost;
      const failureRepair = base.failure_repair_cost;
      const prodLoss = Math.round(base.production_loss_per_hour * base.downtime_hours_unplanned * probFactor);
      const expectedFailure = Math.round(failureRepair * probFactor);
      const netSavings = Math.max(0, Math.round((expectedFailure + prodLoss) - maintCost));
      const rom = maintCost > 0 ? Math.round((netSavings / maintCost) * 100) : 0;
      return {
        planned_maintenance_cost: maintCost,
        estimated_failure_repair_cost: failureRepair,
        expected_production_loss: prodLoss,
        net_savings: netSavings,
        return_on_maintenance: rom
      };
    };

    const runWhatIfSimulationLocal = (mid, action, value) => {
      const base = MACHINE_FINANCIAL_BASES[mid];
      if (!base) return {};
      if (action === "shutdown") {
        const shutdownHours = parseFloat(value);
        const prodLoss = Math.round(base.production_loss_per_hour * 0.35 * shutdownHours);
        const energySavedKwh = base.power_kw * shutdownHours;
        const energySavedCost = Math.round(energySavedKwh * 10);
        const totalPlannedCost = base.planned_maint_cost + prodLoss;
        const netImpact = totalPlannedCost - energySavedCost;
        const justification = `A controlled ${shutdownHours}-hour shutdown prevents a sudden failure. Planned production loss is minimized to ₹${prodLoss.toLocaleString()} (compared to ₹${(base.production_loss_per_hour * base.downtime_hours_unplanned).toLocaleString()} if it fails). We also save ${energySavedKwh.toFixed(1)} kWh of electricity, worth ₹${energySavedCost.toLocaleString()}.`;
        return {
          production_loss: prodLoss,
          energy_saved_kwh: energySavedKwh,
          energy_saved_cost: energySavedCost,
          net_financial_impact: netImpact,
          delivery_delay_risk: shutdownHours > 4 ? "LOW" : "NONE",
          justification: justification
        };
      }
      return {};
    };

    // Intent 1: Check specific machine parameters
    const checkKeys = ["why", "overheat", "hot", "problem", "issue", "status", "health"];
    const hasCheckKey = checkKeys.some(k => q.includes(k));
    const targetKey = Object.keys(MACHINE_MAP).find(k => q.includes(k));
    
    if (hasCheckKey && targetKey) {
      const mid = MACHINE_MAP[targetKey];
      if (telemetry[mid]) {
        const mdata = telemetry[mid];
        const metrics = mdata.metrics || {};
        const aiPred = mdata.ai_prediction || {};
        const name = MACHINE_NAMES[mid];
        const temp = metrics.temperature || 0;
        const vib = metrics.vibration || 0;
        const load = metrics.load || 0;
        const prob = aiPred.failure_probability || 0;
        const rul = aiPred.rul_hours || 0;
        const health = Math.max(0, 100 - prob);
        const roi = calculateRecommendationRoiLocal(mid, prob);

        let response = `### 🔍 Diagnostics for **${name}**\n\n`;
        response += `**Current State:**\n`;
        response += `- **Health Score:** \`${health.toFixed(1).replace(/\.0$/, '')}%\` (${mdata.status.toUpperCase()})\n`;
        response += `- **Temperature:** \`${temp}°C\` | **Vibration:** \`${vib} mm/s\`\n`;
        response += `- **Operating Load:** \`${load}%\` | **Running Hours:** \`${mdata.runtime_hours || 840} hrs\`\n\n`;

        response += `**Edge AI Analysis:**\n`;
        response += `- **Failure Probability:** \`${prob.toFixed(1).replace(/\.0$/, '')}%\` chance of breakdown within the next shift.\n`;
        response += `- **Remaining Useful Life (RUL):** \`${rul} hours\` remaining.\n`;
        response += `- **XAI Focus:** ${aiPred.explanation || `Elevated vibration indicating possible bearing wear.`}\n\n`;

        if (prob > 35) {
          response += `💡 **Recommended Decision:**\n`;
          response += `Schedule preventive service immediately. Doing so will cost **₹${roi.planned_maintenance_cost.toLocaleString()}**, `;
          response += `but prevents a major failure cost of **₹${roi.estimated_failure_repair_cost.toLocaleString()}** and **₹${roi.expected_production_loss.toLocaleString()}** in lost output.\n`;
          response += `**Net Decision Value:** Savings of **₹${roi.net_savings.toLocaleString()}** (ROM: \`${roi.return_on_maintenance}%\`).`;
        } else {
          response += `💡 **Recommended Decision:**\n`;
          response += `No immediate maintenance is required. Keep running normal operations. Energy efficiency is currently stable.`;
        }
        return response;
      }
    }

    // Intent 2: Priority list
    if (q.includes("repair") || q.includes("service") || q.includes("fix") || q.includes("first") || q.includes("prioritize") || q.includes("critical") || q.includes("worst")) {
      const sortedMachines = Object.entries(telemetry).map(([mid, mdata]) => ({
        mid,
        mdata,
        prob: mdata.ai_prediction?.failure_probability || 0.0
      })).sort((a, b) => b.prob - a.prob);

      const highest = sortedMachines[0];
      const highestRoi = calculateRecommendationRoiLocal(highest.mid, highest.prob);

      let response = `### 🛠️ Maintenance Priority Recommendation\n\n`;
      response += `Our local Edge AI suggests servicing **${MACHINE_NAMES[highest.mid]}** first.\n\n`;
      response += `**Risk Summary:**\n`;

      for (const { mid, mdata, prob } of sortedMachines) {
        const mstatus = mdata.status || "healthy";
        const emoji = mstatus === "critical" ? "🔴" : (mstatus === "warning" ? "🟡" : "🟢");
        const mrul = mdata.ai_prediction?.rul_hours || 200;
        response += `- ${emoji} **${MACHINE_NAMES[mid]}**: Failure Risk \`${prob.toFixed(1).replace(/\.0$/, '')}%\` | RUL \`${mrul} hrs\`\n`;
      }

      response += `\n**Urgent Action ROI Details (${highest.mid}):**\n`;
      response += `- **Planned Service Cost:** ₹${highestRoi.planned_maintenance_cost.toLocaleString()}\n`;
      response += `- **Unplanned Failure Avoided:** ₹${highestRoi.estimated_failure_repair_cost.toLocaleString()}\n`;
      response += `- **Production Loss Avoided:** ₹${highestRoi.expected_production_loss.toLocaleString()}\n`;
      response += `- 💰 **Net Savings for Factory:** **₹${highestRoi.net_savings.toLocaleString()}**\n`;
      response += `- **Return on Maintenance (ROM):** \`${highestRoi.return_on_maintenance}%\``;
      return response;
    }

    // Intent 3: Energy
    if (q.includes("energy") || q.includes("inefficient") || q.includes("waste") || q.includes("power") || q.includes("opportunity") || q.includes("save")) {
      const sortedIneff = Object.entries(telemetry).map(([mid, mdata]) => {
        let ineff = mdata.ai_prediction?.energy_inefficiency;
        if (ineff === undefined) {
          ineff = mdata.status === "critical" ? 84 : (mdata.status === "warning" ? 58 : 12);
        }
        return { mid, mdata, ineff };
      }).sort((a, b) => b.ineff - a.ineff);

      let response = `### ⚡ Energy & Efficiency Optimization Insights\n\n`;
      response += `Here are the top opportunities detected by the Edge AI to reduce power waste:\n\n`;

      for (const { mid, mdata, ineff } of sortedIneff) {
        const load = mdata.metrics?.load || 0.0;
        const energy = mdata.metrics?.energy || (load * 4.2);
        const emoji = ineff > 50 ? "⚠️" : "✅";
        response += `${emoji} **${MACHINE_NAMES[mid]}**:\n`;
        response += `  - Inefficiency Index: \`${ineff}%\` | Current Load: \`${load}%\` | Power Consumption: \`${energy.toFixed(1)} kWh\`\n`;

        if (ineff > 50) {
          response += `  - *Reason:* High power draw relative to mechanical output. Check for friction build-up or motor stator misalignment.\n`;
          response += `  - *Decision:* Clean/lubricate spindle and re-align bearings. Estimated daily energy savings: **₹1,200**.\n`;
        } else {
          response += `  - *Reason:* Performing within nominal power factor bands.\n`;
        }
      }
      return response;
    }

    // Intent 4: Tomorrow
    if (q.includes("tomorrow") || q.includes("continue") || q.includes("production") || q.includes("shift") || q.includes("safe")) {
      const criticalMachines = Object.entries(telemetry)
        .filter(([_, mdata]) => mdata.status === "critical" || (mdata.ai_prediction?.failure_probability || 0) > 70)
        .map(([mid]) => mid);

      let response = `### 📅 Production Continuity Assessment\n\n`;
      if (criticalMachines.length === 0) {
        response += `🟢 **Safe to Continue:** Yes, production can continue for the next 24 hours (Day and Night shifts) without major interruption.\n\n`;
        response += `All critical systems are running within nominal parameters. Overall factory health is high.`;
      } else {
        const namesList = criticalMachines.map(mid => MACHINE_NAMES[mid]).join(", ");
        response += `🔴 **High Risk detected for upcoming shifts!**\n\n`;
        response += `We do **NOT** recommend running the next shifts at 100% capacity due to high failure probability on: **${namesList}**.\n\n`;
        response += `**Mitigation Strategy:**\n`;
        response += `1. Reduce load on the affected machines to under **60%** to lower mechanical wear.\n`;
        response += `2. Dispatch technicians during the low-demand Night Shift (22:00 - 06:00).\n`;
        response += `3. Expected downtime for scheduled maintenance is only 25-90 minutes, avoiding a multi-hour unplanned shutdown.`;
      }
      return response;
    }

    // Intent 5: Savings
    if (q.includes("saving") || q.includes("money") || q.includes("cost") || q.includes("roi") || q.includes("financial")) {
      let response = `### 📊 Executive Financial ROI Summary\n\n`;
      response += `Here is the running track record of EdgeTwin AI's cost avoidance today:\n\n`;
      response += `- 💰 **Total Downtime Costs Prevented:** **₹${(financials.cost_saved || 482000).toLocaleString()}**\n`;
      response += `- ⏱️ **Unplanned Downtime Blocked:** \`${financials.downtime_prevented || 18.5} hours\`\n`;
      response += `- ⚡ **Energy Waste Recovered:** \`${financials.energy_saved || 342} kWh\`\n`;
      response += `- 📈 **Active Production Hours Saved:** \`${financials.hours_recovered || 12.0} hours\`\n\n`;
      response += `Every scheduled repair prevents an unplanned failure costing up to 10x more. The AI continues to optimize maintenance windows to minimize order delays.`;
      return response;
    }

    // Intent 6: What-If simulation
    const whatIfRegex = /what if (?:we )?(?:stop|shut down|service) (?:machine )?([1-6]|m[1-6]) for (\d+) hours/i;
    const match = q.match(whatIfRegex);
    if (match) {
      const mNum = match[1];
      const hours = parseInt(match[2], 10);
      const mId = "M" + mNum.slice(-1);

      if (telemetry[mId]) {
        const simRes = runWhatIfSimulationLocal(mId, "shutdown", hours);

        let response = `### 🔮 What-If Simulation: Planned Shutdown of **${MACHINE_NAMES[mId]}**\n\n`;
        response += `**Scenario:** Halt machine for \`${hours} hours\` today for preventive maintenance.\n\n`;
        response += `**Projected Business Impacts:**\n`;
        response += `- **Production Loss:** ₹${simRes.production_loss.toLocaleString()} (Controlled, non-critical window)\n`;
        response += `- **Energy Saved:** \`${simRes.energy_saved_kwh.toFixed(1)} kWh\` (worth ₹${simRes.energy_saved_cost.toLocaleString()})\n`;
        response += `- **Risk Mitigation:** Drops post-maintenance failure risk to \`2%\`\n`;
        response += `- **Delivery Delay Risk:** \`${simRes.delivery_delay_risk}\`\n`;
        response += `- **Net Financial Impact:** ₹${simRes.net_financial_impact.toLocaleString()}\n\n`;
        response += `**Justification:** ${simRes.justification}`;
        return response;
      }
    }

    // Default Fallback
    let response = `### 👋 EdgeTwin AI Copilot\n\n`;
    response += `Hello! I am your local Edge Twin Copilot. I can query our machines' physical sensors, model predictions, and financial databases to recommend optimal decisions.\n\n`;
    response += `Try asking me:\n`;
    response += `- *Why is Machine 3 overheating?*\n`;
    response += `- *Which machine should be repaired first?*\n`;
    response += `- *Show the most energy inefficient machine.*\n`;
    response += `- *Can production continue until tomorrow?*\n`;
    response += `- *Show our total savings today.*\n`;
    response += `- *What if we shut down Machine 1 for 4 hours?*`;
    return response;
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // Export report — generated client-side so it works on Vercel (no backend required)
  const triggerReportExport = () => {
    const machineNamesLocal = {
      M1: "CNC Mill (M1)", M2: "Injection Molder (M2)", M3: "6-Axis Robot Arm (M3)",
      M4: "Air Compressor (M4)", M5: "Smart Conveyor (M5)", M6: "Hydraulic Press (M6)"
    };

    const avgHealth = Object.values(telemetry).reduce((sum, m) => {
      const fp = m.ai_prediction?.failure_probability ?? 0;
      return sum + Math.max(0, 100 - fp);
    }, 0) / Object.keys(telemetry).length;

    const machineRows = Object.entries(telemetry).map(([mid, mdata]) => {
      const metrics = mdata.metrics || {};
      const ai = mdata.ai_prediction || {};
      const status = mdata.status || "healthy";
      const statusClass = status === "critical" ? "status-red" : status === "warning" ? "status-yellow" : "status-green";
      const health = Math.max(0, 100 - (ai.failure_probability ?? 0));
      return `<tr>
        <td><strong>${machineNamesLocal[mid] || mid}</strong></td>
        <td><span class="status-badge ${statusClass}">${status.toUpperCase()}</span> (${health.toFixed(1)}%)</td>
        <td>${metrics.temperature ?? 0} °C</td>
        <td>${metrics.vibration ?? 0} mm/s</td>
        <td>${metrics.load ?? 0} %</td>
        <td>${ai.failure_probability ?? 0} %</td>
        <td>${ai.rul_hours ?? 0} hrs</td>
      </tr>`;
    }).join("");

    const incidentRows = incidents.length === 0
      ? "<tr><td colspan='6' class='text-center'>No incidents logged.</td></tr>"
      : incidents.slice(0, 15).map(inc => {
          const badge = inc.resolved
            ? '<span class="status-badge status-green">RESOLVED</span>'
            : '<span class="status-badge status-red">ACTIVE</span>';
          const timeStr = inc.timestamp ? new Date(inc.timestamp).toLocaleString() : "—";
          const sevClass = inc.severity === "critical" ? "status-red" : "status-yellow";
          return `<tr>
            <td>${timeStr}</td>
            <td>${machineNamesLocal[inc.machine_id] || inc.machine_id || "—"}</td>
            <td>${(inc.type || "").toUpperCase()}</td>
            <td><span class="status-badge ${sevClass}">${(inc.severity || "").toUpperCase()}</span></td>
            <td>${inc.action_taken || "None"}</td>
            <td>${badge}</td>
          </tr>`;
        }).join("");

    const scheduleRows = schedule.length === 0
      ? "<tr><td colspan='6' class='text-center'>No maintenance tasks scheduled.</td></tr>"
      : schedule.map(slot => {
          const timeStr = slot.scheduled_time ? new Date(slot.scheduled_time).toLocaleString() : "—";
          const prioClass = slot.priority === "CRITICAL" ? "status-red" : slot.priority === "HIGH" ? "status-yellow" : "status-green";
          return `<tr>
            <td>${timeStr}</td>
            <td>${machineNamesLocal[slot.machine_id] || slot.machine_id || "—"}</td>
            <td>${slot.duration_mins ?? "—"} mins</td>
            <td>${slot.required_parts || "—"}</td>
            <td>${slot.assigned_engineer || "—"}</td>
            <td><span class="status-badge ${prioClass}">${slot.priority || "—"}</span></td>
          </tr>`;
        }).join("");

    const now = new Date().toLocaleString();
    const factoryStatusClass = avgHealth > 80 ? "status-green" : "status-yellow";
    const factoryStatusLabel = avgHealth > 80 ? "HEALTHY" : "ATTENTION NEEDED";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>EdgeTwin AI - Executive Intelligence Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.5; padding: 20px; background-color: #fff; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #064e3b; font-size: 28px; }
    .header p { margin: 5px 0 0 0; color: #6b7280; }
    .meta-info { text-align: right; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background-color: #f9fafb; text-align: center; }
    .card .title { font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: bold; margin-bottom: 5px; }
    .card .value { font-size: 24px; font-weight: bold; color: #111827; }
    .card .value.roi { color: #10b981; }
    .section { margin-bottom: 40px; }
    .section h2 { font-size: 18px; color: #0f172a; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px 12px; text-align: left; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #f3f4f6; color: #374151; font-weight: 600; }
    .status-badge { display: inline-block; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px; }
    .status-green { background-color: #d1fae5; color: #065f46; }
    .status-yellow { background-color: #fef3c7; color: #92400e; }
    .status-red { background-color: #fee2e2; color: #991b1b; }
    .text-center { text-align: center; }
    .print-btn { background-color: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; float: right; margin-bottom: 20px; }
    @media print { .print-btn { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Export PDF</button>
  <div class="header">
    <div>
      <h1>EdgeTwin AI &bull; Executive Intelligence Report</h1>
      <p>Predictive Maintenance Analytics &amp; ROI Justification</p>
    </div>
    <div class="meta-info">
      <strong>Date:</strong> ${now}<br>
      <strong>Factory Status:</strong> <span class="status-badge ${factoryStatusClass}">${factoryStatusLabel}</span>
    </div>
  </div>

  <div class="grid">
    <div class="card"><div class="title">Cost Saved Today</div><div class="value roi">&#x20B9;${(financials.cost_saved || 0).toLocaleString()}</div></div>
    <div class="card"><div class="title">Prevented Downtime</div><div class="value">${financials.downtime_prevented ?? 0} hrs</div></div>
    <div class="card"><div class="title">Energy Conserved</div><div class="value">${financials.energy_saved ?? 0} kWh</div></div>
    <div class="card"><div class="title">Factory Health Index</div><div class="value">${avgHealth.toFixed(1)}%</div></div>
  </div>

  <div class="section">
    <h2>1. Live Asset Status &amp; Wear Analytics</h2>
    <table>
      <thead><tr><th>Asset Name</th><th>Overall Health</th><th>Temp</th><th>Vibration</th><th>Load</th><th>Failure Probability</th><th>Est. RUL</th></tr></thead>
      <tbody>${machineRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>2. Production-Aware Maintenance Calendar</h2>
    <table>
      <thead><tr><th>Scheduled Slot</th><th>Asset</th><th>Est. Duration</th><th>Required Spares</th><th>Assigned Engineer</th><th>Priority</th></tr></thead>
      <tbody>${scheduleRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>3. Active &amp; Resolved Incidents Log (Last 15)</h2>
    <table>
      <thead><tr><th>Time Detected</th><th>Machine</th><th>Incident Type</th><th>Severity</th><th>Action Details</th><th>Status</th></tr></thead>
      <tbody>${incidentRows}</tbody>
    </table>
  </div>

  <div style="margin-top:50px;text-align:center;color:#9ca3af;font-size:11px;border-top:1px solid #f3f4f6;padding-top:15px;">
    Report generated by EdgeTwin AI. Data sourced from live digital twin state.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    // Revoke the object URL after the tab has loaded to free memory
    if (win) win.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
  };

  const getMachineColor = (status) => {
    if (status === "critical") return "bg-[#0c101b] border-rose-900/30 text-rose-400";
    if (status === "warning") return "bg-[#0c101b] border-amber-900/30 text-amber-400";
    return "bg-[#0c101b] border-slate-800/80 text-emerald-400";
  };

  const getStatusBadge = (status) => {
    if (status === "critical") return <span className="bg-rose-950/30 text-rose-400 border border-rose-900/30 font-semibold px-2 py-0.5 rounded text-xs tracking-wider">CRITICAL</span>;
    if (status === "warning") return <span className="bg-amber-950/30 text-amber-400 border border-amber-900/30 font-semibold px-2 py-0.5 rounded text-xs tracking-wider">WARNING</span>;
    return <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 font-semibold px-2 py-0.5 rounded text-xs tracking-wider">HEALTHY</span>;
  };

  const machineNamesMap = {
    M1: "CNC Mill (M1)",
    M2: "Injection Molder (M2)",
    M3: "6-Axis Robot (M3)",
    M4: "Air Compressor (M4)",
    M5: "Conveyor Belt (M5)",
    M6: "Hydraulic Press (M6)"
  };

  // --- Dashboard-wide derived values (recomputed on every render) ---
  const factoryHealthPct = Object.values(telemetry).reduce(
    (sum, m) => sum + Math.max(0, 100 - (m.ai_prediction?.failure_probability ?? 0)), 0
  ) / Math.max(1, Object.keys(telemetry).length);

  const topRiskEntry = Object.entries(telemetry)
    .map(([mid, m]) => ({ mid, fp: m.ai_prediction?.failure_probability ?? 0, status: m.status }))
    .sort((a, b) => b.fp - a.fp)[0] || { mid: "M1", fp: 0, status: "healthy" };

  // Per-machine financial constants referenced by advisor panel and executive ribbon
  const advisorData = {
    M1: { netSavings: 265000, potentialLoss: 280000, maintCost: 15000, downtimeHrs: 3.0, prodSaved: 70000  },
    M2: { netSavings: 335000, potentialLoss: 360000, maintCost: 25000, downtimeHrs: 4.0, prodSaved: 120000 },
    M3: { netSavings: 417000, potentialLoss: 435000, maintCost: 18000, downtimeHrs: 6.0, prodSaved: 190000 },
    M4: { netSavings: 150000, potentialLoss: 200000, maintCost: 10000, downtimeHrs: 2.0, prodSaved: 0      },
    M5: { netSavings: 140000, potentialLoss: 180000, maintCost: 8000,  downtimeHrs: 1.5, prodSaved: 0      },
    M6: { netSavings: 200000, potentialLoss: 220000, maintCost: 20000, downtimeHrs: 2.5, prodSaved: 0      },
  };
  const selAdv    = advisorData[selectedMachine] || advisorData["M3"];
  const selStatus = telemetry[selectedMachine]?.status || "healthy";
  const selRUL    = telemetry[selectedMachine]?.ai_prediction?.rul_hours ?? 980;
  const decisionWindowHrs = Math.max(0, selRUL - 6);
  const decisionWindowH   = Math.floor(decisionWindowHrs);
  const decisionWindowM   = Math.round((decisionWindowHrs % 1) * 60);
  const recommendedByTime = new Date(Date.now() + decisionWindowHrs * 3600000)
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const selConfidence      = selStatus === "critical" ? 94 : selStatus === "warning" ? 91 : 98;
  const selConfidenceLabel = selStatus === "critical" ? "High Confidence" : selStatus === "warning" ? "High Confidence" : "Very High Confidence";
  const selROI             = (selAdv.netSavings / selAdv.maintCost).toFixed(1);

  return (
    <div className="flex h-screen overflow-hidden text-slate-100 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-52'} bg-[#0a0e17] border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto transition-all duration-300`}>

        {/* Logo + Toggle */}
        <div className="border-b border-slate-800 flex items-center px-3 py-4 gap-3 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <Cpu className="w-6 h-6 text-emerald-400" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0e17] ${wsConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold font-display tracking-tight text-white whitespace-nowrap">EdgeTwin AI</h1>
              <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono font-semibold whitespace-nowrap">Decision Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="text-slate-400 hover:text-white transition p-1 rounded hover:bg-slate-800 shrink-0"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="px-3 pt-3 pb-2 space-y-0.5">
          {[
            { tab: "dashboard", icon: <Layers className="w-4 h-4 shrink-0" />, label: "Digital Twin Grid" },
            { tab: "profit", icon: <DollarSign className="w-4 h-4 shrink-0" />, label: "Profit ROI Hub" },
            { tab: "analytics", icon: <BarChart2 className="w-4 h-4 shrink-0" />, label: "Analytics & XAI" },
            { tab: "whatif", icon: <RefreshCw className="w-4 h-4 shrink-0" />, label: "What-If Sandbox" },
            { tab: "projections", icon: <Clock className="w-4 h-4 shrink-0" />, label: "Scenario Projections" },
            { tab: "opportunities", icon: <Sparkles className="w-4 h-4 shrink-0" />, label: "Opportunity Finder" },
            { tab: "planner", icon: <Calendar className="w-4 h-4 shrink-0" />, label: "Maintenance Planner" },
            { tab: "timeline", icon: <Activity className="w-4 h-4 shrink-0" />, label: "Incident Timeline" },
            { tab: "architecture", icon: <Cpu className="w-4 h-4 shrink-0" />, label: "Deployment & Innovation" },
          ].map(({ tab, icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? "bg-emerald-600/10 text-emerald-400" : "text-white hover:bg-slate-800/60"}`}
            >
              {icon}
              <span className="whitespace-nowrap truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-slate-800/60 my-2" />

        {/* AI Scenario Simulator */}
        <div className="mx-3 mb-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <button
            onClick={() => setSimLabOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-3 py-3 text-xs font-semibold text-slate-300 font-display"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="whitespace-nowrap">AI SCENARIO SIMULATOR</span>
            </span>
            <span className={`transition-transform duration-200 text-white text-base leading-none ${simLabOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {simLabOpen && (
            <div className="px-3 pb-3 space-y-2 text-xs border-t border-slate-800">
              <div className="pt-2">
                <label className="text-white font-medium block mb-1">Target Asset</label>
                <select
                  value={anomalyMachine}
                  onChange={(e) => { setAnomalyMachine(e.target.value); setSelectedMachine(e.target.value); }}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white outline-none"
                >
                  {Object.entries(machineNamesMap).map(([mid, name]) => (
                    <option key={mid} value={mid}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white font-medium block mb-1">Anomaly Type</label>
                <select
                  value={anomalyType}
                  onChange={(e) => setAnomalyType(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white outline-none"
                >
                  <option value="bearing_vibration">Bearing Friction &amp; Vibration</option>
                  <option value="pressure_leak">Piston Pressure Leak</option>
                  <option value="tension_stress">Belt Tension Stress</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={injectAnomaly} className="flex-1 bg-rose-700 hover:bg-rose-600 active:scale-95 text-white font-medium py-1.5 rounded flex items-center justify-center gap-1 transition text-[11px]">
                  <Play className="w-3 h-3 fill-white" /><span>Simulate Failure</span>
                </button>
                <button onClick={resetAllMachines} className="flex-1 bg-emerald-700/60 hover:bg-emerald-600 active:scale-95 text-white border border-emerald-600/40 font-medium py-1.5 rounded flex items-center justify-center gap-1 transition text-[11px]">
                  <RefreshCw className="w-3 h-3" /><span>Restore Factory</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 flex flex-col bg-[#080b11] overflow-hidden">
        
        {/* TOP STATUS BAR */}
        <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/90 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse status-transition ${factoryHealthPct >= 85 ? 'bg-emerald-500' : factoryHealthPct >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} />
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">Factory Health:</span>
                  <span className={`font-bold text-sm font-mono status-transition ${factoryHealthPct >= 85 ? 'text-emerald-400' : factoryHealthPct >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {factoryHealthPct.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest leading-none">Overall Operational Availability</p>
              </div>
            </div>
            
            <div className="h-4 w-px bg-slate-800"></div>

            {/* KPI blocks moved to Dashboard tab */}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={triggerReportExport}
              className="bg-slate-800 hover:bg-slate-700 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Executive Report</span>
            </button>
            
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE PAGES (TABS) */}
        <div className="flex-1 p-4 overflow-y-auto">
          
          {/* TAB 1: DIGITAL TWIN INTERACTIVE FLOORPLAN */}
          {activeTab === "dashboard" && (
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
                  const topM    = topRiskEntry;
                  const topAdv  = advisorData[topM.mid] || advisorData["M3"];
                  const topName = machineNamesMap[topM.mid] || topM.mid;
                  const topRec  = telemetry[topM.mid]?.ai_prediction?.recommendation || "Continue Normal Operations";
                  const isCrit  = topM.status === "critical";
                  const isWarn  = topM.status === "warning";
                  const borderClass = isCrit ? "border-rose-900/40" : isWarn ? "border-amber-900/40" : "border-slate-800";
                  const accent  = isCrit ? "text-rose-400"   : isWarn ? "text-amber-400"   : "text-emerald-400";
                  const conf    = isCrit ? "94%"  : isWarn ? "91%"  : "98%";
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
                          <div className="shrink-0">
                            <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Net Business Gain</span>
                            <span className="text-[11px] font-bold text-emerald-400">↑ ₹{(topAdv.netSavings / 100000).toFixed(2)} Lakh</span>
                          </div>
                          <div className="shrink-0">
                            <span className="text-[8px] text-slate-500 uppercase tracking-wider block font-mono">Loss if Ignored</span>
                            <span className="text-[11px] font-bold text-slate-400">₹{(topAdv.potentialLoss / 100000).toFixed(2)} Lakh</span>
                          </div>
                          <div className="shrink-0">
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
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-mono font-semibold text-white uppercase tracking-wider">Decision Engine · RUNNING</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Interactive Floorplan &amp; Conveyor Routing</div>
                      {/* Floorplan legend */}
                      <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500 rounded-full inline-block"></span> Healthy
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                          <span className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500 rounded-full inline-block"></span> Warning
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                          <span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500 rounded-full inline-block animate-pulse"></span> Critical Risk
                        </span>
                      </div>
                    </div>
                  
                  {/* Digital Twin SVG Workspace Grid */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    <svg viewBox="0 0 600 350" className="w-full h-full max-h-[400px]">
                      {/* Grid Background */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="600" height="350" fill="url(#grid)" rx="8" />

                      {/* Material flow lines (conveyors connecting machines) */}
                      {/* Flow M1 -> M5 (Conveyor) */}
                      <path d="M 120 100 L 260 100" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round"/>
                      <path d="M 120 100 L 260 100" fill="none" stroke="#10b981" strokeWidth="2" className="flow-active" />
                      
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

                  {/* Legend moved to header */}
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
                  let objBg    = "bg-emerald-950/25 border-emerald-500/15";
                  if (critCount > 0) {
                    objective = `Maintain Production While Preventing Critical Failure — ${machineNamesMap[topRiskEntry.mid]}`;
                    objAccent = "text-rose-300";
                    objBg    = "bg-rose-950/25 border-rose-500/15";
                  } else if (warnCount > 0) {
                    objective = "Schedule Preventive Maintenance to Avoid Unexpected Production Downtime";
                    objAccent = "text-amber-300";
                    objBg    = "bg-amber-950/25 border-amber-500/15";
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
                <div className="lg:col-span-1 flex flex-col gap-5 overflow-y-auto pr-1 custom-scrollbar sticky top-0" style={{maxHeight: 'calc(100vh - 180px)'}}>
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
                                    { label: "Auto Maintenance\nScheduling",  done: approvedMachines.has(selectedMachine), active: false },
                                    { label: "Incident\nLogged",              done: approvedMachines.has(selectedMachine), active: false },
                                    { label: "Factory\nRecovery",             done: false, active: false },
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
                                        <div className={`h-px w-3 mt-1 flex-shrink-0 self-start mt-1 ${step.done ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
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
            </div>
          )}

          {/* TAB 2: EXECUTIVE PROFIT ROI HUB */}
          {activeTab === "profit" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display tracking-tight">Factory Profit Impact & ROI Dashboard</h2>
                <p className="text-slate-400 text-sm">Executive-level financial KPIs quantifying the business value generated by AI-assisted maintenance.</p>
              </div>

              {/* Financial KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">COST SAVED TODAY</span>
                    <span className="text-2xl font-bold text-emerald-400 font-display">&#x20B9;{financials.cost_saved.toLocaleString()}</span>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8"></div>
                </div>

                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700/30 flex items-center justify-center text-slate-300 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">DOWNTIME PREVENTED</span>
                    <span className="text-2xl font-bold text-white font-display">{financials.downtime_prevented} Hrs</span>
                  </div>
                </div>

                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700/30 flex items-center justify-center text-slate-300 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">ENERGY COST SAVED</span>
                    <span className="text-2xl font-bold text-white font-display">&#x20B9;{(financials.energy_saved * 10).toLocaleString()}</span>
                  </div>
                </div>

                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden">
                  <div className="w-12 h-12 bg-slate-800/40 rounded-xl border border-slate-700/30 flex items-center justify-center text-slate-300 shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">HOURS RECOVERED</span>
                    <span className="text-2xl font-bold text-white font-display">{financials.hours_recovered} Hrs</span>
                  </div>
                </div>
              </div>

              {/* Advanced Decision Economy & ROM Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ROM Breakdown */}
                <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <h3 className="font-bold text-md font-display flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        AI Return on Maintenance (ROM) Analysis
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">SHOWCASE: ROBOT ARM M3</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                      <div className="space-y-3.5">
                        <div className="flex justify-between border-b border-slate-900 pb-2">
                          <span>Planned Service Cost:</span>
                          <span className="font-mono text-white font-semibold">&#x20B9;18,000</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-2">
                          <span>Estimated Failure Gearbox Cost:</span>
                          <span className="font-mono text-white font-semibold">&#x20B9;2,10,000</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-2 text-rose-400">
                          <span>Expected Production Loss (6 hrs):</span>
                          <span className="font-mono font-semibold">&#x20B9;4,80,000</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-center text-center space-y-1">
                        <span className="text-slate-400 text-xs font-semibold">ESTIMATED DECISION SAVINGS</span>
                        <span className="text-3xl font-extrabold text-emerald-400 font-display">&#x20B9;6,72,000</span>
                        <span className="text-[10px] text-slate-500 font-mono">ROM Ratio: <strong className="text-white">3,733%</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 mt-6 text-xs text-slate-300 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 block mb-0.5">AI Investment Justification:</strong>
                      Replacing the harmonic joint gearset on the robot arm today costs ₹18,000. Postponing this bearing service will cause a structural failure inside 10 hours, triggering a full spindle seizure. Unplanned repairs would require replacement parts costing over ₹2.1 lakh and halt the primary production loop for 6 hours, creating an estimated ₹4.8 lakh in downstream delivery losses.
                    </div>
                  </div>
                </div>

                {/* Investment Opportunities */}
                <div className="col-span-1 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-bold text-md font-display border-b border-slate-800 pb-3">Active ROI Recommendations</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-slate-200">CNC Mill M1</strong>
                          <span className="text-emerald-400 font-mono font-bold">+&#x20B9;4,65,000</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">Coolant seal wear risk (58%)</p>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-medium">ROM: 3,100%</span>
                      </div>

                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-slate-200">Injection Molder M2</strong>
                          <span className="text-emerald-400 font-mono font-bold">+&#x20B9;6,95,000</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">Hydraulic seal leak risk (48%)</p>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-medium">ROM: 2,780%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 mt-4">
                    <button 
                      onClick={() => setActiveTab("planner")}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white py-2 rounded-lg font-semibold text-xs transition"
                    >
                      Optimize All Maintenance Schedules
                    </button>
                  </div>
                </div>

              </div>

              {/* Estimated Client ROI Projection Matrix */}
              <div className="glass-panel border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                  <div>
                    <h3 className="font-bold text-md font-display text-white">Estimated Client ROI Projection Matrix</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Projected annual savings at enterprise scale — based on EdgeTwin AI's measured per-decision value.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Decision Quality Score</span>
                    <span className="bg-slate-900 text-slate-200 px-2.5 py-1 rounded text-sm font-mono font-bold border border-slate-800">{decisionQualityScore}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Small Factory", subtitle: "5–10 machines", machines: 8, decisions: 24, savings: "₹48 Lakh", savingsNum: 4800000, color: "text-slate-200", border: "border-slate-700", bg: "bg-slate-900/40" },
                    { label: "Medium Factory", subtitle: "15–25 machines", machines: 20, decisions: 60, savings: "₹2.4 Crore", savingsNum: 24000000, color: "text-emerald-400", border: "border-emerald-700/40", bg: "bg-emerald-950/10" },
                    { label: "Large Enterprise", subtitle: "50+ machines", machines: 50, decisions: 150, savings: "₹8.1 Crore", savingsNum: 81000000, color: "text-sky-400", border: "border-slate-700", bg: "bg-slate-900/40" },
                  ].map(tier => (
                    <div key={tier.label} className={`rounded-2xl border p-5 flex flex-col justify-between ${tier.bg} ${tier.border}`}>
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{tier.subtitle}</span>
                        <h4 className={`font-bold text-lg font-display mt-1 ${tier.color}`}>{tier.label}</h4>
                        <div className="mt-3 space-y-2 text-xs text-slate-300">
                          <div className="flex justify-between"><span className="text-slate-400">Monitored Assets:</span><span className="font-mono">{tier.machines}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">AI Decisions / Year:</span><span className="font-mono">{tier.decisions}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Avg Saved / Decision:</span><span className="font-mono">₹2,00,000</span></div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono block">Est. Annual Savings</span>
                        <span className={`text-2xl font-extrabold font-display ${tier.color}`}>{tier.savings}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 bg-slate-900/40 rounded-xl border border-slate-850 text-[11px] text-slate-300 font-mono flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>All projections are calculated using EdgeTwin AI's actual observed <strong className="text-white">₹4,17,000 per-decision avoided loss</strong> (as demonstrated live in this session).</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADVANCED ANALYTICS & EXPLAINABLE AI */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display tracking-tight">Advanced Analytics & Explainable AI (XAI)</h2>
                  <p className="text-slate-400 text-sm">Deep inspection of neural metrics, sensor timelines, and AI confidence factors.</p>
                </div>
                
                {/* Machine selector */}
                <div className="flex gap-2">
                  {Object.entries(machineNamesMap).map(([mid, name]) => (
                    <button 
                      key={mid}
                      onClick={() => setSelectedMachine(mid)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition ${selectedMachine === mid ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/40 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {mid}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Historical Recharts Line Graph */}
                <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-md font-display mb-4">{machineNamesMap[selectedMachine]} - Historical Telemetry Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false}/>
                        <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} domain={['auto', 'auto']}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickLine={false} domain={['auto', 'auto']}/>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                        <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2.5} name="Temperature (°C)"/>
                        <Line yAxisId="right" type="monotone" dataKey="vibration" stroke="#f59e0b" strokeWidth={2} name="Vibration (mm/s)"/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* XAI Feature Importance Graph */}
                <div className="lg:col-span-1 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-md font-display border-b border-slate-800 pb-3 mb-4">Edge AI Feature Importances</h3>
                    <p className="text-[11px] text-slate-400 mb-4">Relative weight contributions of parameters driving the failure model score.</p>
                    
                    <div className="space-y-4">
                      {telemetry[selectedMachine]?.ai_prediction.feature_importances && 
                        Object.entries(telemetry[selectedMachine].ai_prediction.feature_importances).map(([feature, pct]) => (
                          <div key={feature} className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-300">
                              <span>{feature}</span>
                              <span className="font-mono text-emerald-400 font-bold">{pct}%</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl mt-6 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider mb-1 font-mono">Model Confidence Score</span>
                    <span className="text-3xl font-extrabold text-emerald-400 font-display">94.2%</span>
                    <span className="text-[9px] text-slate-500 block font-mono mt-0.5">Offline Edge inference running interpretable logistic scoring models</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COST-AWARE WHAT-IF SIMULATION */}
          {activeTab === "whatif" && (
            <div className="space-y-6">
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
                        <span className="font-mono text-white font-bold">{simValue} {simAction === 'postpone' ? 'Hours' : 'Hours'}</span>
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
                            <div className="flex justify-between border-b border-slate-900 pb-1.5">
                              <span className="text-slate-400">Post-Action Failure Risk:</span>
                              <span className="font-mono text-white font-semibold">{simResult.failure_risk}%</span>
                            </div>
                            {simResult.additional_energy_consumption_pct !== undefined && (
                              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                <span className="text-slate-400">Energy Consumption Penalty:</span>
                                <span className="font-mono text-rose-400 font-semibold">+{simResult.additional_energy_consumption_pct}%</span>
                              </div>
                            )}
                            {simResult.energy_saved_kwh !== undefined && (
                              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                <span className="text-slate-400">Total Energy Saved:</span>
                                <span className="font-mono text-emerald-400 font-semibold">{simResult.energy_saved_kwh} kWh</span>
                              </div>
                            )}
                            <div className="flex justify-between border-b border-slate-900 pb-1.5">
                              <span className="text-slate-400">Expected Downtime:</span>
                              <span className="font-mono text-white font-semibold">
                                {simResult.expected_downtime_hours !== undefined ? `${simResult.expected_downtime_hours} Hours` : `${simValue} Hours`}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900 pb-1.5">
                              <span className="text-slate-400">Delivery Delay Risk:</span>
                              <span className={`font-semibold ${simResult.delivery_delay_risk === 'HIGH' ? 'text-rose-400' : (simResult.delivery_delay_risk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400')}`}>
                                {simResult.delivery_delay_risk}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Cost Projection Chart */}
                      <div className="h-44 mt-4 border-t border-slate-905/40 pt-4">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-mono mb-2">Cost & Risk Projection Curve</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={getSimProjectionData()}>
                            <XAxis dataKey="hours" stroke="#64748b" fontSize={9} tickLine={false}/>
                            <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} domain={['auto', 'auto']}/>
                            <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: 10 }} />
                            {simAction === "postpone" ? (
                              <>
                                <Area type="monotone" dataKey="Expected Loss (INR)" stroke="#f43f5e" fill="rgba(244, 63, 94, 0.12)" strokeWidth={2} name="Expected Failure Loss (₹)" />
                                <Area type="monotone" dataKey="Planned Repair (INR)" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="3,3" name="Planned Stop Cost (₹)" />
                              </>
                            ) : (
                              <>
                                <Area type="monotone" dataKey="Controlled Stop Cost (INR)" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.12)" strokeWidth={2} name="Planned Idle Cost (₹)" />
                                <Area type="monotone" dataKey="Standby Energy Saved (INR)" stroke="#10b981" fill="rgba(16, 185, 129, 0.08)" strokeWidth={1.5} name="Electricity Conserved (₹)" />
                              </>
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Explanation box */}
                      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs leading-relaxed font-mono">
                        <span className="block font-bold text-slate-200 mb-1 font-display uppercase tracking-wider text-[10px]">Justification Log:</span>
                        "{simResult.justification}"
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                      Recompute simulation configuration
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: AI OPPORTUNITY FINDER */}
          {activeTab === "opportunities" && (
            <div className="space-y-6">
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
                      Analyze Opportunity <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Opportunity 2 */}
                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="bg-slate-900 text-slate-300 font-semibold px-2 py-0.5 rounded tracking-wide font-mono border border-slate-800 uppercase text-[10px]">LOAD BALANCING</span>
                      <span className="text-slate-400 font-mono">Asset M1 (CNC Mill)</span>
                    </div>
                    <h3 className="font-bold text-sm text-white font-display">Overloaded Spindle Stress Buffer</h3>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      M1 has run at **85% load** continuously for 18 hours. This has caused spindle head temperature to reach **62°C**. We recommend shifting **15% CNC tooling cycles** to M6 Hydraulic Press auxiliary route for 4 hours to let M1 cool.
                    </p>
                  </div>
                  <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold font-mono">Est. Savings: Prevents Overheat Fault</span>
                    <button 
                      onClick={() => sendCopilotQuery("Can production continue until tomorrow?")}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
                    >
                      Analyze Opportunity <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Opportunity 3 */}
                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded tracking-wide font-mono uppercase text-[10px]">PREVENTIVE UPGRADE</span>
                      <span className="text-slate-400 font-mono">Asset M3 (6-Axis Robot)</span>
                    </div>
                    <h3 className="font-bold text-sm text-white font-display">Standard Gear Seizure Avoidance</h3>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Continuous joint movement indicates lubricant degradation. Upgrading to high-density synthetic grease prevents bearing micro-fissures, delaying next maintenance cycles by **6 months**.
                    </p>
                  </div>
                  <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹6,72,000 Saved</span>
                    <button 
                      onClick={() => sendCopilotQuery("Why is Machine 3 overheating?")}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
                    >
                      Inspect Lubricant <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Opportunity 4 */}
                <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="bg-slate-900 text-slate-300 font-semibold px-2 py-0.5 rounded tracking-wide font-mono border border-slate-800 uppercase text-[10px]">STANDBY POWER DRAW</span>
                      <span className="text-slate-400 font-mono">Asset M4 (Air Compressor)</span>
                    </div>
                    <h3 className="font-bold text-sm text-white font-display">Standby Energy Sink Recovery</h3>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Compressor runs at 0% load during end-of-shift lunch windows (13:00 - 13:45) but draws **8.2 kWh** on standby. Setting an auto-hibernation sequence saves **240 kWh/month**.
                    </p>
                  </div>
                  <div className="border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold font-mono">Est. Savings: ₹2,400/month</span>
                    <button 
                      onClick={() => sendCopilotQuery("Show the most energy inefficient machine.")}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 transition"
                    >
                      Apply Smart Sleep <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: AUTONOMOUS MAINTENANCE PLANNER */}
          {activeTab === "planner" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display tracking-tight">Autonomous Maintenance Planner</h2>
                  <p className="text-slate-400 text-sm">Automatically schedules services during low-impact night shifts to prevent production losses.</p>
                </div>
                <button
                  onClick={optimizeSchedule}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition glow-emerald active:scale-95 text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Optimize Plan</span>
                </button>
              </div>

              {/* Maintenance Schedule grid */}
              <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-300 text-xs font-semibold">
                      <th className="p-4 text-left">Asset</th>
                      <th className="p-4 text-left">Scheduled Time</th>
                      <th className="p-4 text-left">Technician</th>
                      <th className="p-4 text-left">Spares Needed</th>
                      <th className="p-4 text-left">Urgency</th>
                      <th className="p-4 text-left">Scheduler Rationale</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs">
                    {schedule.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">
                          No services scheduled. Click "Optimize Plan" to calculate slots.
                        </td>
                      </tr>
                    ) : (
                      schedule.map((slot) => (
                        <tr key={slot.id || slot.scheduled_time} className="hover:bg-slate-900/20 text-slate-300">
                          <td className="p-4 font-bold text-white">{machineNamesMap[slot.machine_id] || slot.machine_name}</td>
                          <td className="p-4 font-mono">{new Date(slot.scheduled_time).toLocaleString()}</td>
                          <td className="p-4">{slot.assigned_engineer}</td>
                          <td className="p-4">{slot.required_parts}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold ${slot.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : (slot.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20')}`}>
                              {slot.priority}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 italic">"{slot.justification}"</td>
                          <td className="p-4 text-center">
                            {slot.status === "completed" ? (
                              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Done
                              </span>
                            ) : (
                              <button
                                onClick={() => completeTask(slot.id)}
                                className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white px-2.5 py-1 rounded text-emerald-400 transition"
                              >
                                Complete Service
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: INCIDENT TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display tracking-tight">Active & Historical Incidents Log</h2>
                <p className="text-slate-400 text-sm">Full audit trail of physical anomalies, Edge AI models, and engineer completions.</p>
              </div>

              {/* Timeline List */}
              <div className="glass-panel border border-slate-800 rounded-2xl p-6">
                <div className="space-y-6 relative border-l border-slate-800 ml-4 pl-6 text-xs">
                  {incidents.length === 0 ? (
                    <div className="text-slate-500 text-center py-4">No incidents logged.</div>
                  ) : (
                    incidents.map((inc, i) => (
                      <div key={inc.id || i} className="relative">
                        {/* Bullet dot */}
                        <span className={`absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${inc.resolved ? 'bg-emerald-500' : (inc.severity === 'critical' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500')}`} />
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-500">{new Date(inc.timestamp).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${inc.resolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {inc.resolved ? 'RESOLVED' : 'ACTIVE'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-display">
                            {machineNamesMap[inc.machine_id] || inc.machine_id} &bull; {inc.type} Anomaly Detected
                          </h4>
                          <p className="text-slate-400 max-w-2xl leading-relaxed">
                            <strong>Status Details:</strong> {inc.action_taken}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SCENARIO PROJECTION ENGINE */}
          {activeTab === "projections" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display tracking-tight">Scenario Projection Engine</h2>
                <p className="text-slate-400 text-sm">Time-horizon forecast simulation of factory health, energy, and financial risk across scenarios.</p>
              </div>

              {/* Timeline & Scenario Selectors */}
              <div className="glass-panel border border-slate-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 mb-3 font-display">Projection Time Horizon</h4>
                    <div className="flex gap-2 flex-wrap">
                      {[{label:"NOW",hours:0},{label:"+6h",hours:6},{label:"+12h",hours:12},{label:"+24h",hours:24},{label:"+3 Days",hours:72}].map(t => (
                        <button 
                          key={t.label}
                          onClick={() => setProjectionHorizon(t.hours)}
                          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition border ${projectionHorizon === t.hours ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="range" min="0" max="72" step="6" value={projectionHorizon}
                      onChange={e => setProjectionHorizon(parseInt(e.target.value))}
                      className="w-full mt-4 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>NOW</span><span>+6h</span><span>+12h</span><span>+24h</span><span>+3 Days</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 mb-3 font-display">Scenario Mode</h4>
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
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition border flex items-center justify-between ${activeScenario === s.id ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                        >
                          <span className="font-semibold">{s.label}</span>
                          <span className="text-[10px] text-slate-500">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Projection KPI Cards */}
              {(() => {
                const proj = projectTimeline(projectionHorizon, activeScenario);
                const healthColor = proj.factoryHealth > 70 ? 'text-emerald-400' : proj.factoryHealth > 40 ? 'text-amber-400' : 'text-rose-400';
                const lossColor = proj.financialLoss > 100000 ? 'text-rose-400' : proj.financialLoss > 0 ? 'text-amber-400' : 'text-emerald-400';
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="glass-panel border border-slate-800 rounded-2xl p-5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">FACTORY HEALTH</span>
                      <div className={`text-3xl font-extrabold font-display mt-1 ${healthColor}`}>{proj.factoryHealth}%</div>
                      <div className="mt-2 bg-slate-800 rounded-full h-1.5">
                        <div className={`h-full rounded-full transition-all duration-500 ${proj.factoryHealth > 70 ? 'bg-emerald-500' : proj.factoryHealth > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width:`${proj.factoryHealth}%`}} />
                      </div>
                    </div>
                    <div className="glass-panel border border-slate-800 rounded-2xl p-5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">M3 FAILURE RISK</span>
                      <div className={`text-3xl font-extrabold font-display mt-1 ${proj.m3Prob > 50 ? 'text-rose-400' : 'text-amber-400'}`}>{proj.m3Prob}%</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{proj.m3Prob > 90 ? 'IMMINENT FAILURE' : proj.m3Prob > 50 ? 'HIGH RISK' : 'MODERATE RISK'}</p>
                    </div>
                    <div className="glass-panel border border-slate-800 rounded-2xl p-5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">ENERGY USAGE</span>
                      <div className="text-3xl font-extrabold font-display mt-1 text-sky-400">{proj.energyConsumption} kWh</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{proj.energyConsumption > 380 ? '▲ Elevated' : proj.energyConsumption < 335 ? '▼ Optimized' : '● Nominal'}</p>
                    </div>
                    <div className="glass-panel border border-slate-800 rounded-2xl p-5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">FINANCIAL EXPOSURE</span>
                      <div className={`text-2xl font-extrabold font-display mt-1 ${lossColor}`}>₹{proj.financialLoss.toLocaleString()}</div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        {proj.financialLoss === 0 ? 'No immediate exposure' : 'Projected avoidable loss'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Projection Chart */}
              <div className="glass-panel border border-slate-800 rounded-2xl p-6">
                <h4 className="font-bold text-sm font-display text-slate-200 mb-4">Factory Health Timeline — Scenario: <span className="text-indigo-400 capitalize">{activeScenario.replace('_', ' ')}</span></h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[0,6,12,24,72].map(h => {
                      const p = projectTimeline(h, activeScenario);
                      return { time: h === 0 ? 'NOW' : `+${h}h`, health: p.factoryHealth, risk: p.m3Prob, energy: p.energyConsumption };
                    })}>
                      <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false}/>
                      <YAxis yAxisId="left" stroke="#10b981" fontSize={11} tickLine={false} domain={[0,100]}/>
                      <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickLine={false} domain={[0,100]}/>
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: 11 }}/>
                      <Area yAxisId="left" type="monotone" dataKey="health" stroke="#10b981" fill="rgba(16,185,129,0.08)" strokeWidth={2.5} name="Factory Health (%)" />
                      <Area yAxisId="right" type="monotone" dataKey="risk" stroke="#f43f5e" fill="rgba(244,63,94,0.06)" strokeWidth={2} name="M3 Failure Risk (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPLOYMENT & INNOVATION */}
          {activeTab === "architecture" && (
            <div className="space-y-6">
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
          )}

        </div>
      </main>

      {/* FLOAT / SLIDE OUT AI COPILOT DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#0a0e17] border-l border-slate-800 shadow-2xl transition-all duration-300 z-50 flex flex-col ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Chat Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#090d16]/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white font-display">AI Factory Copilot</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Edge Decision Advisor</p>
            </div>
          </div>
          <button 
            onClick={() => setChatOpen(false)}
            className="text-slate-400 hover:text-white px-2 py-1 text-sm font-semibold transition"
          >
            Close
          </button>
        </div>

        {/* Chat Message Window */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col max-w-[85%] rounded-xl p-3 border text-xs relative ${msg.sender === 'user' ? 'self-end bg-slate-900 border-slate-800 text-slate-200 ml-auto' : 'bg-slate-950/80 border-slate-850 text-slate-300 mr-auto pb-8'}`}
            >
              <div className="chat-msg leading-relaxed font-mono">
                {msg.sender === 'copilot' ? formatMarkdown(msg.text) : msg.text}
              </div>
              {msg.sender === 'copilot' && (
                <button
                  onClick={() => speakResponse(msg.text)}
                  className="absolute bottom-1.5 right-2 text-slate-500 hover:text-emerald-400 p-1 rounded transition flex items-center gap-1 text-[9px] font-semibold font-mono"
                  title="Speak Response"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 OPERATOR SPEECH</span>
                </button>
              )}
            </div>
          ))}

          {chatLoading && (
            <div className="bg-slate-950 border border-slate-850 text-slate-400 max-w-[85%] rounded-xl p-3 mr-auto flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span className="text-[10px] font-mono">Consulting Edge Models...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Pre-suggested Queries */}
        <div className="px-4 py-2 border-t border-slate-850/60 bg-slate-950/20 flex flex-wrap gap-1.5 shrink-0">
          <button 
            onClick={() => sendCopilotQuery("Why is Machine 3 overheating?")}
            className="bg-slate-900 hover:bg-slate-800/80 text-[10px] text-slate-400 px-2 py-1 rounded transition border border-slate-850"
          >
            Why is Robot M3 hot?
          </button>
          <button 
            onClick={() => sendCopilotQuery("Which machine should be repaired first?")}
            className="bg-slate-900 hover:bg-slate-800/80 text-[10px] text-slate-400 px-2 py-1 rounded transition border border-slate-850"
          >
            Priority Assets
          </button>
          <button 
            onClick={() => sendCopilotQuery("Show our total savings today.")}
            className="bg-slate-900 hover:bg-slate-800/80 text-[10px] text-slate-400 px-2 py-1 rounded transition border border-slate-850"
          >
            Downtime savings
          </button>
          <button 
            onClick={() => sendCopilotQuery("Show the most energy inefficient machine.")}
            className="bg-slate-900 hover:bg-slate-800/80 text-[10px] text-slate-400 px-2 py-1 rounded transition border border-slate-850"
          >
            Energy waste
          </button>
        </div>

        {/* Chat input box */}
        <div className="p-4 border-t border-slate-800 bg-[#090d16]/90 flex gap-2 shrink-0">
          <input
            type="text"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendCopilotQuery()}
            placeholder="Ask EdgeTwin AI..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs outline-none focus:border-emerald-500/60 transition text-slate-200"
          />
          <button 
            onClick={() => sendCopilotQuery()}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-2 rounded-lg transition shrink-0 glow-emerald"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
