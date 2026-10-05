"""
IT Seed Question Bank containing high-quality questions for 12th-standard IT Exploration across 15 topics.
"""

IT_TOPICS = [
    "Computer Fundamentals",
    "Programming Basics",
    "Algorithms",
    "Data Structures Basics",
    "Database Basics",
    "SQL Basics",
    "Web Technology Basics",
    "Computer Networks",
    "Cybersecurity Basics",
    "Cloud Computing Basics",
    "Artificial Intelligence Basics",
    "Data Science Basics",
    "Operating System Basics",
    "Software Engineering",
    "Digital Technology"
]

IT_SEED_QUESTIONS = [
    # 1. Computer Fundamentals
    {
        "id": "it_q_101",
        "topic": "Computer Fundamentals",
        "difficulty": "Easy",
        "question": "Which hardware component performs mathematical and logical operations in a computer CPU?",
        "options": {
            "A": "Control Unit (CU)",
            "B": "Arithmetic Logic Unit (ALU)",
            "C": "Random Access Memory (RAM)",
            "B": "Arithmetic Logic Unit (ALU)",
            "D": "Solid State Drive (SSD)"
        },
        "correctAnswer": "B",
        "explanation": "The Arithmetic Logic Unit (ALU) inside the CPU executes binary arithmetic and boolean logic operations.",
        "status": "approved"
    },
    {
        "id": "it_q_102",
        "topic": "Computer Fundamentals",
        "difficulty": "Medium",
        "question": "What is the primary difference between RAM and ROM?",
        "options": {
            "A": "RAM is non-volatile while ROM is volatile",
            "B": "RAM is volatile memory used for active tasks, whereas ROM is permanent non-volatile memory storing startup code",
            "C": "RAM stores data permanently while ROM clears data when powered off",
            "D": "RAM is slower than secondary storage drives"
        },
        "correctAnswer": "B",
        "explanation": "RAM holds temporary data for active programs and loses its contents when powered off (volatile). ROM holds permanent firmware like BIOS.",
        "status": "approved"
    },
    # 2. Programming Basics
    {
        "id": "it_q_103",
        "topic": "Programming Basics",
        "difficulty": "Easy",
        "question": "What will be the final value of variable 'count' after executing: count = 5; count = count + 3 * 2?",
        "options": {
            "A": "16",
            "B": "11",
            "C": "13",
            "D": "10"
        },
        "correctAnswer": "B",
        "explanation": "Following operator precedence (multiplication before addition), 3 * 2 = 6, and 5 + 6 = 11.",
        "status": "approved"
    },
    {
        "id": "it_q_104",
        "topic": "Programming Basics",
        "difficulty": "Medium",
        "question": "Which programming construct is used to execute a set of instructions repeatedly as long as a condition remains True?",
        "options": {
            "A": "Conditional statement (if-else)",
            "B": "Loop (while/for)",
            "C": "Function definition",
            "D": "Variable declaration"
        },
        "correctAnswer": "B",
        "explanation": "Loops repeatedly execute a block of code while their specified boolean condition evaluates to True.",
        "status": "approved"
    },
    # 3. Algorithms
    {
        "id": "it_q_105",
        "topic": "Algorithms",
        "difficulty": "Medium",
        "question": "In a sorted list of 16 numbers, what is the maximum number of comparisons Binary Search requires to find a target value?",
        "options": {
            "A": "16",
            "B": "8",
            "C": "4",
            "D": "5"
        },
        "correctAnswer": "D",
        "explanation": "Binary search divides the search space in half at each step (log2(16) = 4, so at most 5 comparisons including base checks).",
        "status": "approved"
    },
    {
        "id": "it_q_106",
        "topic": "Algorithms",
        "difficulty": "Hard",
        "question": "What is an algorithm's Time Complexity primarily used to evaluate?",
        "options": {
            "A": "The exact clock runtime in milliseconds on a specific computer",
            "B": "How the algorithm's execution time grows as the input size increases",
            "C": "The physical disk storage required to save the source code",
            "D": "The number of lines of code written in the program file"
        },
        "correctAnswer": "B",
        "explanation": "Time complexity measures how algorithm execution time scales relative to input size N (Big-O notation).",
        "status": "approved"
    },
    # 4. Data Structures Basics
    {
        "id": "it_q_107",
        "topic": "Data Structures Basics",
        "difficulty": "Easy",
        "question": "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
        "options": {
            "A": "Queue",
            "B": "Stack",
            "C": "Array",
            "D": "Linked List"
        },
        "correctAnswer": "B",
        "explanation": "A Stack processes items such that the last item inserted is the first item removed (LIFO), like a stack of plates.",
        "status": "approved"
    },
    {
        "id": "it_q_108",
        "topic": "Data Structures Basics",
        "difficulty": "Medium",
        "question": "How does a Queue data structure differ from a Stack?",
        "options": {
            "A": "Queue is LIFO while Stack is FIFO",
            "B": "Queue is First-In, First-Out (FIFO) while Stack is Last-In, First-Out (LIFO)",
            "C": "Queue allows random access to elements by index",
            "D": "Stack allows insertion at both ends simultaneously"
        },
        "correctAnswer": "B",
        "explanation": "A Queue operates on FIFO (First-In, First-Out) like a line of people, while Stack operates on LIFO.",
        "status": "approved"
    },
    # 5. Database Basics
    {
        "id": "it_q_109",
        "topic": "Database Basics",
        "difficulty": "Easy",
        "question": "What is a Primary Key in a relational database table?",
        "options": {
            "A": "A field that contains password credentials",
            "B": "A column or set of columns that uniquely identifies each record in a table",
            "C": "A key used to encrypt database files",
            "D": "The first column created in any database table"
        },
        "correctAnswer": "B",
        "explanation": "A Primary Key uniquely identifies each row in a database table and cannot contain NULL values.",
        "status": "approved"
    },
    {
        "id": "it_q_110",
        "topic": "Database Basics",
        "difficulty": "Medium",
        "question": "Which term describes a foreign key in a database table?",
        "options": {
            "A": "A key stored on an external USB flash drive",
            "B": "A field in one table that references the primary key of another table to link records",
            "C": "A key generated by third-party software",
            "D": "A database field that stores foreign language text"
        },
        "correctAnswer": "B",
        "explanation": "A foreign key establishes a relational link between records in two different tables.",
        "status": "approved"
    },
    # 6. SQL Basics
    {
        "id": "it_q_111",
        "topic": "SQL Basics",
        "difficulty": "Easy",
        "question": "Which SQL command is used to retrieve data from a database table?",
        "options": {
            "A": "GET",
            "B": "FETCH",
            "C": "SELECT",
            "D": "OPEN"
        },
        "correctAnswer": "C",
        "explanation": "The SELECT statement in SQL retrieves columns and rows from database tables.",
        "status": "approved"
    },
    {
        "id": "it_q_112",
        "topic": "SQL Basics",
        "difficulty": "Medium",
        "question": "Which clause is added to a SQL SELECT query to filter rows based on a specific condition?",
        "options": {
            "A": "GROUP BY",
            "B": "ORDER BY",
            "C": "WHERE",
            "D": "HAVING"
        },
        "correctAnswer": "C",
        "explanation": "The WHERE clause filters rows meeting specified logical conditions before query results are returned.",
        "status": "approved"
    },
    # 7. Web Technology Basics
    {
        "id": "it_q_113",
        "topic": "Web Technology Basics",
        "difficulty": "Easy",
        "question": "What is the primary role of HTML in modern web development?",
        "options": {
            "A": "Styling colors and animations",
            "B": "Defining the structure and content of a web page",
            "C": "Handling server database logic",
            "D": "Securing web domain certificates"
        },
        "correctAnswer": "B",
        "explanation": "HTML (HyperText Markup Language) defines elements, headings, paragraphs, and structure of web documents.",
        "status": "approved"
    },
    {
        "id": "it_q_114",
        "topic": "Web Technology Basics",
        "difficulty": "Medium",
        "question": "What is the function of HTTP/HTTPS protocols on the Internet?",
        "options": {
            "A": "To compile Python code into binary executable files",
            "B": "To define standard request-response communication rules between web browsers and servers",
            "C": "To design graphic assets for web interfaces",
            "D": "To manage physical fiber optic underground cables"
        },
        "correctAnswer": "B",
        "explanation": "HTTP/HTTPS protocols govern how messages and web pages are formatted and transmitted between web clients and web servers.",
        "status": "approved"
    },
    # 8. Computer Networks
    {
        "id": "it_q_115",
        "topic": "Computer Networks",
        "difficulty": "Easy",
        "question": "What is the unique numerical address assigned to every device connected to an IP-based computer network?",
        "options": {
            "A": "MAC Address",
            "B": "IP Address",
            "C": "URL String",
            "D": "DNS Identifier"
        },
        "correctAnswer": "B",
        "explanation": "An IP Address (e.g. 192.168.1.1 or IPv6) uniquely identifies network devices for routing data packets.",
        "status": "approved"
    },
    {
        "id": "it_q_116",
        "topic": "Computer Networks",
        "difficulty": "Medium",
        "question": "What is the main role of a DNS (Domain Name System) server?",
        "options": {
            "A": "To block viral malware on computers",
            "B": "To translate human-readable domain names (like google.com) into numerical IP addresses",
            "C": "To speed up computer processor clock speed",
            "D": "To compress video files for online streaming"
        },
        "correctAnswer": "B",
        "explanation": "DNS acts as the phonebook of the Internet, resolving domain names into numerical IP addresses.",
        "status": "approved"
    },
    # 9. Cybersecurity Basics
    {
        "id": "it_q_117",
        "topic": "Cybersecurity Basics",
        "difficulty": "Easy",
        "question": "What is Phishing in cybersecurity?",
        "options": {
            "A": "Cleaning temporary files from a hard drive",
            "B": "A fraudulent attempt to trick users into revealing sensitive data via fake emails or websites",
            "C": "Scanning a network for available Wi-Fi signals",
            "D": "Optimizing server response time"
        },
        "correctAnswer": "B",
        "explanation": "Phishing involves deceitful emails or websites impersonating trustworthy entities to steal credentials or financial details.",
        "status": "approved"
    },
    {
        "id": "it_q_118",
        "topic": "Cybersecurity Basics",
        "difficulty": "Medium",
        "question": "What does Two-Factor Authentication (2FA) add to user logins?",
        "options": {
            "A": "It doubles the Internet speed during login",
            "B": "An additional layer of security requiring two separate pieces of evidence (e.g. password + phone code)",
            "C": "Automatic password changing every 2 minutes",
            "D": "A requirement to use two keyboards simultaneously"
        },
        "correctAnswer": "B",
        "explanation": "2FA enhances account protection by requiring two distinct factors: something you know (password) and something you have (OTP/authenticator app).",
        "status": "approved"
    },
    # 10. Cloud Computing Basics
    {
        "id": "it_q_119",
        "topic": "Cloud Computing Basics",
        "difficulty": "Easy",
        "question": "What is Cloud Computing?",
        "options": {
            "A": "Storing files only on local USB flash drives",
            "B": "Delivering computing services like servers, storage, and databases over the Internet on demand",
            "C": "Weather forecasting using satellite imagery",
            "D": "Using wireless Bluetooth headphones"
        },
        "correctAnswer": "B",
        "explanation": "Cloud computing allows users to access remote compute and storage infrastructure over the Internet without managing local physical servers.",
        "status": "approved"
    },
    {
        "id": "it_q_120",
        "topic": "Cloud Computing Basics",
        "difficulty": "Medium",
        "question": "Which model provides software applications hosted on the cloud directly to end-users via web browsers?",
        "options": {
            "A": "Infrastructure as a Service (IaaS)",
            "B": "Platform as a Service (PaaS)",
            "C": "Software as a Service (SaaS)",
            "D": "Hardware as a Service (HaaS)"
        },
        "correctAnswer": "C",
        "explanation": "SaaS (Software as a Service) delivers ready-to-use software applications like Google Workspace or Microsoft 365 over the cloud.",
        "status": "approved"
    },
    # 11. Artificial Intelligence Basics
    {
        "id": "it_q_121",
        "topic": "Artificial Intelligence Basics",
        "difficulty": "Easy",
        "question": "What is Machine Learning?",
        "options": {
            "A": "Assembling hardware computer parts automatically",
            "B": "A branch of AI that enables systems to learn and improve from data without being explicitly programmed",
            "C": "Writing manual HTML code for websites",
            "D": "Cleaning computer dust with automated vacuums"
        },
        "correctAnswer": "B",
        "explanation": "Machine Learning algorithms use pattern recognition in historical training data to make predictions or decisions.",
        "status": "approved"
    },
    {
        "id": "it_q_122",
        "topic": "Artificial Intelligence Basics",
        "difficulty": "Hard",
        "question": "What is the fundamental difference between Supervised Learning and Unsupervised Learning?",
        "options": {
            "A": "Supervised learning uses labeled training target output data, while unsupervised learning discovers patterns in unlabeled data",
            "B": "Supervised learning requires human teachers to type code during execution",
            "C": "Unsupervised learning is only used for numerical calculation",
            "D": "Supervised learning runs without computer hardware"
        },
        "correctAnswer": "A",
        "explanation": "Supervised learning trains models on input-output pairs with known labels; unsupervised learning identifies hidden clusters/structures in unlabeled inputs.",
        "status": "approved"
    },
    # 12. Data Science Basics
    {
        "id": "it_q_123",
        "topic": "Data Science Basics",
        "difficulty": "Easy",
        "question": "What is Data Visualization?",
        "options": {
            "A": "Printing text reports on paper",
            "B": "Representing data visually through charts, graphs, and maps to identify trends and insights",
            "C": "Scanning photos using a camera",
            "D": "Encrypting secret database files"
        },
        "correctAnswer": "B",
        "explanation": "Data visualization translates complex raw data into visual formats like charts to communicate insights clearly.",
        "status": "approved"
    },
    {
        "id": "it_q_124",
        "topic": "Data Science Basics",
        "difficulty": "Medium",
        "question": "In a dataset with values [10, 20, 30, 40, 100], what is the Median value?",
        "options": {
            "A": "40",
            "B": "30",
            "C": "20",
            "D": "100"
        },
        "correctAnswer": "B",
        "explanation": "When sorted, the median is the middle value of an odd-sized dataset. For [10, 20, 30, 40, 100], the 3rd (middle) value is 30.",
        "status": "approved"
    },
    # 13. Operating System Basics
    {
        "id": "it_q_125",
        "topic": "Operating System Basics",
        "difficulty": "Easy",
        "question": "What is the primary role of an Operating System (OS)?",
        "options": {
            "A": "To design logos for companies",
            "B": "To manage computer hardware resources and provide a software platform for applications",
            "C": "To connect to external Wi-Fi routers automatically",
            "D": "To clean viral files from email attachments"
        },
        "correctAnswer": "B",
        "explanation": "The OS acts as the core interface between computer hardware and software application programs.",
        "status": "approved"
    },
    {
        "id": "it_q_126",
        "topic": "Operating System Basics",
        "difficulty": "Medium",
        "question": "What is Multitasking in an Operating System?",
        "options": {
            "A": "Having multiple monitors connected to one CPU",
            "B": "The ability of an OS to run or switch between multiple active programs simultaneously",
            "C": "Installing two operating systems on one hard drive",
            "D": "Using two mice at the same time"
        },
        "correctAnswer": "B",
        "explanation": "Multitasking allows the OS to share CPU time across multiple running tasks and applications seamlessly.",
        "status": "approved"
    },
    # 14. Software Engineering
    {
        "id": "it_q_127",
        "topic": "Software Engineering",
        "difficulty": "Easy",
        "question": "What is Version Control System (e.g. Git) used for?",
        "options": {
            "A": "Testing computer monitor resolution",
            "B": "Tracking changes in software code files over time and enabling team collaboration",
            "C": "Increasing laptop battery life",
            "D": "Formatting hard disks automatically"
        },
        "correctAnswer": "B",
        "explanation": "Version control systems maintain revision histories of source code and allow developers to merge code changes safely.",
        "status": "approved"
    },
    {
        "id": "it_q_128",
        "topic": "Software Engineering",
        "difficulty": "Medium",
        "question": "What is the main goal of Software Testing?",
        "options": {
            "A": "To rewrite the code in a different programming language",
            "B": "To verify that software meets requirements and detect defects/bugs before deployment",
            "C": "To sell the software online",
            "D": "To design promotional marketing posters"
        },
        "correctAnswer": "B",
        "explanation": "Software testing validates software correctness, functionality, and security against specified requirements.",
        "status": "approved"
    },
    # 15. Digital Technology
    {
        "id": "it_q_129",
        "topic": "Digital Technology",
        "difficulty": "Easy",
        "question": "What does IoT (Internet of Things) refer to?",
        "options": {
            "A": "A search engine for online shopping",
            "B": "A network of physical devices embedded with sensors and software connected to the Internet",
            "C": "A tool for converting paper files to PDFs",
            "D": "A satellite TV broadcasting standard"
        },
        "correctAnswer": "B",
        "explanation": "IoT connects everyday smart objects (appliances, smart meters, sensors) to exchange data over the internet.",
        "status": "approved"
    },
    {
        "id": "it_q_130",
        "topic": "Digital Technology",
        "difficulty": "Medium",
        "question": "Which technology forms the underlying decentralized ledger mechanism behind cryptocurrencies?",
        "options": {
            "A": "Cloud Virtualization",
            "B": "Blockchain Technology",
            "C": "Relational Database Management",
            "D": "Optical Fiber Switching"
        },
        "correctAnswer": "B",
        "explanation": "Blockchain is an immutable, distributed digital ledger that records transactions securely across peer-to-peer networks.",
        "status": "approved"
    }
]
