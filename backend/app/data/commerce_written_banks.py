"""
Commerce and Accounting Stream — Course-Specific Written Conceptual Assessment Banks

Contains 10 curated questions per course:
1. B.Com. Accounting and Finance (bcom-accfinance)
2. B.Com. Banking and Insurance (bcom-bankins)
3. B.Com. Taxation (bcom-tax)
4. B.Com. Corporate Secretaryship (bcom-corpsec)
5. BBA — Business Tycoon (bba-tycoon)

Balanced across easy, medium, and difficult conceptual reasoning tiers.
"""

# ==============================================================================
# 1. B.Com. Accounting and Finance Written Bank
# ==============================================================================
BCOM_ACCFINANCE_WRITTEN_QUESTIONS = [
    {
        "id": "af_w_1",
        "topic": "Accounting Concepts",
        "question": "Which accounting principle dictates that business affairs must be treated as separate and distinct from the personal affairs of its owners?",
        "options": ["Business Entity Concept", "Going Concern Concept", "Money Measurement Concept", "Dual Aspect Principle"],
        "correctAnswer": "Business Entity Concept",
        "difficulty": "easy",
        "conceptTested": "Distinction between enterprise and owner personal assets."
    },
    {
        "id": "af_w_2",
        "topic": "Golden Rules of Accounting",
        "question": "Under double-entry bookkeeping, what is the golden rule for Nominal Accounts?",
        "options": [
            "Debit all expenses and losses, Credit all incomes and gains",
            "Debit what comes in, Credit what goes out",
            "Debit the receiver, Credit the giver",
            "Debit all liabilities, Credit all assets"
        ],
        "correctAnswer": "Debit all expenses and losses, Credit all incomes and gains",
        "difficulty": "easy",
        "conceptTested": "Dual-entry rules for nominal income/expense accounts."
    },
    {
        "id": "af_w_3",
        "topic": "Depreciation Methods",
        "question": "Under the Written Down Value (WDV) method of depreciation, how does the annual depreciation charge change over time?",
        "options": [
            "It decreases every year as the asset's book value reduces",
            "It remains identical and fixed throughout the asset's life",
            "It increases exponentially with asset obsolescence",
            "It fluctuates randomly based on current stock market indices"
        ],
        "correctAnswer": "It decreases every year as the asset's book value reduces",
        "difficulty": "easy",
        "conceptTested": "Diminishing balance depreciation behavior."
    },
    {
        "id": "af_w_4",
        "topic": "Trial Balance Errors",
        "question": "Which of the following errors will NOT be detected by a trial balance (i.e., trial balance will still balance)?",
        "options": [
            "Complete omission of an entire transaction from journal and ledger",
            "Posting a debit entry to the credit side of an account",
            "Arithmetic error in calculating the total debit balance of the cash book",
            "Listing a debtor balance on the credit column of the trial balance"
        ],
        "correctAnswer": "Complete omission of an entire transaction from journal and ledger",
        "difficulty": "medium",
        "conceptTested": "Compensating and complete omission errors in trial balance verification."
    },
    {
        "id": "af_w_5",
        "topic": "Financial Statements & Working Capital",
        "question": "If a firm has Current Assets of ₹5,00,000 and Current Liabilities of ₹2,50,000, what is its Net Working Capital?",
        "options": ["₹2,50,000", "₹7,50,000", "₹12,50,000", "₹2.00"],
        "correctAnswer": "₹2,50,000",
        "difficulty": "medium",
        "conceptTested": "Working capital formula: Current Assets minus Current Liabilities."
    },
    {
        "id": "af_w_6",
        "topic": "Revenue Recognition (Matching Principle)",
        "question": "According to the Accrual / Matching concept, when must an expense be recognized in the Profit and Loss statement?",
        "options": [
            "In the financial period in which the associated revenue is earned, regardless of when cash is paid",
            "Exclusively when physical cash is disbursed from the bank vault",
            "Only when approved by tax auditors at the end of three fiscal years",
            "Immediately upon signing a preliminary verbal quotation"
        ],
        "correctAnswer": "In the financial period in which the associated revenue is earned, regardless of when cash is paid",
        "difficulty": "medium",
        "conceptTested": "Accrual basis of revenue and cost matching."
    },
    {
        "id": "af_w_7",
        "topic": "Ratio Analysis (Solvency)",
        "question": "A Quick Ratio (Acid-Test Ratio) excludes which current asset from the numerator because it is least liquid?",
        "options": ["Closing Inventory / Stock", "Cash and Cash Equivalents", "Trade Receivables / Debtors", "Short-term Marketable Securities"],
        "correctAnswer": "Closing Inventory / Stock",
        "difficulty": "medium",
        "conceptTested": "Quick asset composition and inventory liquidity latency."
    },
    {
        "id": "af_w_8",
        "topic": "Capital Structure & Leverage",
        "question": "What is the primary risk of an excessively high Debt-to-Equity ratio during economic downturns?",
        "options": [
            "High mandatory fixed interest commitments can trigger corporate insolvency if operating earnings decline",
            "Shareholders are forced to sell their personal vehicles to bank creditors",
            "Gross profit margin automatically turns into negative numbers",
            "The company is disqualified from issuing GST invoices to customers"
        ],
        "correctAnswer": "High mandatory fixed interest commitments can trigger corporate insolvency if operating earnings decline",
        "difficulty": "difficult",
        "conceptTested": "Financial leverage risk and interest coverage sensitivity."
    },
    {
        "id": "af_w_9",
        "topic": "Cash Flow Statement (AS-3 / Ind AS 7)",
        "question": "Under cash flow statement classification, proceeds from issuing equity shares and repayment of bank borrowings belong to which section?",
        "options": ["Financing Activities", "Operating Activities", "Investing Activities", "Extraordinary Reserves"],
        "correctAnswer": "Financing Activities",
        "difficulty": "difficult",
        "conceptTested": "Classification of cash flows into Operating, Investing, and Financing."
    },
    {
        "id": "af_w_10",
        "topic": "Auditing & Forensic Accounting",
        "question": "What is the primary distinction between an 'Error' and 'Fraud' in accounting records?",
        "options": [
            "Error is unintentional arithmetic or procedural oversight, whereas Fraud involves intentional deception and concealment",
            "Error involves amounts over ₹1 Crore while Fraud involves amounts under ₹10,000",
            "Errors can only be committed by interns whereas Fraud is strictly committed by banks",
            "Errors are governed by criminal penal law whereas Fraud is resolved without penalties"
        ],
        "correctAnswer": "Error is unintentional arithmetic or procedural oversight, whereas Fraud involves intentional deception and concealment",
        "difficulty": "difficult",
        "conceptTested": "Intentionality and forensic distinction between errors and fraudulent misstatements."
    }
]

# ==============================================================================
# 2. B.Com. Banking and Insurance Written Bank
# ==============================================================================
BCOM_BANKINS_WRITTEN_QUESTIONS = [
    {
        "id": "bi_w_1",
        "topic": "Central Banking Fundamentals",
        "question": "Which institution acts as the 'Lender of Last Resort' and regulates monetary policy in India?",
        "options": ["Reserve Bank of India (RBI)", "State Bank of India (SBI)", "Securities and Exchange Board of India (SEBI)", "Ministry of Corporate Affairs"],
        "correctAnswer": "Reserve Bank of India (RBI)",
        "difficulty": "easy",
        "conceptTested": "Central banking role and monetary authority."
    },
    {
        "id": "bi_w_2",
        "topic": "Insurance Principles",
        "question": "The principle of 'Utmost Good Faith' (Uberrimae Fidei) requires that:",
        "options": [
            "Both the insurer and insured must disclose all material facts fully and honestly without concealment",
            "The insurance company must guarantee 100% investment profit every quarter",
            "The policyholder can insure their neighbor's car without permission",
            "Claims must be settled within 2 hours without submitting damage documentation"
        ],
        "correctAnswer": "Both the insurer and insured must disclose all material facts fully and honestly without concealment",
        "difficulty": "easy",
        "conceptTested": "Core doctrine of Uberrimae Fidei in insurance contracts."
    },
    {
        "id": "bi_w_3",
        "topic": "Banking Instruments",
        "question": "What is the primary advantage of a crossed cheque over an open bearer cheque?",
        "options": [
            "It cannot be encashed across the bank counter; it must be credited to a verified bank account, ensuring a traceable audit trail",
            "It yields 10% monthly interest until encashed",
            "It can be used as legal currency in foreign retail supermarkets",
            "It allows the payer to withdraw double the account balance"
        ],
        "correctAnswer": "It cannot be encashed across the bank counter; it must be credited to a verified bank account, ensuring a traceable audit trail",
        "difficulty": "easy",
        "conceptTested": "Crossed cheque security and account-payee settlement."
    },
    {
        "id": "bi_w_4",
        "topic": "Credit & Non-Performing Assets",
        "question": "In standard commercial banking, when is a loan asset classified as a Non-Performing Asset (NPA)?",
        "options": [
            "When interest or principal installment remains overdue for a period exceeding 90 days",
            "When the borrower switches their residential address without written notice",
            "When the borrower takes leave from their employer for 2 weeks",
            "When the bank interest rate falls below 4%"
        ],
        "correctAnswer": "When interest or principal installment remains overdue for a period exceeding 90 days",
        "difficulty": "medium",
        "conceptTested": "NPA recognition norms (90-day overdue threshold)."
    },
    {
        "id": "bi_w_5",
        "topic": "Insurance Indemnity",
        "question": "The Principle of Indemnity ensures that in the event of an insured loss:",
        "options": [
            "The insured is restored to the same financial position they enjoyed immediately before the loss, without making a profit",
            "The insured is awarded double the commercial value of the destroyed asset as a bonus",
            "The insurance agent pays the claim from their personal wallet",
            "The damaged property remains the exclusive possession of the policyholder while receiving full claim compensation"
        ],
        "correctAnswer": "The insured is restored to the same financial position they enjoyed immediately before the loss, without making a profit",
        "difficulty": "medium",
        "conceptTested": "Doctrine of indemnity preventing moral hazard and unjust enrichment."
    },
    {
        "id": "bi_w_6",
        "topic": "Monetary Policy Instruments",
        "question": "What happens when the central bank increases the Cash Reserve Ratio (CRR)?",
        "options": [
            "Commercial banks must hold more cash with the central bank, reducing liquidity and loanable funds in the economy",
            "Commercial banks can lend unlimited funds at zero interest rates",
            "Stock exchanges are forced to shut down trading operations",
            "All residential home loans are converted into non-repayable grants"
        ],
        "correctAnswer": "Commercial banks must hold more cash with the central bank, reducing liquidity and loanable funds in the economy",
        "difficulty": "medium",
        "conceptTested": "CRR impact on systemic liquidity and credit creation."
    },
    {
        "id": "bi_w_7",
        "topic": "Insurable Interest",
        "question": "At what point in time must 'Insurable Interest' exist in a contract of Marine Cargo Insurance?",
        "options": [
            "At the time of loss, even if not present when the policy was originally taken",
            "Strictly at the time the policy is purchased, regardless of who owns it during loss",
            "Exclusively when the cargo ship docks at the final destination port",
            "Only if approved by the International Maritime Organization annually"
        ],
        "correctAnswer": "At the time of loss, even if not present when the policy was originally taken",
        "difficulty": "medium",
        "conceptTested": "Timing of insurable interest across life, fire, and marine insurance contracts."
    },
    {
        "id": "bi_w_8",
        "topic": "Credit Scoring & Underwriting",
        "question": "Which factor has the highest weight in determining an individual's CIBIL / Credit Bureau score?",
        "options": [
            "On-time loan and credit card repayment history",
            "The applicant's religious or demographic background",
            "The total number of debit cards held across public sector banks",
            "The brand of smartphone used to access mobile banking"
        ],
        "correctAnswer": "On-time loan and credit card repayment history",
        "difficulty": "difficult",
        "conceptTested": "Credit bureau score composition (payment history weighting)."
    },
    {
        "id": "bi_w_9",
        "topic": "Bank Capital Adequacy (Basel Accords)",
        "question": "What is the primary objective of Capital Adequacy Ratio (CAR / CRAR) under Basel III norms?",
        "options": [
            "To ensure banks maintain sufficient capital buffer to absorb unexpected operational and credit losses and prevent bank failure",
            "To maximize dividend payouts to private executive shareholders every month",
            "To ensure ATMs never run out of currency paper notes on holidays",
            "To fix a uniform interest rate across all global currencies"
        ],
        "correctAnswer": "To ensure banks maintain sufficient capital buffer to absorb unexpected operational and credit losses and prevent bank failure",
        "difficulty": "difficult",
        "conceptTested": "Basel capital adequacy ratio purpose and solvency resilience."
    },
    {
        "id": "bi_w_10",
        "topic": "Insurance Subrogation & Contribution",
        "question": "If an asset insured for ₹10,00,000 with Insurer A and ₹10,00,000 with Insurer B suffers a ₹6,00,000 loss, how is the claim settled under the Principle of Contribution?",
        "options": [
            "Each insurer contributes proportionally (₹3,00,000 each) so the insured recovers exactly the loss of ₹6,00,000",
            "The insured collects ₹6,00,000 from Insurer A and another ₹6,00,000 from Insurer B, totaling ₹12,00,000",
            "Neither insurer pays because double insurance cancels both policies",
            "The insured must sue both insurers in consumer court for punitive damages"
        ],
        "correctAnswer": "Each insurer contributes proportionally (₹3,00,000 each) so the insured recovers exactly the loss of ₹6,00,000",
        "difficulty": "difficult",
        "conceptTested": "Principle of contribution and prohibition of double recovery."
    }
]

# ==============================================================================
# 3. B.Com. Taxation Written Bank
# ==============================================================================
BCOM_TAX_WRITTEN_QUESTIONS = [
    {
        "id": "tax_w_1",
        "topic": "Tax Structure & Classification",
        "question": "Which of the following is categorized as a Direct Tax?",
        "options": ["Income Tax", "Goods and Services Tax (GST)", "Customs Duty", "Central Excise Duty"],
        "correctAnswer": "Income Tax",
        "difficulty": "easy",
        "conceptTested": "Direct vs indirect tax distinction."
    },
    {
        "id": "tax_w_2",
        "topic": "GST Architecture",
        "question": "Which tax is levied on an inter-state supply of goods or services under the Indian GST system?",
        "options": [
            "Integrated Goods and Services Tax (IGST)",
            "Central GST (CGST) only",
            "State GST (SGST) only",
            "Municipal Corporate Octroi"
        ],
        "correctAnswer": "Integrated Goods and Services Tax (IGST)",
        "difficulty": "easy",
        "conceptTested": "Inter-state supply tax levy (IGST)."
    },
    {
        "id": "tax_w_3",
        "topic": "Income Tax Heads of Income",
        "question": "Under the Income Tax Act, how many statutory heads of income are there for computing total income?",
        "options": ["5 Heads", "3 Heads", "7 Heads", "10 Heads"],
        "correctAnswer": "5 Heads",
        "difficulty": "easy",
        "conceptTested": "Five heads of income (Salary, House Property, PGBP, Capital Gains, Other Sources)."
    },
    {
        "id": "tax_w_4",
        "topic": "Input Tax Credit (ITC) Mechanism",
        "question": "What is the primary purpose of Input Tax Credit (ITC) under the GST regime?",
        "options": [
            "To eliminate the cascading effect of tax (tax-on-tax) across the supply chain",
            "To allow registered businesses to claim cash subsidies from the Ministry of Finance",
            "To reduce income tax liability of salaried government employees",
            "To fix retail product prices at uniform government rates"
        ],
        "correctAnswer": "To eliminate the cascading effect of tax (tax-on-tax) across the supply chain",
        "difficulty": "medium",
        "conceptTested": "Mitigation of cascading effect via seamless input tax credits."
    },
    {
        "id": "tax_w_5",
        "topic": "Residential Status & Scope of Income",
        "question": "An individual who is a Resident and Ordinarily Resident (ROR) in India is taxable on:",
        "options": [
            "Global income earned or accrued both in India and outside India",
            "Exclusively income earned within their home city",
            "Income received in cash only",
            "Income from agricultural land situated abroad only"
        ],
        "correctAnswer": "Global income earned or accrued both in India and outside India",
        "difficulty": "medium",
        "conceptTested": "Scope of total income based on residential status (ROR global taxation)."
    },
    {
        "id": "tax_w_6",
        "topic": "GST Invoice Statutory Requirements",
        "question": "What does 'HSN Code' stand for on a compliant tax invoice?",
        "options": [
            "Harmonized System of Nomenclature",
            "High-Speed Network Code",
            "Humanitarian Standard Number",
            "Hardware Serial Nomenclature"
        ],
        "correctAnswer": "Harmonized System of Nomenclature",
        "difficulty": "medium",
        "conceptTested": "HSN classification for standardized commodity taxation."
    },
    {
        "id": "tax_w_7",
        "topic": "Tax Deducted at Source (TDS)",
        "question": "Why is Tax Deducted at Source (TDS) introduced by tax authorities?",
        "options": [
            "To collect revenue continuously at the point of income generation and create a transparent audit trail",
            "To penalize employees for changing employers within a single fiscal year",
            "To replace annual corporate audited balance sheets entirely",
            "To fund international export bonuses"
        ],
        "correctAnswer": "To collect revenue continuously at the point of income generation and create a transparent audit trail",
        "difficulty": "medium",
        "conceptTested": "Pay-as-you-earn concept and tracking of taxable transactions."
    },
    {
        "id": "tax_w_8",
        "topic": "Tax Avoidance vs Tax Evasion",
        "question": "Which statement accurately describes the legal difference between Tax Avoidance and Tax Evasion?",
        "options": [
            "Tax Avoidance uses legal loopholes to minimize tax within the letter of law, while Tax Evasion involves illegal concealment or falsification",
            "Tax Evasion is legal whereas Tax Avoidance leads to immediate criminal arrest",
            "Both terms mean exactly the same under the Indian Penal Code",
            "Tax Avoidance applies only to agriculture while Evasion applies only to cryptocurrencies"
        ],
        "correctAnswer": "Tax Avoidance uses legal loopholes to minimize tax within the letter of law, while Tax Evasion involves illegal concealment or falsification",
        "difficulty": "difficult",
        "conceptTested": "Legal boundaries between tax planning, avoidance, and fraudulent evasion."
    },
    {
        "id": "tax_w_9",
        "topic": "Capital Gains (Indexation)",
        "question": "What is the purpose of applying the Cost Inflation Index (CII) when computing Long-Term Capital Gains (LTCG)?",
        "options": [
            "To adjust the purchase cost for inflation and ensure the taxpayer is taxed only on real economic gains",
            "To automatically double the selling price for tax calculation",
            "To eliminate stamp duty charged by state land registration offices",
            "To convert capital assets into current assets"
        ],
        "correctAnswer": "To adjust the purchase cost for inflation and ensure the taxpayer is taxed only on real economic gains",
        "difficulty": "difficult",
        "conceptTested": "Indexed cost of acquisition in long-term capital assets."
    },
    {
        "id": "tax_w_10",
        "topic": "GST Reconciliation (GSTR-2B vs Books)",
        "question": "Under modern GST compliance rules, why must a buyer's purchase register be reconciled with GSTR-2B before claiming ITC?",
        "options": [
            "ITC is restricted only to invoices that have been uploaded and declared by corresponding suppliers in their GSTR-1 returns",
            "To allow buyers to change supplier bank accounts without approval",
            "To calculate annual corporate depreciation on brand patents",
            "GSTR-2B reconciliation is optional and only recommended for state-run utilities"
        ],
        "correctAnswer": "ITC is restricted only to invoices that have been uploaded and declared by corresponding suppliers in their GSTR-1 returns",
        "difficulty": "difficult",
        "conceptTested": "Statutory matching of invoice credits against supplier GSTR-1 filing via GSTR-2B."
    }
]

# ==============================================================================
# 4. B.Com. Corporate Secretaryship Written Bank
# ==============================================================================
BCOM_CORPSEC_WRITTEN_QUESTIONS = [
    {
        "id": "cs_w_1",
        "topic": "Company Formation Documents",
        "question": "Which document is known as the charter of a company, defining its constitution, objectives, and scope of operations?",
        "options": [
            "Memorandum of Association (MoA)",
            "Articles of Association (AoA)",
            "Prospectus",
            "Statutory Audit Report"
        ],
        "correctAnswer": "Memorandum of Association (MoA)",
        "difficulty": "easy",
        "conceptTested": "MoA as fundamental constitution defining corporate boundaries."
    },
    {
        "id": "cs_w_2",
        "topic": "Role of Company Secretary",
        "question": "In corporate governance, the Company Secretary (CS) is designated under company law as a:",
        "options": [
            "Key Managerial Personnel (KMP)",
            "External Forensic Liquidator",
            "Independent Trade Union Representative",
            "Junior Administrative Clerk"
        ],
        "correctAnswer": "Key Managerial Personnel (KMP)",
        "difficulty": "easy",
        "conceptTested": "Statutory status of CS as Key Managerial Personnel."
    },
    {
        "id": "cs_w_3",
        "topic": "Meeting Quorum",
        "question": "What does the term 'Quorum' mean in the context of company board or shareholder meetings?",
        "options": [
            "The minimum number of eligible members who must be present to legally transact business",
            "The maximum duration a director is allowed to speak at a podium",
            "The total monetary value of dividend cheques disbursed to attendees",
            "The number of security guards stationed outside the boardroom"
        ],
        "correctAnswer": "The minimum number of eligible members who must be present to legally transact business",
        "difficulty": "easy",
        "conceptTested": "Definition and necessity of meeting quorum."
    },
    {
        "id": "cs_w_4",
        "topic": "Board Resolutions",
        "question": "What is the difference between an Ordinary Resolution and a Special Resolution at a General Meeting?",
        "options": [
            "Ordinary Resolution requires a simple majority (>50%), while Special Resolution requires at least a 75% majority of votes cast",
            "Ordinary Resolution requires 100% unanimous consent, while Special requires 10%",
            "Ordinary Resolutions are oral whereas Special Resolutions must be written in Latin",
            "Ordinary Resolutions apply only to listed companies whereas Special apply only to trusts"
        ],
        "correctAnswer": "Ordinary Resolution requires a simple majority (>50%), while Special Resolution requires at least a 75% majority of votes cast",
        "difficulty": "medium",
        "conceptTested": "Voting threshold difference between ordinary and special resolutions."
    },
    {
        "id": "cs_w_5",
        "topic": "Secretarial Standards & Minutes",
        "question": "Within how many days from the conclusion of a board or general meeting must the official minutes be entered in the Minutes Book?",
        "options": ["Within 30 days", "Within 365 days", "Within 24 hours", "Minutes are completely optional under law"],
        "correctAnswer": "Within 30 days",
        "difficulty": "medium",
        "conceptTested": "Statutory deadline for signing and recording minutes of meetings."
    },
    {
        "id": "cs_w_6",
        "topic": "Independent Directors & Board Composition",
        "question": "What is the primary role of an 'Independent Director' on a corporate board?",
        "options": [
            "To safeguard minority shareholder interests and provide unbiased oversight free from management conflict of interest",
            "To manage the daily sales of regional factory branches",
            "To sign all bank cheques on behalf of the company founder",
            "To represent the political party of the local state municipal ward"
        ],
        "correctAnswer": "To safeguard minority shareholder interests and provide unbiased oversight free from management conflict of interest",
        "difficulty": "medium",
        "conceptTested": "Fiduciary oversight and independence in corporate boards."
    },
    {
        "id": "cs_w_7",
        "topic": "Corporate Social Responsibility (CSR)",
        "question": "Under statutory CSR mandates in India, qualifying companies are required to spend at least what percentage of their average net profits on approved CSR activities?",
        "options": [
            "At least 2% of average net profits of preceding three financial years",
            "At least 25% of gross annual turnover",
            "At least 50% of total export receipts",
            "Zero; CSR is purely voluntary for all entities"
        ],
        "correctAnswer": "At least 2% of average net profits of preceding three financial years",
        "difficulty": "medium",
        "conceptTested": "Statutory CSR expenditure thresholds under Companies Act Section 135."
    },
    {
        "id": "cs_w_8",
        "topic": "Doctrine of Ultra Vires",
        "question": "If a company executes a contract that goes beyond the powers stated in its Memorandum of Association, the contract is considered:",
        "options": [
            "Ultra Vires (void ab initio and legally unenforceable against the company)",
            "Valid if ratified by a subsequent verbal board conversation",
            "A standard convertible debt instrument",
            "Enforceable only if approved by the local police commissioner"
        ],
        "correctAnswer": "Ultra Vires (void ab initio and legally unenforceable against the company)",
        "difficulty": "difficult",
        "conceptTested": "Doctrine of Ultra Vires and capacity of corporation."
    },
    {
        "id": "cs_w_9",
        "topic": "Insider Trading & Code of Conduct",
        "question": "Under securities law, what constitutes 'Unpublished Price Sensitive Information' (UPSI)?",
        "options": [
            "Non-public financial results, dividend proposals, or M&A plans that would materially affect share price upon disclosure",
            "The lunch menu scheduled in the executive cafeteria next Monday",
            "Publicly broadcast newspaper reports regarding national interest rate trends",
            "Routine quarterly office stationery purchase receipts"
        ],
        "correctAnswer": "Non-public financial results, dividend proposals, or M&A plans that would materially affect share price upon disclosure",
        "difficulty": "difficult",
        "conceptTested": "Legal definition and scope of Unpublished Price Sensitive Information."
    },
    {
        "id": "cs_w_10",
        "topic": "Related Party Transactions & Section 188",
        "question": "When a proposed contract involves a transaction with an entity where a director is interested, what is the director's statutory obligation?",
        "options": [
            "Disclose their interest at the board meeting, recuse from discussions, and abstain from voting on the resolution",
            "Insist on chairing the meeting and cast the deciding vote",
            "Keep the transaction secret from shareholders to prevent media gossip",
            "Transfer all company bank accounts into their personal name"
        ],
        "correctAnswer": "Disclose their interest at the board meeting, recuse from discussions, and abstain from voting on the resolution",
        "difficulty": "difficult",
        "conceptTested": "Conflict of interest disclosure and voting disqualification under Section 184/188."
    }
]

# ==============================================================================
# 5. BBA (Business Tycoon) Written Bank
# ==============================================================================
BBA_TYCOON_WRITTEN_QUESTIONS = [
    {
        "id": "bba_w_1",
        "topic": "Business Strategy & SWOT",
        "question": "In a SWOT strategic analysis, which two components evaluate internal company capabilities rather than external environmental factors?",
        "options": [
            "Strengths and Weaknesses",
            "Opportunities and Threats",
            "Strengths and Threats",
            "Weaknesses and Opportunities"
        ],
        "correctAnswer": "Strengths and Weaknesses",
        "difficulty": "easy",
        "conceptTested": "Internal vs external environmental scanning."
    },
    {
        "id": "bba_w_2",
        "topic": "Marketing Mix (4 Ps)",
        "question": "What are the traditional '4 Ps' of the marketing mix framework?",
        "options": [
            "Product, Price, Place, Promotion",
            "People, Process, Profit, Performance",
            "Planning, Policy, Packaging, Patience",
            "Production, Purchasing, Payroll, Publicity"
        ],
        "correctAnswer": "Product, Price, Place, Promotion",
        "difficulty": "easy",
        "conceptTested": "Core 4 Ps marketing framework."
    },
    {
        "id": "bba_w_3",
        "topic": "Startup Financing",
        "question": "What does 'Bootstrapping' mean in entrepreneurial venture management?",
        "options": [
            "Building and growing a business using existing personal savings and operating revenues without external venture funding",
            "Raising ₹100 Crore immediately from foreign venture capitalists",
            "Listing shares on the New York Stock Exchange in the first week",
            "Purchasing expensive footwear for all sales employees"
        ],
        "correctAnswer": "Building and growing a business using existing personal savings and operating revenues without external venture funding",
        "difficulty": "easy",
        "conceptTested": "Self-funded lean venture growth."
    },
    {
        "id": "bba_w_4",
        "topic": "Unit Economics (CAC & LTV)",
        "question": "If an e-commerce startup spends ₹2,00,000 on digital ads to acquire 1,000 new paying customers, what is the Customer Acquisition Cost (CAC)?",
        "options": ["₹200 per customer", "₹2,000 per customer", "₹20 per customer", "₹1,000 per customer"],
        "correctAnswer": "₹200 per customer",
        "difficulty": "medium",
        "conceptTested": "Calculation of Customer Acquisition Cost (Total Spend / Total Customers)."
    },
    {
        "id": "bba_w_5",
        "topic": "Operations & Inventory Management",
        "question": "What is the primary risk of carrying excessive inventory in retail or manufacturing operations?",
        "options": [
            "High holding costs, tied-up working capital, and risk of obsolescence or damage",
            "Customers refuse to enter the store because shelves are too full",
            "Suppliers automatically sue the business for placing large orders",
            "The corporate logo becomes invalid"
        ],
        "correctAnswer": "High holding costs, tied-up working capital, and risk of obsolescence or damage",
        "difficulty": "medium",
        "conceptTested": "Inventory holding cost vs stockout risk trade-off."
    },
    {
        "id": "bba_w_6",
        "topic": "Break-Even Analysis",
        "question": "At the Break-Even Point (BEP) in business volume:",
        "options": [
            "Total Revenue exactly equals Total Costs (Total Profit is Zero)",
            "Total Revenue is double Total Costs",
            "Fixed costs drop to zero",
            "Variable costs exceed total sales"
        ],
        "correctAnswer": "Total Revenue exactly equals Total Costs (Total Profit is Zero)",
        "difficulty": "medium",
        "conceptTested": "Break-even condition and margin of safety."
    },
    {
        "id": "bba_w_7",
        "topic": "Organizational Leadership",
        "question": "Which leadership style involves actively consulting team members and encouraging participatory decision-making before finalizing strategy?",
        "options": [
            "Democratic / Participative Leadership",
            "Autocratic Leadership",
            "Laissez-Faire (Hands-off) Leadership",
            "Transactional Leadership"
        ],
        "correctAnswer": "Democratic / Participative Leadership",
        "difficulty": "medium",
        "conceptTested": "Leadership models and collaborative governance."
    },
    {
        "id": "bba_w_8",
        "topic": "Porter's Five Forces",
        "question": "According to Michael Porter's Five Forces framework, an industry with low capital requirements and absent patent barriers faces high threat from:",
        "options": [
            "Threat of New Entrants",
            "Bargaining Power of Buyers only",
            "Threat of Government Nationalization",
            "Diminishing Supplier Inflation"
        ],
        "correctAnswer": "Threat of New Entrants",
        "difficulty": "difficult",
        "conceptTested": "Porter's barrier to entry analysis."
    },
    {
        "id": "bba_w_9",
        "topic": "Supply Chain & JIT (Just-in-Time)",
        "question": "What is the core principle of Just-In-Time (JIT) manufacturing pioneered by Toyota?",
        "options": [
            "Materials are ordered and received only as needed in the production process, minimizing waste and storage inventory",
            "Ordering 5 years of steel in advance to hedge against currency depreciation",
            "Halting production whenever workers arrive 5 minutes late",
            "Replacing all human assembly technicians with manual paper forms"
        ],
        "correctAnswer": "Materials are ordered and received only as needed in the production process, minimizing waste and storage inventory",
        "difficulty": "difficult",
        "conceptTested": "Lean supply chain and JIT inventory philosophy."
    },
    {
        "id": "bba_w_10",
        "topic": "Venture Capital & Valuation",
        "question": "What is the difference between Pre-Money Valuation and Post-Money Valuation during an equity funding round?",
        "options": [
            "Post-Money Valuation equals Pre-Money Valuation plus the new cash investment injected into the company",
            "Pre-Money Valuation is calculated after the company is liquidated in court",
            "Post-Money Valuation only includes the founder's personal residential house",
            "There is no difference; both numbers must be identical in investment term sheets"
        ],
        "correctAnswer": "Post-Money Valuation equals Pre-Money Valuation plus the new cash investment injected into the company",
        "difficulty": "difficult",
        "conceptTested": "Venture equity dilution and pre vs post-money arithmetic."
    }
]

# Combined lookup catalog for written assessment routes
COMMERCE_WRITTEN_BANKS = {
    "bcom-accfinance": {
        "courseName": "B.Com. Accounting and Finance",
        "collection": "commerce_finance_master_assessments",
        "questions": BCOM_ACCFINANCE_WRITTEN_QUESTIONS
    },
    "bcom-bankins": {
        "courseName": "B.Com. Banking and Insurance",
        "collection": "commerce_banking_quest_assessments",
        "questions": BCOM_BANKINS_WRITTEN_QUESTIONS
    },
    "bcom-tax": {
        "courseName": "B.Com. Taxation",
        "collection": "commerce_tax_detective_assessments",
        "questions": BCOM_TAX_WRITTEN_QUESTIONS
    },
    "bcom-corpsec": {
        "courseName": "B.Com. Corporate Secretaryship",
        "collection": "commerce_corporate_decision_assessments",
        "questions": BCOM_CORPSEC_WRITTEN_QUESTIONS
    },
    "bba-tycoon": {
        "courseName": "BBA",
        "collection": "commerce_business_tycoon_assessments",
        "questions": BBA_TYCOON_WRITTEN_QUESTIONS
    }
}
