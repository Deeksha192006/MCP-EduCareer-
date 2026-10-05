import React, { useState, useEffect } from 'react';
import { Zap, Play, RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Gauge, Trophy, Lightbulb, Power, Cpu, Activity, RefreshCw, Layers, CheckSquare, Sparkles } from 'lucide-react';

const EEE_GAME_LEVELS = [
  {
    id: "eee_lvl_1",
    name: "Level 1 — Complete the Electrical Circuit",
    skillTested: "Circuit Understanding",
    difficulty: "easy",
    instruction: "Connect all missing wire segments between the 12V Battery, Switch, and Light Bulb. Toggle the switch to complete the closed loop and turn ON the lamp!",
    requiredSlots: ["wire_a", "wire_b", "switch"]
  },
  {
    id: "eee_lvl_2",
    name: "Level 2 — Power Distribution",
    skillTested: "Energy Management & Decision Making",
    difficulty: "medium",
    instruction: "You have a limited power capacity of 200 Watts. Select a combination of appliances that powers essential loads without exceeding 200W!",
    maxPower: 200,
    appliances: [
      { id: "light", name: "LED Light", power: 40, priority: "Essential", description: "Provides essential lighting" },
      { id: "fan", name: "Ventilation Fan", power: 60, priority: "Important", description: "Air circulation" },
      { id: "pump", name: "Water Pump", power: 80, priority: "Essential", description: "Water supply" },
      { id: "motor", name: "Electric Motor", power: 100, priority: "Optional", description: "Mechanical work" },
      { id: "heater", name: "Water Heater", power: 120, priority: "Optional", description: "High power load" }
    ]
  },
  {
    id: "eee_lvl_3",
    name: "Level 3 — Find the Electrical Fault",
    skillTested: "Electrical Troubleshooting",
    difficulty: "medium",
    instruction: "The electrical system below is NOT operating (0.00A current flow) even though the switch is closed. Inspect the schematic and identify the exact fault!",
    faultOptions: [
      { id: "ground", label: "Ground return wire is disconnected, causing an open circuit", isCorrect: true, explanation: "Without a completed ground path, current cannot return to the negative battery terminal!" },
      { id: "fuse", label: "Fuse rating is too high for the circuit", isCorrect: false, explanation: "An over-sized fuse passes current normally unless an extreme short occurs." },
      { id: "resistor", label: "Resistor value is zero ohms", isCorrect: false, explanation: "Zero resistance would cause short-circuit high current, not zero current flow." },
      { id: "voltage", label: "Voltage source polarity is inverted", isCorrect: false, explanation: "Reversing DC battery polarity on a resistive lamp would still illuminate it." }
    ]
  },
  {
    id: "eee_lvl_4",
    name: "Level 4 — Energy Optimization Challenge",
    skillTested: "Energy Management & Optimization",
    difficulty: "hard",
    instruction: "Manage an emergency power backup system (Max 1500 Wh). You MUST supply all Priority 1 (Essential) and Priority 2 (Important) loads while staying within budget.",
    energyBudget: 1500,
    loads: [
      { id: "fridge", name: "Medical Refrigerator", energy: 400, priority: 1, label: "Priority 1 (Essential)" },
      { id: "lights", name: "Emergency Lighting", energy: 200, priority: 1, label: "Priority 1 (Essential)" },
      { id: "water_pump", name: "Water Pump", energy: 500, priority: 2, label: "Priority 2 (Important)" },
      { id: "ac", name: "Air Conditioner", energy: 800, priority: 3, label: "Priority 3 (Optional)" },
      { id: "tv", name: "Entertainment / TV", energy: 300, priority: 3, label: "Priority 3 (Optional)" }
    ]
  },
  {
    id: "eee_lvl_5",
    name: "Level 5 — Electrical Flow Puzzle",
    skillTested: "Logical Thinking & Circuit Reasoning",
    difficulty: "hard",
    instruction: "Select the correct routing relay path (Relay 1, 2, or 3) to guide electric current safely from the Power Generator to the Main Transformer without passing through a damaged relay node!",
    relayPaths: [
      { id: "r1", name: "Path A via Relay 1 (Damaged Short Circuit)", isCorrect: false, warning: "⚡ DANGER! Relay 1 is short-circuited. Circuit breaker trips!" },
      { id: "r2", name: "Path B via Relay 2 (Active Isolation Guard)", isCorrect: true, note: "✨ SUCCESS! Clean power flow established through Relay 2 to Transformer!" },
      { id: "r3", name: "Path C via Relay 3 (Open High Resistance Relay)", isCorrect: false, warning: "⚠️ HIGH RESISTANCE! Insufficient current reaches transformer." }
    ]
  }
];

const SmartPowerGame = ({ onGameComplete }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [levelResults, setLevelResults] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Level 1 States
  const [placedSlots, setPlacedSlots] = useState([]);
  const [switchState, setSwitchState] = useState(false);

  // Level 2 States (Power distribution)
  const [selectedAppliances, setSelectedAppliances] = useState(["light", "fan"]);

  // Level 3 States (Fault finding)
  const [selectedFaultId, setSelectedFaultId] = useState(null);

  // Level 4 States (Energy optimization)
  const [selectedLoads, setSelectedLoads] = useState(["fridge", "lights", "water_pump"]);

  // Level 5 States (Flow puzzle)
  const [selectedRelayId, setSelectedRelayId] = useState(null);

  const currentLevel = EEE_GAME_LEVELS[currentLevelIdx];

  useEffect(() => {
    let interval = null;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => setSecondsSpent(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  useEffect(() => {
    // Reset inputs per level
    setPlacedSlots([]);
    setSwitchState(false);
    setSelectedFaultId(null);
    setSelectedRelayId(null);
    setAttempts(1);
  }, [currentLevelIdx]);

  // Calculations for Level 2
  const currentLevel2Power = currentLevel.id === "eee_lvl_2" 
    ? currentLevel.appliances
        .filter(a => selectedAppliances.includes(a.id))
        .reduce((sum, a) => sum + a.power, 0)
    : 0;

  // Calculations for Level 4
  const currentLevel4Energy = currentLevel.id === "eee_lvl_4"
    ? currentLevel.loads
        .filter(l => selectedLoads.includes(l.id))
        .reduce((sum, l) => sum + l.energy, 0)
    : 0;

  const handleNextLevel = () => {
    let isCorrect = false;

    if (currentLevel.id === "eee_lvl_1") {
      isCorrect = placedSlots.length === 2 && switchState;
    } else if (currentLevel.id === "eee_lvl_2") {
      // Must contain essential loads (light, pump) and not exceed 200W
      const hasLight = selectedAppliances.includes("light");
      const hasPump = selectedAppliances.includes("pump");
      isCorrect = hasLight && hasPump && currentLevel2Power <= 200;
    } else if (currentLevel.id === "eee_lvl_3") {
      const opt = currentLevel.faultOptions.find(o => o.id === selectedFaultId);
      isCorrect = opt?.isCorrect === true;
    } else if (currentLevel.id === "eee_lvl_4") {
      // Must supply all Priority 1 (fridge, lights) and Priority 2 (water_pump) within 1500 Wh
      const hasFridge = selectedLoads.includes("fridge");
      const hasLights = selectedLoads.includes("lights");
      const hasPump = selectedLoads.includes("water_pump");
      isCorrect = hasFridge && hasLights && hasPump && currentLevel4Energy <= 1500;
    } else if (currentLevel.id === "eee_lvl_5") {
      const rel = currentLevel.relayPaths.find(r => r.id === selectedRelayId);
      isCorrect = rel?.isCorrect === true;
    }

    const levelScore = isCorrect ? Math.max(70, 100 - ((attempts - 1) * 15)) : 30.0;

    const levelRecord = {
      levelId: currentLevel.id,
      levelName: currentLevel.name,
      skillTested: currentLevel.skillTested,
      difficulty: currentLevel.difficulty,
      score: levelScore,
      accuracy: isCorrect ? 1.0 : 0.3,
      timeTaken: Math.max(10, Math.round(secondsSpent / (currentLevelIdx + 1))),
      attempts: attempts,
      completed: true
    };

    const newResults = [...levelResults, levelRecord];
    setLevelResults(newResults);

    if (currentLevelIdx < EEE_GAME_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      setIsGameOver(true);

      if (onGameComplete) {
        onGameComplete(newResults, secondsSpent);
      }
    }
  };

  const toggleLevel1Slot = (slotId) => {
    if (placedSlots.includes(slotId)) {
      setPlacedSlots(placedSlots.filter(s => s !== slotId));
    } else {
      setPlacedSlots([...placedSlots, slotId]);
    }
  };

  const toggleLevel2Appliance = (appId) => {
    if (selectedAppliances.includes(appId)) {
      setSelectedAppliances(selectedAppliances.filter(id => id !== appId));
    } else {
      setSelectedAppliances([...selectedAppliances, appId]);
    }
  };

  const toggleLevel4Load = (loadId) => {
    if (selectedLoads.includes(loadId)) {
      setSelectedLoads(selectedLoads.filter(id => id !== loadId));
    } else {
      setSelectedLoads([...selectedLoads, loadId]);
    }
  };

  return (
    <div className="game-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Game Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '14px',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Smart Power Distribution Challenge</h3>
            <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '600' }}>
              {currentLevel.name} (Level {currentLevelIdx + 1} of 5)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} style={{ color: switchState ? '#10b981' : '#f59e0b' }} />
            <span>Tested Skill: <strong>{currentLevel.skillTested}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} style={{ color: '#3b82f6' }} />
            <span>Time Spent: <strong>{secondsSpent}s</strong></span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="card" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'rgba(17, 24, 39, 0.7)' }}>
          {/* Level Instructions */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={22} style={{ color: '#f59e0b', shrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#fbbf24', marginBottom: '4px' }}>
                Mission Objective:
              </div>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: 'var(--text-main)' }}>
                {currentLevel.instruction}
              </p>
            </div>
          </div>

          {/* LEVEL 1 INTERFACE */}
          {currentLevel.id === "eee_lvl_1" && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                margin: '0 auto 24px auto',
                maxWidth: '550px',
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
                  {/* Battery */}
                  <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#93c5fd' }}>
                    <Power size={28} />
                    <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '4px' }}>12V DC Battery</div>
                  </div>

                  {/* Wire Connection Slot A */}
                  <button
                    onClick={() => toggleLevel1Slot("wire_a")}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: placedSlots.includes("wire_a") ? '2px solid #10b981' : '2px dashed #6b7280',
                      background: placedSlots.includes("wire_a") ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: placedSlots.includes("wire_a") ? '#34d399' : '#9ca3af',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {placedSlots.includes("wire_a") ? '⚡ Wire Connected' : '+ Connect Positive Wire'}
                  </button>

                  {/* Switch */}
                  <button
                    onClick={() => setSwitchState(!switchState)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: switchState ? '2px solid #10b981' : '2px solid #ef4444',
                      background: switchState ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: switchState ? '#34d399' : '#fca5a5',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Switch: {switchState ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                  </button>

                  {/* Wire Connection Slot B */}
                  <button
                    onClick={() => toggleLevel1Slot("wire_b")}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: placedSlots.includes("wire_b") ? '2px solid #10b981' : '2px dashed #6b7280',
                      background: placedSlots.includes("wire_b") ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      color: placedSlots.includes("wire_b") ? '#34d399' : '#9ca3af',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {placedSlots.includes("wire_b") ? '⚡ Wire Connected' : '+ Connect Ground Wire'}
                  </button>

                  {/* Lamp Bulb */}
                  <div style={{
                    padding: '16px',
                    borderRadius: '50%',
                    background: (placedSlots.length === 2 && switchState) ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.05)',
                    border: (placedSlots.length === 2 && switchState) ? '2px solid #f59e0b' : '1px solid #4b5563',
                    color: (placedSlots.length === 2 && switchState) ? '#fbbf24' : '#6b7280',
                    boxShadow: (placedSlots.length === 2 && switchState) ? '0 0 20px rgba(245, 158, 11, 0.6)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <Lightbulb size={36} />
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: (placedSlots.length === 2 && switchState) ? '#10b981' : '#9ca3af', fontWeight: '600' }}>
                  {(placedSlots.length === 2 && switchState)
                    ? '✨ CLOSED CIRCUIT LOOP ESTABLISHED! Lamp is glowing brightly.'
                    : '⚠️ Circuit is OPEN. Complete wire connections and turn switch ON.'}
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2 INTERFACE */}
          {currentLevel.id === "eee_lvl_2" && (
            <div>
              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderRadius: '12px',
                background: currentLevel2Power > 200 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                border: currentLevel2Power > 200 ? '1px solid #ef4444' : '1px solid #10b981',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Power Usage: </span>
                  <strong style={{ fontSize: '18px', color: currentLevel2Power > 200 ? '#fca5a5' : '#34d399' }}>
                    {currentLevel2Power} W / {currentLevel.maxPower} W
                  </strong>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: currentLevel2Power > 200 ? '#fca5a5' : '#34d399' }}>
                  {currentLevel2Power > 200 ? '⚠️ POWER OVERLOAD! Exceeds 200W capacity.' : '✔ Valid Power Allocation'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {currentLevel.appliances.map((app) => {
                  const isSelected = selectedAppliances.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      onClick={() => toggleLevel2Appliance(app.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>{app.name}</span>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fbbf24' }}>
                          {app.power} W
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>{app.description}</p>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: app.priority === 'Essential' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)', color: app.priority === 'Essential' ? '#34d399' : 'var(--text-muted)' }}>
                        Priority: {app.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 3 INTERFACE */}
          {currentLevel.id === "eee_lvl_3" && (
            <div>
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8', marginBottom: '8px' }}>
                  Diagnostics Reader telemetry: Voltage = 12.0V | Current Flow = 0.00 Amperes | Lamp State = OFF
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Visual inspection shows the positive terminal wire connected to the switch and resistor, but the negative ground return wire is unclipped from the circuit bus.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {currentLevel.faultOptions.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: selectedFaultId === opt.id ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                      background: selectedFaultId === opt.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="eee_fault"
                      checked={selectedFaultId === opt.id}
                      onChange={() => setSelectedFaultId(opt.id)}
                      style={{ accentColor: '#f59e0b' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 4 INTERFACE */}
          {currentLevel.id === "eee_lvl_4" && (
            <div>
              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderRadius: '12px',
                background: currentLevel4Energy > 1500 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                border: currentLevel4Energy > 1500 ? '1px solid #ef4444' : '1px solid #3b82f6',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Backup Energy Used: </span>
                  <strong style={{ fontSize: '18px', color: currentLevel4Energy > 1500 ? '#fca5a5' : '#93c5fd' }}>
                    {currentLevel4Energy} Wh / {currentLevel.energyBudget} Wh
                  </strong>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: currentLevel4Energy > 1500 ? '#fca5a5' : '#93c5fd' }}>
                  {currentLevel4Energy > 1500 ? '⚠️ CAPACITY EXCEEDED!' : '✔ Power Budget Intact'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {currentLevel.loads.map((load) => {
                  const isSelected = selectedLoads.includes(load.id);
                  return (
                    <div
                      key={load.id}
                      onClick={() => toggleLevel4Load(load.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>{load.name}</span>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#60a5fa' }}>
                          {load.energy} Wh
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: load.priority === 1 ? 'rgba(239,68,68,0.2)' : load.priority === 2 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)',
                        color: load.priority === 1 ? '#fca5a5' : load.priority === 2 ? '#fbbf24' : 'var(--text-muted)'
                      }}>
                        {load.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 5 INTERFACE */}
          {currentLevel.id === "eee_lvl_5" && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {currentLevel.relayPaths.map((path) => (
                  <div
                    key={path.id}
                    onClick={() => setSelectedRelayId(path.id)}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      border: selectedRelayId === path.id ? '2px solid #10b981' : '1px solid var(--border-color)',
                      background: selectedRelayId === path.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="eee_relay"
                        checked={selectedRelayId === path.id}
                        onChange={() => setSelectedRelayId(path.id)}
                        style={{ accentColor: '#10b981' }}
                      />
                      <span style={{ fontSize: '15px', fontWeight: '700' }}>{path.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit / Next Level Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={handleNextLevel}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '700',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none'
              }}
            >
              <span>{currentLevelIdx < EEE_GAME_LEVELS.length - 1 ? 'Submit & Proceed to Next Level' : 'Complete Round 1 Game'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        /* Round 1 Complete Summary Card */
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#34d399' }}>
            <Trophy size={36} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            Round 1 Complete — Electrical Challenge Result
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>
            You completed the Smart Power Distribution Challenge! Here is your demonstrated skill breakdown:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', textAlign: 'left' }}>
            {levelResults.map((r, idx) => (
              <div key={idx} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(17, 24, 39, 0.8)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{r.levelName}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>{r.score}%</div>
                <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>Skill: {r.skillTested}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onGameComplete && onGameComplete(levelResults, secondsSpent)}
            className="btn btn-primary"
            style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            <span>Continue to Round 2 — EEE Technical Quiz</span>
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartPowerGame;
