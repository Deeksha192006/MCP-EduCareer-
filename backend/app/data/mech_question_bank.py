# Comprehensive Seed Question Bank for 12th-Standard Mechanical Engineering (MECH)
# Covering all 20 Mechanical Engineering Topics across Easy, Medium, and Hard difficulty levels.

MECH_TOPICS = [
    "Engineering Mechanics",
    "Force and Motion",
    "Work, Energy and Power",
    "Friction",
    "Simple Machines",
    "Gears and Gear Systems",
    "Pulleys",
    "Mechanical Advantage",
    "Materials and Properties",
    "Manufacturing Basics",
    "Production Engineering",
    "Thermodynamics Basics",
    "Heat and Temperature",
    "Fluid Mechanics Basics",
    "Machine Elements",
    "Mechanical Design",
    "CAD/CAM Basics",
    "Automotive Engineering",
    "Robotics and Automation",
    "Industrial Engineering"
]

MECH_SEED_QUESTIONS = [
    # 1. Engineering Mechanics
    {
        "id": "mech_seed_1",
        "question": "Two equal forces of 50 N act on a rigid body in opposite directions along the same line of action. What is the net resultant force acting on the body?",
        "options": {
            "A": "0 N",
            "B": "100 N",
            "C": "25 N",
            "D": "50 N"
        },
        "correctAnswer": "A",
        "explanation": "Equal and opposite forces acting along the same line of action cancel each other out, producing a net force of 0 N.",
        "topic": "Engineering Mechanics",
        "difficulty": "Easy",
        "status": "approved"
    },
    {
        "id": "mech_seed_2",
        "question": "A beam supported at both ends carries a concentrated load of 200 N at its midpoint. What is the upward reaction force at each end support?",
        "options": {
            "A": "100 N at each support",
            "B": "200 N at each support",
            "C": "50 N at each support",
            "D": "400 N at each support"
        },
        "correctAnswer": "A",
        "explanation": "Due to symmetry, the central 200 N load is equally shared between the two end supports (200 N / 2 = 100 N).",
        "topic": "Engineering Mechanics",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 2. Force and Motion
    {
        "id": "mech_seed_3",
        "question": "According to Newton's Second Law of Motion (F = m × a), what force is required to accelerate a 10 kg flywheel at 5 m/s²?",
        "options": {
            "A": "50 N",
            "B": "2 N",
            "C": "15 N",
            "D": "500 N"
        },
        "correctAnswer": "A",
        "explanation": "Force = mass × acceleration = 10 kg × 5 m/s² = 50 N.",
        "topic": "Force and Motion",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 3. Work, Energy and Power
    {
        "id": "mech_seed_4",
        "question": "A mechanical hoist lifts a 100 kg load through a vertical height of 10 meters in 5 seconds. Taking g = 10 m/s², what is the mechanical power output?",
        "options": {
            "A": "2000 W (2 kW)",
            "B": "500 W",
            "C": "1000 W",
            "D": "5000 W"
        },
        "correctAnswer": "A",
        "explanation": "Work done = m × g × h = 100 × 10 × 10 = 10,000 J. Power = Work / time = 10,000 J / 5 s = 2,000 W.",
        "topic": "Work, Energy and Power",
        "difficulty": "Hard",
        "status": "approved"
    },

    # 4. Friction
    {
        "id": "mech_seed_5",
        "question": "Why are roller bearings used instead of sliding surfaces in heavy machinery shafts?",
        "options": {
            "A": "Rolling friction is significantly lower than sliding friction",
            "B": "Roller bearings eliminate mass completely",
            "C": "Rolling friction increases heat production",
            "D": "Sliding friction requires no lubrication"
        },
        "correctAnswer": "A",
        "explanation": "Rolling friction is much smaller than sliding friction, reducing energy loss and wear on rotating components.",
        "topic": "Friction",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 5. Simple Machines
    {
        "id": "mech_seed_6",
        "question": "Which class of lever has the effort located between the fulcrum and the load, such as in a pair of tweezers or a human forearm lifting a weight?",
        "options": {
            "A": "Class 3 Lever",
            "B": "Class 1 Lever",
            "C": "Class 2 Lever",
            "D": "Class 4 Lever"
        },
        "correctAnswer": "A",
        "explanation": "In a Class 3 lever, the effort applied lies between the fulcrum and the load.",
        "topic": "Simple Machines",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 6. Gears and Gear Systems
    {
        "id": "mech_seed_7",
        "question": "A small gear with 10 teeth drives a larger gear with 20 teeth. Compared with the small gear, how does the larger gear rotate?",
        "options": {
            "A": "Faster",
            "B": "Slower",
            "C": "At the exact same speed",
            "D": "It does not rotate"
        },
        "correctAnswer": "B",
        "explanation": "The larger gear rotates slower because it has more teeth (Gear Ratio = 20/10 = 2:1, so it rotates at half the speed).",
        "topic": "Gears and Gear Systems",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 7. Pulleys
    {
        "id": "mech_seed_8",
        "question": "In a block-and-tackle pulley system with 4 supporting rope segments carrying a 400 N weight, what ideal effort force is required to raise the load?",
        "options": {
            "A": "100 N",
            "B": "400 N",
            "C": "200 N",
            "D": "1600 N"
        },
        "correctAnswer": "A",
        "explanation": "Ideal effort = Total Load / Number of supporting rope segments = 400 N / 4 = 100 N.",
        "topic": "Pulleys",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 8. Mechanical Advantage
    {
        "id": "mech_seed_9",
        "question": "If a machine allows a user to lift a 600 N load by applying an effort force of 150 N, what is the Mechanical Advantage (MA) of the machine?",
        "options": {
            "A": "4",
            "B": "0.25",
            "C": "450",
            "D": "900"
        },
        "correctAnswer": "A",
        "explanation": "Mechanical Advantage = Load / Effort = 600 N / 150 N = 4.",
        "topic": "Mechanical Advantage",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 9. Materials and Properties
    {
        "id": "mech_seed_10",
        "question": "Which mechanical property describes a metal's ability to be drawn into thin wires without breaking?",
        "options": {
            "A": "Ductility",
            "B": "Malleability",
            "C": "Brittleness",
            "D": "Hardness"
        },
        "correctAnswer": "A",
        "explanation": "Ductility is the property that enables a material to undergo significant plastic deformation under tensile stress (e.g. drawn into wire).",
        "topic": "Materials and Properties",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 10. Manufacturing Basics
    {
        "id": "mech_seed_11",
        "question": "Which machine tool operates by rotating a workpiece against a stationary single-point cutting tool to produce cylindrical parts?",
        "options": {
            "A": "Lathe Machine",
            "B": "Milling Machine",
            "C": "Drilling Press",
            "D": "Grinding Machine"
        },
        "correctAnswer": "A",
        "explanation": "A lathe machine rotates the workpiece on an axis while a stationary cutting tool shapes it into cylindrical geometry.",
        "topic": "Manufacturing Basics",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 11. Production Engineering
    {
        "id": "mech_seed_12",
        "question": "What is the primary function of a 'Jig' in high-volume production manufacturing?",
        "options": {
            "A": "To hold the workpiece AND guide the cutting tool simultaneously",
            "B": "To hold the workpiece only without guiding the tool",
            "C": "To measure the surface roughness of finished parts",
            "D": "To melt raw material prior to casting"
        },
        "correctAnswer": "A",
        "explanation": "Unlike a fixture (which only holds workpieces), a jig holds, supports, locates the workpiece, AND guides the cutting tool.",
        "topic": "Production Engineering",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 12. Thermodynamics Basics
    {
        "id": "mech_seed_13",
        "question": "Which law of thermodynamics establishes that energy cannot be created or destroyed, only transformed from one form to another?",
        "options": {
            "A": "First Law of Thermodynamics",
            "B": "Zeroth Law of Thermodynamics",
            "C": "Second Law of Thermodynamics",
            "D": "Third Law of Thermodynamics"
        },
        "correctAnswer": "A",
        "explanation": "The First Law of Thermodynamics is the Law of Conservation of Energy.",
        "topic": "Thermodynamics Basics",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 13. Heat and Temperature
    {
        "id": "mech_seed_14",
        "question": "What primary mode of heat transfer allows thermal energy to travel through solid metal engine blocks via direct atomic vibrations?",
        "options": {
            "A": "Conduction",
            "B": "Convection",
            "C": "Radiation",
            "D": "Advection"
        },
        "correctAnswer": "A",
        "explanation": "Conduction is the transfer of heat through solid materials without macroscopic movement of the material itself.",
        "topic": "Heat and Temperature",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 14. Fluid Mechanics Basics
    {
        "id": "mech_seed_15",
        "question": "According to Pascal's Law, when pressure is applied to a confined fluid in a hydraulic brake system, how is the pressure transmitted?",
        "options": {
            "A": "Equally and undiminished in all directions",
            "B": "Only in the downward vertical direction",
            "C": "Decreasing proportional to distance",
            "D": "Only toward the brake pedal"
        },
        "correctAnswer": "A",
        "explanation": "Pascal's law states that pressure applied to a confined fluid is transmitted undiminished equally throughout the fluid.",
        "topic": "Fluid Mechanics Basics",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 15. Machine Elements
    {
        "id": "mech_seed_16",
        "question": "What machine element is specifically designed to store mechanical energy during one part of a cycle and release it smoothly to control speed fluctuations?",
        "options": {
            "A": "Flywheel",
            "B": "Coupling",
            "C": "Keyway",
            "D": "Fastener"
        },
        "correctAnswer": "A",
        "explanation": "A flywheel acts as a kinetic energy storage device that absorbs energy during peak power strokes and releases it to smooth rotational speed.",
        "topic": "Machine Elements",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 16. Mechanical Design
    {
        "id": "mech_seed_17",
        "question": "If a structural steel shaft has an ultimate tensile strength of 400 MPa and is designed with a Factor of Safety (FoS) of 4, what is the allowable working stress?",
        "options": {
            "A": "100 MPa",
            "B": "1600 MPa",
            "C": "400 MPa",
            "D": "200 MPa"
        },
        "correctAnswer": "A",
        "explanation": "Allowable Working Stress = Ultimate Strength / Factor of Safety = 400 MPa / 4 = 100 MPa.",
        "topic": "Mechanical Design",
        "difficulty": "Hard",
        "status": "approved"
    },

    # 17. CAD/CAM Basics
    {
        "id": "mech_seed_18",
        "question": "In Computer-Aided Design (CAD), what does 3D solid parametric modeling allow engineers to do when altering a dimension?",
        "options": {
            "A": "Automatically update all dependent geometric features and drawings",
            "B": "Delete the entire model permanently",
            "C": "Convert the 3D model into an analog paper drawing",
            "D": "Change the physical weight without altering shape"
        },
        "correctAnswer": "A",
        "explanation": "Parametric CAD establishes relationships between parameters; updating one dimension automatically propagates updates across dependent features.",
        "topic": "CAD/CAM Basics",
        "difficulty": "Medium",
        "status": "approved"
    },

    # 18. Automotive Engineering
    {
        "id": "mech_seed_19",
        "question": "In a 4-stroke Internal Combustion (IC) engine, during which stroke is mechanical work produced to drive the vehicle forward?",
        "options": {
            "A": "Power (Expansion) Stroke",
            "B": "Suction (Intake) Stroke",
            "C": "Compression Stroke",
            "D": "Exhaust Stroke"
        },
        "correctAnswer": "A",
        "explanation": "The power stroke (expansion stroke) occurs after fuel ignition, driving the piston downward to produce useful output work.",
        "topic": "Automotive Engineering",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 19. Robotics and Automation
    {
        "id": "mech_seed_20",
        "question": "What mechanical device converts electrical or fluid power into physical linear or rotational mechanical motion in an automated robotic arm?",
        "options": {
            "A": "Actuator",
            "B": "Sensor",
            "C": "Microcontroller",
            "D": "Resistor"
        },
        "correctAnswer": "A",
        "explanation": "An actuator (such as a motor or hydraulic cylinder) converts input energy into physical motion in robotic joints.",
        "topic": "Robotics and Automation",
        "difficulty": "Easy",
        "status": "approved"
    },

    # 20. Industrial Engineering
    {
        "id": "mech_seed_21",
        "question": "What is the primary focus of Ergonomics (Human Factors Engineering) in industrial workplace design?",
        "options": {
            "A": "Designing equipment and tasks to fit human anatomical and physical capabilities safely",
            "B": "Maximizing raw material electrical conductivity",
            "C": "Calculating thermal efficiency of boilers",
            "D": "Programming CNC g-code files"
        },
        "correctAnswer": "A",
        "explanation": "Ergonomics optimizes human well-being and overall system performance by fitting tools and tasks to the human operator.",
        "topic": "Industrial Engineering",
        "difficulty": "Easy",
        "status": "approved"
    }
]
