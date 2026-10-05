import React, { useState, useEffect } from 'react';
import { Zap, Play, RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Gauge, Trophy, Lightbulb, Power, Cpu, Activity, RefreshCw } from 'lucide-react';

const ECE_GAME_LEVELS = [
  {
    id: "ece_lvl_1",
    name: "Level 1 — Visual Circuit Assembly",
    skillTested: "Circuit Reasoning",
    difficulty: "easy",
    instruction: "Place the required components onto the breadboard slots and toggle the switch to complete the closed loop and turn ON the LED!",
    requiredSlotIds: ["battery", "switch", "resistor", "led"]
  },
  {
    id: "ece_lvl_2",
    name: "Level 2 — Reverse Polarity Fault Repair",
    skillTested: "Logical Thinking & Problem Solving",
    difficulty: "medium",
    instruction: "The LED is currently reverse-biased (Cathode connected to positive voltage). Click 'Flip LED Polarity' to fix the fault!",
    faultType: "reverse_polarity"
  },
  {
    id: "ece_lvl_3",
    name: "Level 3 — Overcurrent Protection Challenge",
    skillTested: "Problem Solving & Decision Making",
    difficulty: "medium",
    instruction: "Without a current-limiting resistor, 9V direct current will burn out the LED! Select the correct 220 Ω Resistor to protect the circuit.",
    options: [
      { id: "none", name: "Direct Wire (0 Ω)", isCorrect: false, warning: "🔥 OVERCURRENT! 9V without resistor burns out the LED instantly!" },
      { id: "res220", name: "220 Ω Resistor", isCorrect: true, note: "✨ Perfect! Limits current to safe 13.6 mA level." },
      { id: "cap10", name: "10 µF Capacitor", isCorrect: false, warning: "⚡ Blocks DC current after initial charge. LED stays OFF." }
    ]
  },
  {
    id: "ece_lvl_4",
    name: "Level 4 — Signal Processing Route",
    skillTested: "Signal Understanding & System Thinking",
    difficulty: "hard",
    instruction: "Connect the signal processing stages to transmit microphone audio waveform to the speaker output without distortion.",
    stages: [
      { id: "mic", name: "Mic Input (Analog)", status: "Active Waveform" },
      { id: "amp", name: "Preamplifier", status: "Boost Small Signal" },
      { id: "filter", name: "Bandpass Filter", status: "Remove 50Hz Noise" },
      { id: "power", name: "Power Amplifier", status: "Drive Speaker Coil" },
      { id: "speaker", name: "Speaker Output", status: "Sound Output" }
    ]
  },
  {
    id: "ece_lvl_5",
    name: "Level 5 — Dual Battery Parallel Configuration",
    skillTested: "Circuit Reasoning & Decision Making",
    difficulty: "hard",
    instruction: "To double operating battery lifespan without exceeding the 3.0V LED operating threshold, configure two 3.0V batteries in PARALLEL.",
    configs: [
      { id: "series", name: "Series Connection (3V + 3V = 6V)", isCorrect: false, text: "Doubles voltage to 6V — LED receives double voltage rating!" },
      { id: "parallel", name: "Parallel Connection (3V | 3V)", isCorrect: true, text: "Maintains 3.0V output while doubling total Amp-hour capacity! ✨" }
    ]
  }
];

const ECECircuitGame = ({ onGameComplete }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [levelResults, setLevelResults] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // Level 1 Board Component Placement
  const [placedSlots, setPlacedSlots] = useState([]);
  const [switchState, setSwitchState] = useState(false); // false = OFF, true = ON

  // Level 2 Polarity State
  const [ledPolarityFlipped, setLedPolarityFlipped] = useState(false);

  // Level 3 Component Selection
  const [selectedResistorId, setSelectedResistorId] = useState(null);

  // Level 5 Configuration Choice
  const [selectedConfigId, setSelectedConfigId] = useState(null);

  // Timer
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const currentLevel = ECE_GAME_LEVELS[currentLevelIdx];

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
    // Reset level states
    setPlacedSlots([]);
    setSwitchState(false);
    setLedPolarityFlipped(false);
    setSelectedResistorId(null);
    setSelectedConfigId(null);
    setAttempts(1);
  }, [currentLevelIdx]);

  // Level 1 logic
  const handleToggleSlot = (slotId) => {
    if (placedSlots.includes(slotId)) {
      setPlacedSlots(placedSlots.filter(s => s !== slotId));
    } else {
      setPlacedSlots([...placedSlots, slotId]);
    }
  };

  const isLevel1CircuitComplete = placedSlots.length === 4 && switchState;

  const handleNextLevel = () => {
    let isCorrect = false;

    if (currentLevel.id === "ece_lvl_1") {
      isCorrect = isLevel1CircuitComplete;
    } else if (currentLevel.id === "ece_lvl_2") {
      isCorrect = ledPolarityFlipped && switchState;
    } else if (currentLevel.id === "ece_lvl_3") {
      const opt = currentLevel.options.find(o => o.id === selectedResistorId);
      isCorrect = opt?.isCorrect === true;
    } else if (currentLevel.id === "ece_lvl_4") {
      isCorrect = switchState;
    } else if (currentLevel.id === "ece_lvl_5") {
      const opt = currentLevel.configs.find(c => c.id === selectedConfigId);
      isCorrect = opt?.isCorrect === true;
    }

    const levelScore = isCorrect ? 100 : Math.max(20, 100 - (attempts * 25));

    const levelRecord = {
      levelId: currentLevel.id,
      levelName: currentLevel.name,
      skillTested: currentLevel.skillTested,
      difficulty: currentLevel.difficulty,
      score: levelScore,
      accuracy: isCorrect ? 1.0 : 0.2,
      timeTaken: 20,
      attempts: attempts,
      completed: true
    };

    const newResults = [...levelResults, levelRecord];
    setLevelResults(newResults);

    if (currentLevelIdx < ECE_GAME_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setTimerActive(false);
      setIsGameOver(true);

      if (onGameComplete) {
        onGameComplete(newResults, secondsSpent);
      }
    }
  };

  return (
    <div className="game-container" style={{ width: '100%', color: 'var(--text-main)' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'rgba(17, 24, 39, 0.9)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: '12px',
        marginBottom: '20px',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', padding: '4px 10px', background: '#06b6d4', borderRadius: '6px', color: 'black' }}>
            {currentLevel.name}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Level {currentLevelIdx + 1} of 5
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} style={{ color: switchState ? '#10b981' : '#6b7280' }} />
            <span>Circuit State: <strong style={{ color: switchState ? '#10b981' : '#fca5a5' }}>{switchState ? 'CLOSED (ON)' : 'OPEN (OFF)'}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={16} style={{ color: '#f59e0b' }} />
            <span>Time: <strong>{secondsSpent}s</strong></span>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div>
          <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '20px' }}>
            {currentLevel.instruction}
          </p>

          {/* VISUAL CIRCUIT WORKSPACE CANVAS */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '340px',
            background: 'radial-gradient(circle at 50% 50%, rgba(23, 32, 54, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '20px',
            padding: '20px'
          }}>
            {/* SVG Wire Loops */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              {/* Circuit Wire Loop Paths */}
              <rect
                x="80"
                y="60"
                width="640"
                height="220"
                rx="16"
                fill="none"
                stroke={switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={switchState ? "4" : "2"}
                strokeDasharray={switchState ? "none" : "6 6"}
              />

              {/* Animated Current Flow Indicator when ON */}
              {switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) && (
                <rect
                  x="80"
                  y="60"
                  width="640"
                  height="220"
                  rx="16"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="12 12"
                  className="pulse-wire"
                />
              )}
            </svg>

            {/* CIRCUIT COMPONENTS RENDER ON BOARD */}
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              {/* TOP ROW: BATTERY & SWITCH */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {/* Battery Block */}
                <div style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: placedSlots.includes("battery") || currentLevelIdx > 0 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  textAlign: 'center',
                  minWidth: '140px'
                }}>
                  <Zap size={22} style={{ color: '#f59e0b', marginBottom: '4px' }} />
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>9V DC Battery</div>
                  <div style={{ fontSize: '11px', color: '#93c5fd' }}>(+) Power Source (-)</div>
                </div>

                {/* Toggle Switch Block */}
                <div
                  onClick={() => setSwitchState(!switchState)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: switchState ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(239, 68, 68, 0.2)',
                    border: switchState ? '2px solid #10b981' : '2px solid #ef4444',
                    color: 'white',
                    textAlign: 'center',
                    cursor: 'pointer',
                    minWidth: '140px',
                    boxShadow: switchState ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none'
                  }}
                >
                  <Power size={22} style={{ marginBottom: '4px' }} />
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Toggle Switch</div>
                  <div style={{ fontSize: '11px', fontWeight: '700' }}>
                    {switchState ? 'STATE: ON (CLOSED)' : 'STATE: OFF (CLICK TO FLIP)'}
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: RESISTOR & LED */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {/* Resistor Block */}
                <div style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: placedSlots.includes("resistor") || selectedResistorId === "res220" || currentLevelIdx > 0 ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  textAlign: 'center',
                  minWidth: '140px'
                }}>
                  <Cpu size={22} style={{ color: '#c084fc', marginBottom: '4px' }} />
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>220 Ω Resistor</div>
                  <div style={{ fontSize: '11px', color: '#e9d5ff' }}>Current Limiter</div>
                </div>

                {/* LED Light Bulb Component */}
                <div style={{
                  padding: '16px 24px',
                  borderRadius: '16px',
                  background: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped)
                    ? 'radial-gradient(circle, #fef08a 0%, #ca8a04 100%)' 
                    : 'rgba(255,255,255,0.08)',
                  border: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped)
                    ? '3px solid #fde047'
                    : '2px solid rgba(255,255,255,0.2)',
                  color: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '#713f12' : 'white',
                  textAlign: 'center',
                  minWidth: '150px',
                  boxShadow: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '0 0 30px rgba(250, 204, 21, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <Lightbulb size={28} style={{ marginBottom: '4px', fill: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '#facc15' : 'none' }} />
                  <div style={{ fontWeight: '800', fontSize: '15px' }}>
                    {switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? 'LED GLOWING ✨' : 'LED OFF'}
                  </div>
                  <div style={{ fontSize: '11px' }}>
                    {currentLevel.id === "ece_lvl_2" && !ledPolarityFlipped ? 'Reverse Polarity Fault' : 'Light Emitting Diode'}
                  </div>
                </div>
              </div>

              {/* REAL-TIME MULTIMETER DISPLAY */}
              <div style={{
                background: 'rgba(17, 24, 39, 0.85)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                justify: 'space-between',
                fontSize: '12px',
                color: 'var(--text-muted)'
              }}>
                <span>Multimeter Voltage: <strong style={{ color: '#06b6d4' }}>{switchState ? '3.0 V' : '0.0 V'}</strong></span>
                <span>Current Draw: <strong style={{ color: '#10b981' }}>{switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '13.6 mA' : '0.0 mA'}</strong></span>
                <span>Circuit Status: <strong style={{ color: switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? '#10b981' : '#f59e0b' }}>
                  {switchState && (currentLevel.id !== "ece_lvl_2" || ledPolarityFlipped) ? 'Closed Loop Complete' : 'Open / Incomplete Loop'}
                </strong></span>
              </div>
            </div>
          </div>

          {/* LEVEL SPECIFIC CONTROLS */}
          {currentLevel.id === "ece_lvl_1" && (
            <div style={{ background: 'rgba(23, 32, 54, 0.7)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#06b6d4', marginBottom: '10px' }}>PLACE BREADBOARD COMPONENTS:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {["battery", "switch", "resistor", "led"].map(slotId => (
                  <button
                    key={slotId}
                    onClick={() => handleToggleSlot(slotId)}
                    className="btn btn-outline"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      background: placedSlots.includes(slotId) ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                      borderColor: placedSlots.includes(slotId) ? '#10b981' : 'var(--border-color)',
                      color: placedSlots.includes(slotId) ? '#10b981' : 'white'
                    }}
                  >
                    {placedSlots.includes(slotId) ? '✓ ' + slotId.toUpperCase() + ' PLACED' : '+ ADD ' + slotId.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentLevel.id === "ece_lvl_2" && (
            <div style={{ background: 'rgba(23, 32, 54, 0.7)', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>Fault Detected: Reverse Polarity</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>LED cathode is facing positive rail. Flip polarity to allow forward current.</div>
              </div>
              <button
                onClick={() => setLedPolarityFlipped(!ledPolarityFlipped)}
                className="btn btn-primary"
                style={{ padding: '10px 20px', background: ledPolarityFlipped ? '#10b981' : '#3b82f6' }}
              >
                {ledPolarityFlipped ? '✓ Polarity Fixed (Forward Bias)' : 'Flip LED Polarity'}
              </button>
            </div>
          )}

          {currentLevel.id === "ece_lvl_3" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {currentLevel.options.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedResistorId(opt.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: selectedResistorId === opt.id ? 'rgba(6, 182, 212, 0.25)' : 'rgba(23, 32, 54, 0.7)',
                    border: selectedResistorId === opt.id ? '2px solid #06b6d4' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'white', marginBottom: '4px' }}>{opt.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.note || opt.warning}</div>
                </div>
              ))}
            </div>
          )}

          {currentLevel.id === "ece_lvl_5" && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {currentLevel.configs.map(cfg => (
                <div
                  key={cfg.id}
                  onClick={() => setSelectedConfigId(cfg.id)}
                  style={{
                    padding: '18px',
                    borderRadius: '12px',
                    background: selectedConfigId === cfg.id ? 'rgba(139, 92, 246, 0.25)' : 'rgba(23, 32, 54, 0.7)',
                    border: selectedConfigId === cfg.id ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'white', marginBottom: '6px' }}>{cfg.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cfg.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleNextLevel}
              disabled={!switchState && currentLevel.id !== "ece_lvl_3" && currentLevel.id !== "ece_lvl_5"}
              className="btn btn-primary"
              style={{
                padding: '12px 28px',
                fontWeight: '700',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
              }}
            >
              <span>{currentLevelIdx === ECE_GAME_LEVELS.length - 1 ? 'Finish Circuit Builder Game' : 'Submit Circuit Route'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', background: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
          <Trophy size={48} style={{ color: '#10b981', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Round 1 — Circuit Builder Challenge Complete!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Visual circuit workspace levels solved. Performance recorded.</p>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>
            Game Score: {Math.round(levelResults.reduce((a, b) => a + b.score, 0) / levelResults.length)} / 100
          </div>
          <div style={{ color: '#10b981', fontWeight: '600' }}>✓ Saved to ECE Assessment Engine</div>
        </div>
      )}
    </div>
  );
};

export default ECECircuitGame;
