"""
Commerce and Accounting Stream - Interactive Simulation Game Scenarios & Evaluation Engines

1. B.Com. Accounting and Finance — Finance Master (5 Levels)
2. B.Com. Banking and Insurance — Banking Quest (5 Levels)
3. B.Com. Taxation — Tax Detective (5 Levels)
4. B.Com. Corporate Secretaryship — Corporate Decision Challenge (5 Levels)
5. BBA — Business Tycoon (5 Levels)
"""

from typing import Dict, List, Any

# ==============================================================================
# GAME 1: FINANCE MASTER (B.Com. Accounting and Finance)
# ==============================================================================
FINANCE_MASTER_LEVELS = [
    {
        "level": 1,
        "title": "Level 1: Transaction Classification",
        "description": "Categorize corporate transactions into Assets, Liabilities, Income, Expenses, or Capital under standard double-entry accounting.",
        "scenario": "Apex Retail Pvt Ltd purchased 50 delivery vans for ₹35,00,000 on 3-year bank credit, paid ₹80,000 for driver fuel, and received ₹2,50,000 cash from customers for services rendered.",
        "challenge": "Which of the following correctly classifies these three items in the company's books?",
        "options": [
            {
                "id": "opt-1",
                "text": "Delivery Vans: Non-Current Asset | Fuel Cost: Operating Expense | Customer Cash: Revenue (Income)",
                "isCorrect": True,
                "explanation": "Delivery vans provide multi-year economic benefit (Non-Current Asset), fuel is an operational consumption (Expense), and customer receipts represent Sales Revenue (Income)."
            },
            {
                "id": "opt-2",
                "text": "Delivery Vans: Expense | Fuel Cost: Current Asset | Customer Cash: Capital",
                "isCorrect": False,
                "explanation": "Incorrect. Delivery vans cannot be written off immediately as expense, fuel is consumed, and customer revenue is not capital."
            },
            {
                "id": "opt-3",
                "text": "Delivery Vans: Current Asset | Fuel Cost: Liability | Customer Cash: Revenue",
                "isCorrect": False,
                "explanation": "Incorrect. Delivery vans are long-term non-current assets, and paid fuel is an expense, not an outstanding liability."
            },
            {
                "id": "opt-4",
                "text": "Delivery Vans: Non-Current Asset | Fuel Cost: Non-Current Asset | Customer Cash: Liability",
                "isCorrect": False,
                "explanation": "Incorrect. Fuel does not create enduring asset value, and earned revenue is not a liability."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Accounting Knowledge", "Numerical Reasoning", "Attention to Detail"]
    },
    {
        "level": 2,
        "title": "Level 2: Journal Entry Challenge",
        "description": "Apply the Golden Rules of Accounting (Personal, Real, Nominal) to formulate the exact dual-entry debit and credit journal record.",
        "scenario": "Nova Logistics paid ₹1,20,000 rent to landlord Mr. Sharma by bank cheque, and purchased office stationery worth ₹15,000 in cash.",
        "challenge": "Identify the precise journal entry combination that must be posted:",
        "options": [
            {
                "id": "opt-1",
                "text": "Dr. Rent A/c ₹1,20,000 To Bank A/c ₹1,20,000 & Dr. Stationery A/c ₹15,000 To Cash A/c ₹15,000",
                "isCorrect": True,
                "explanation": "Nominal accounts (Rent, Stationery expenses) are debited. Real/Personal bank & cash accounts giving value are credited."
            },
            {
                "id": "opt-2",
                "text": "Dr. Bank A/c ₹1,20,000 To Rent A/c ₹1,20,000 & Dr. Cash A/c ₹15,000 To Stationery A/c ₹15,000",
                "isCorrect": False,
                "explanation": "Incorrect. This reverses the flow, falsely debiting cash/bank as if money was received."
            },
            {
                "id": "opt-3",
                "text": "Dr. Landlord A/c ₹1,20,000 To Rent A/c ₹1,20,000 & Dr. Stationery A/c ₹15,000 To Creditors ₹15,000",
                "isCorrect": False,
                "explanation": "Incorrect. When rent is paid, Rent A/c is debited directly, and cash purchases don't involve creditors."
            },
            {
                "id": "opt-4",
                "text": "Dr. Rent A/c ₹1,20,000 To Capital A/c ₹1,20,000 & Dr. Cash A/c ₹15,000 To Stationery A/c ₹15,000",
                "isCorrect": False,
                "explanation": "Incorrect. Operating rent is paid from bank funds, not owner equity."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Accounting Knowledge", "Accuracy", "Logical Reasoning"]
    },
    {
        "level": 3,
        "title": "Level 3: Ledger Management",
        "description": "Audit T-accounts, evaluate ledger posting, and spot posting errors across debtor and creditor balances.",
        "scenario": "A sales entry of ₹50,000 on credit to customer Alpha Corp was correctly credited to Sales A/c, but erroneously entered on the Credit side of Alpha Corp's personal ledger account.",
        "challenge": "What is the net accounting distortion created by this ledger posting mistake?",
        "options": [
            {
                "id": "opt-1",
                "text": "Both sides of the ledger will show credits, causing the Trial Balance to overstate credits by ₹1,00,000 or understate debits by ₹50,000",
                "isCorrect": True,
                "explanation": "Debtors must have debit balances. Crediting Alpha Corp creates a duplicate credit instead of a debit, causing a one-sided ledger error of ₹1,00,000 in trial balance reconciliation."
            },
            {
                "id": "opt-2",
                "text": "The error completely cancels out because credit equals credit, leaving the trial balance unaffected",
                "isCorrect": False,
                "explanation": "Incorrect. For every credit there must be a debit. Posting two credits causes an immediate trial balance mismatch."
            },
            {
                "id": "opt-3",
                "text": "Only cash accounts will be reduced by ₹50,000 while debtor ledger remains unaffected",
                "isCorrect": False,
                "explanation": "Incorrect. This was a credit transaction; cash account is not part of this posting."
            },
            {
                "id": "opt-4",
                "text": "Alpha Corp's ledger will erroneously reflect a ₹50,000 receivable balance",
                "isCorrect": False,
                "explanation": "Incorrect. Crediting their account indicates we owe them (a payable), not a receivable."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Attention to Detail", "Logical Reasoning", "Accuracy"]
    },
    {
        "level": 4,
        "title": "Level 4: Trial Balance Discrepancy",
        "description": "Prepare a balanced trial balance and detect compensating errors and one-sided omissions.",
        "scenario": "The accountant prepares a trial balance where Total Debits = ₹14,20,000 and Total Credits = ₹14,02,000. Suspense account difference is ₹18,000 on the credit side.",
        "challenge": "Which of the following errors is the most probable cause of this ₹18,000 imbalance?",
        "options": [
            {
                "id": "opt-1",
                "text": "A purchase return of ₹9,000 was posted to the debit side of the Returns Outward account instead of credit",
                "isCorrect": True,
                "explanation": "Posting a ₹9,000 credit item to the debit side inflates debits by ₹9,000 and deflates credits by ₹9,000, creating an exact difference of 2 × ₹9,000 = ₹18,000."
            },
            {
                "id": "opt-2",
                "text": "Complete omission of an ₹18,000 sales invoice from both journal and ledger",
                "isCorrect": False,
                "explanation": "Incorrect. Complete omission omits both debit and credit equally, leaving the trial balance tallying."
            },
            {
                "id": "opt-3",
                "text": "Machinery purchase of ₹18,000 was debited to Office Repairs account",
                "isCorrect": False,
                "explanation": "Incorrect. An error of principle (debiting Repairs instead of Machinery) has debit = debit and does not affect the trial balance sum."
            },
            {
                "id": "opt-4",
                "text": "Cash received ₹18,000 was entered on the debit of Cash book and credit of Debtor A/c",
                "isCorrect": False,
                "explanation": "Incorrect. That is the correct double entry and creates zero imbalance."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Numerical Reasoning", "Logical Reasoning", "Attention to Detail"]
    },
    {
        "level": 5,
        "title": "Level 5: Financial Report Analysis",
        "description": "Analyze corporate Balance Sheets and Profit & Loss accounts to evaluate solvency, liquidity, and operational margin.",
        "scenario": "Zenith Infotech reports: Revenue = ₹20,00,000, Cost of Goods Sold = ₹12,00,000, Operating Expenses = ₹4,00,000, Current Assets = ₹6,00,000, Current Liabilities = ₹3,00,000, Quick Inventory = ₹1,50,000.",
        "challenge": "What are the company's Gross Profit Margin and Current Ratio, and what does it reveal about solvency?",
        "options": [
            {
                "id": "opt-1",
                "text": "Gross Profit Margin = 40%, Current Ratio = 2.0:1; Indicates healthy liquidity and strong gross operational profitability",
                "isCorrect": True,
                "explanation": "Gross Profit = 20L - 12L = 8L. GP Margin = (8L / 20L) * 100 = 40%. Current Ratio = 6L / 3L = 2.0 (standard benchmark of 2:1 is met)."
            },
            {
                "id": "opt-2",
                "text": "Gross Profit Margin = 60%, Current Ratio = 0.5:1; Company is on the verge of bankruptcy",
                "isCorrect": False,
                "explanation": "Incorrect. GP is ₹8L (40%), not ₹12L (60%), and Current Ratio is 2.0:1."
            },
            {
                "id": "opt-3",
                "text": "Gross Profit Margin = 20%, Current Ratio = 1.5:1; Net profit margin is negative",
                "isCorrect": False,
                "explanation": "Incorrect calculations for both gross margin and current ratio."
            },
            {
                "id": "opt-4",
                "text": "Gross Profit Margin = 80%, Current Ratio = 3.0:1; Over-leveraged capital structure",
                "isCorrect": False,
                "explanation": "Incorrect. Numbers do not match the reported financial metrics."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Accounting Knowledge", "Numerical Reasoning", "Logical Reasoning"]
    }
]

# ==============================================================================
# GAME 2: BANKING QUEST (B.Com. Banking and Insurance)
# ==============================================================================
BANKING_QUEST_LEVELS = [
    {
        "level": 1,
        "title": "Level 1: Banking Basics & Account Matching",
        "description": "Evaluate retail banking instruments, deposit accounts, and liquidity trade-offs.",
        "scenario": "Customer A is a freelance programmer needing frequent daily inward remittances with zero withdrawal limits. Customer B is a retired teacher with ₹10,00,000 seeking guaranteed quarterly interest income.",
        "challenge": "Which banking products best match Customer A and Customer B respectively?",
        "options": [
            {
                "id": "opt-1",
                "text": "Customer A: Current Account with NetBanking | Customer B: Senior Citizen Fixed Deposit (Quarterly Payout)",
                "isCorrect": True,
                "explanation": "Current accounts allow unlimited daily commercial transactions with overdraft facility. Senior Citizen FD offers higher guaranteed yield with structured quarterly payouts."
            },
            {
                "id": "opt-2",
                "text": "Customer A: 5-Year Recurring Deposit | Customer B: Basic Savings Account with high withdrawal limits",
                "isCorrect": False,
                "explanation": "Incorrect. A 5-year RD locks funds and hinders daily freelance cash flows; savings accounts offer lower returns for retiree principal."
            },
            {
                "id": "opt-3",
                "text": "Customer A: Public Provident Fund (PPF) | Customer B: Demat & Speculative Trading Account",
                "isCorrect": False,
                "explanation": "Incorrect. PPF has a 15-year lock-in and annual deposit limits; high-risk speculative trading is inappropriate for capital-preservation retirees."
            },
            {
                "id": "opt-4",
                "text": "Customer A: Gold Loan | Customer B: Unsecured Personal Loan",
                "isCorrect": False,
                "explanation": "Incorrect. These are debt liability products, not deposit and liquidity facilities."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Financial Literacy", "Customer Problem-Solving", "Decision-Making"]
    },
    {
        "level": 2,
        "title": "Level 2: Customer Service & KYC Compliance",
        "description": "Handle complex customer banking inquiries while upholding Anti-Money Laundering (AML) and KYC statutory guidelines.",
        "scenario": "A high-net-worth client arrives asking to deposit ₹15,00,000 cash into a 3-day old savings account without providing their PAN card, claiming urgency for property purchase.",
        "challenge": "As the branch assistant manager, what is the mandatory regulatory compliance response?",
        "options": [
            {
                "id": "opt-1",
                "text": "Politely decline cash acceptance without valid PAN or Form 60, verify source of funds under AML/KYC mandates, and log a Cash Transaction Report (CTR)",
                "isCorrect": True,
                "explanation": "Banking regulations mandate PAN verification for cash deposits exceeding statutory limits (e.g. ₹50,000/day). High cash amounts without KYC trigger mandatory CTR/STR reporting."
            },
            {
                "id": "opt-2",
                "text": "Accept the entire cash amount immediately to retain the valuable customer and promise to collect PAN next month",
                "isCorrect": False,
                "explanation": "Incorrect. Violates core banking compliance, leading to severe regulatory penalties and license risks."
            },
            {
                "id": "opt-3",
                "text": "Instruct the customer to split the money into 30 deposits of ₹50,000 each to bypass the reporting system",
                "isCorrect": False,
                "explanation": "Incorrect. Structuring transactions to evade reporting is an illegal act of money laundering (smurfing)."
            },
            {
                "id": "opt-4",
                "text": "Freeze the client's account immediately and contact local media",
                "isCorrect": False,
                "explanation": "Incorrect. Banking confidentiality must be preserved; internal compliance channels must be followed."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Financial Literacy", "Decision-Making", "Risk Awareness"]
    },
    {
        "level": 3,
        "title": "Level 3: Loan Decision & Credit Appraisal",
        "description": "Analyze credit profiles, Debt-to-Income (DTI) ratios, and collateral coverage to approve or reject loan applications.",
        "scenario": "Applicant Rahul earns ₹60,000 net monthly salary. Existing EMIs = ₹18,000. He applies for a ₹25,00,000 home loan where proposed monthly EMI is ₹24,000. His Credit Score is 780. Bank policy caps total Fixed Obligation to Income Ratio (FOIR) at 55%.",
        "challenge": "Calculate his combined FOIR and determine whether the loan application meets the credit policy:",
        "options": [
            {
                "id": "opt-1",
                "text": "Total EMI = ₹42,000 (FOIR = 70%); Reject or require co-applicant/extended tenure, as 70% exceeds the 55% policy ceiling",
                "isCorrect": True,
                "explanation": "Total commitments = ₹18,000 + ₹24,000 = ₹42,000. FOIR = (42,000 / 60,000) * 100 = 70%. Even with a 780 credit score, repayment capacity fails policy limits."
            },
            {
                "id": "opt-2",
                "text": "FOIR = 40%; Approve immediately with a concessional interest rate",
                "isCorrect": False,
                "explanation": "Incorrect. His existing EMI is already 30% of income; adding ₹24,000 pushes total obligations to 70%."
            },
            {
                "id": "opt-3",
                "text": "Credit score 780 waives all salary and repayment ratio considerations; approve without review",
                "isCorrect": False,
                "explanation": "Incorrect. Credit score measures past discipline; cash flow FOIR measures ongoing capacity to pay."
            },
            {
                "id": "opt-4",
                "text": "Disburse loan as an unsecured personal loan with 18% interest rate",
                "isCorrect": False,
                "explanation": "Incorrect. Pushing an over-leveraged customer into higher interest unsecured debt worsens default risk."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Numerical Reasoning", "Risk Awareness", "Decision-Making"]
    },
    {
        "level": 4,
        "title": "Level 4: Insurance Explorer & Underwriting",
        "description": "Match life and general insurance mechanisms to financial risks and explain insurable interest.",
        "scenario": "A logistics enterprise ships high-value lithium-ion batteries across coastal maritime corridors and wants protection against accidental cargo damage, container ship capsizing, and transit theft.",
        "challenge": "Which insurance policy contract is statutory and commercially tailored for this specific exposure?",
        "options": [
            {
                "id": "opt-1",
                "text": "Marine Cargo Open Policy with All-Risk Institute Cargo Clauses (A)",
                "isCorrect": True,
                "explanation": "Marine cargo insurance specifically indemnifies transit losses due to collision, sinking, fire, jettison, and theft during multimodal freight transport."
            },
            {
                "id": "opt-2",
                "text": "Term Life Insurance with Accidental Death Benefit Rider",
                "isCorrect": False,
                "explanation": "Incorrect. Life insurance covers human mortality, not commercial cargo freight."
            },
            {
                "id": "opt-3",
                "text": "Standard Fire and Special Perils policy restricted to fixed land warehouses",
                "isCorrect": False,
                "explanation": "Incorrect. Standard SFSP covers stationary premises, not in-transit transit marine voyages."
            },
            {
                "id": "opt-4",
                "text": "Public Liability D&O (Directors and Officers) Indemnity",
                "isCorrect": False,
                "explanation": "Incorrect. D&O covers executive managerial liability, not physical cargo damage."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Financial Literacy", "Customer Problem-Solving", "Risk Awareness"]
    },
    {
        "level": 5,
        "title": "Level 5: Financial Risk & Fraud Detection",
        "description": "Identify cybersecurity red flags, phishing vulnerabilities, and liquidity run risks in bank operations.",
        "scenario": "The automated fraud monitoring system alerts that Customer Meera's debit card was used for three consecutive ₹49,999 POS swipes in Singapore at 3:15 AM, 15 minutes after she withdrew ₹2,000 from an ATM in Mumbai.",
        "challenge": "What is the immediate, textbook fraud prevention action the bank must execute?",
        "options": [
            {
                "id": "opt-1",
                "text": "Instantly freeze card authorization, place temporary hold on transactions, notify the customer via SMS/call for confirmation, and initiate chargeback investigation",
                "isCorrect": True,
                "explanation": "Physical impossibility (geo-velocity anomaly: Mumbai and Singapore within 15 minutes) indicates card cloning or credential compromise. Instant card block protects customer from total balance drain."
            },
            {
                "id": "opt-2",
                "text": "Allow all transactions and wait until the customer files a formal written complaint next week",
                "isCorrect": False,
                "explanation": "Incorrect. Delaying action causes total loss of funds and breaches banking duty of care."
            },
            {
                "id": "opt-3",
                "text": "Double the customer's daily withdrawal limit to ensure the traveler isn't inconvenienced",
                "isCorrect": False,
                "explanation": "Incorrect. Gross negligence; increases fraud exposure exponentially."
            },
            {
                "id": "opt-4",
                "text": "Permanently close all accounts of the customer without explanation",
                "isCorrect": False,
                "explanation": "Incorrect. The customer is the victim; the compromised card must be blocked, not their entire banking relationship."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Risk Awareness", "Decision-Making", "Customer Problem-Solving"]
    }
]

# ==============================================================================
# GAME 3: TAX DETECTIVE (B.Com. Taxation)
# ==============================================================================
TAX_DETECTIVE_LEVELS = [
    {
        "level": 1,
        "title": "Level 1: Tax Classification (Direct vs Indirect)",
        "description": "Distinguish between Direct Taxes (non-transferable incidence) and Indirect Taxes (borne by final consumer).",
        "scenario": "A business owner pays Corporate Income Tax on net yearly profits, deducts TDS on professional legal fees, charges GST on consumer goods sold, and pays Municipal Property Tax on office premises.",
        "challenge": "Which classification accurately segregates Direct Taxes from Indirect Taxes?",
        "options": [
            {
                "id": "opt-1",
                "text": "Direct Taxes: Corporate Income Tax, TDS, Municipal Property Tax | Indirect Tax: Goods & Services Tax (GST)",
                "isCorrect": True,
                "explanation": "Direct taxes are assessed directly upon income, profit, or ownership where tax liability cannot be shifted. GST is an indirect consumption tax whose economic burden is shifted to the customer."
            },
            {
                "id": "opt-2",
                "text": "Direct Taxes: GST | Indirect Taxes: Corporate Income Tax and TDS",
                "isCorrect": False,
                "explanation": "Incorrect. GST is a destination-based consumption tax (indirect), whereas Income Tax is direct."
            },
            {
                "id": "opt-3",
                "text": "All four taxes are indirect because payments are processed through commercial banks",
                "isCorrect": False,
                "explanation": "Incorrect. The payment channel does not determine tax incidence."
            },
            {
                "id": "opt-4",
                "text": "Direct Taxes: Municipal Tax only | Indirect Taxes: Corporate Tax, TDS, and GST",
                "isCorrect": False,
                "explanation": "Incorrect. Income tax and TDS are classical direct tax mechanisms."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Tax Concepts", "Rule-Based Reasoning", "Analytical Thinking"]
    },
    {
        "level": 2,
        "title": "Level 2: GST Calculator Challenge",
        "description": "Calculate intra-state (CGST + SGST) vs inter-state (IGST) liabilities and net tax payable with Input Tax Credit (ITC).",
        "scenario": "Supplier Orion sells industrial monitors within Maharashtra for taxable value ₹10,00,000 at 18% GST. Orion had previously purchased raw materials intra-state for ₹6,00,000 paying 18% GST (ITC available = ₹1,08,000: CGST ₹54,000 + SGST ₹54,000).",
        "challenge": "What is the Gross Output GST, and the Net Cash GST payable to the government after utilizing ITC?",
        "options": [
            {
                "id": "opt-1",
                "text": "Gross Output GST = ₹1,80,000 (CGST ₹90,000 + SGST ₹90,000); Net Cash Payable = ₹72,000 (CGST ₹36,000 + SGST ₹36,000)",
                "isCorrect": True,
                "explanation": "Gross GST = 18% of 10L = ₹1,80,000 (₹90,000 CGST + ₹90,000 SGST). Net CGST = 90,000 - 54,000 = ₹36,000; Net SGST = 90,000 - 54,000 = ₹36,000. Total cash = ₹72,000."
            },
            {
                "id": "opt-2",
                "text": "Gross Output GST = ₹1,80,000; Net Cash Payable = ₹1,80,000 (ITC cannot be used against intra-state sales)",
                "isCorrect": False,
                "explanation": "Incorrect. Input Tax Credit is fully eligible to offset output tax liability under GST law."
            },
            {
                "id": "opt-3",
                "text": "Gross Output GST = ₹90,000; Net Cash Payable = ₹0",
                "isCorrect": False,
                "explanation": "Incorrect calculations; ignores the 18% rate on total ₹10,00,000 supply."
            },
            {
                "id": "opt-4",
                "text": "Gross Output GST = ₹1,80,000 IGST; Net Cash Payable = ₹1,08,000",
                "isCorrect": False,
                "explanation": "Incorrect. Intra-state supply attracts CGST + SGST, not IGST."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Numerical Accuracy", "Rule-Based Reasoning", "Analytical Thinking"]
    },
    {
        "level": 3,
        "title": "Level 3: Invoice Detective & Forensic Audit",
        "description": "Inspect mock tax invoices to identify missing statutory fields, arithmetic errors, and ineligible ITC claims.",
        "scenario": "You inspect Invoice #INV-889. Billed Value = ₹2,00,000. GST charged = 12% (₹24,000). The invoice lacks the Buyer's GSTIN, contains an invalid 3-digit HSN code instead of 6 digits, and dates back 14 months.",
        "challenge": "Can the buyer claim Input Tax Credit (ITC) on this invoice? Why or why not?",
        "options": [
            {
                "id": "opt-1",
                "text": "Ineligible for ITC: Missing buyer GSTIN, non-compliant HSN, and time-barred beyond statutory limitation period for filing annual returns",
                "isCorrect": True,
                "explanation": "Section 16 of GST Act mandates valid recipient GSTIN, correct HSN classification, and claims must be made within prescribed statutory deadlines."
            },
            {
                "id": "opt-2",
                "text": "Fully eligible because the total invoice amount matches the bank statement transfer",
                "isCorrect": False,
                "explanation": "Incorrect. Bank payment alone does not validate statutory tax credit compliance without legal invoice requisites."
            },
            {
                "id": "opt-3",
                "text": "Eligible for 50% credit if the seller promises to rectify HSN code next year",
                "isCorrect": False,
                "explanation": "Incorrect. GST rules do not allow arbitrary 50% claims for defective invoices."
            },
            {
                "id": "opt-4",
                "text": "Eligible only if converted into an e-way bill retroactively",
                "isCorrect": False,
                "explanation": "Incorrect. E-way bill is for goods movement tracking, not a substitute for recipient GSTIN."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Attention to Detail", "Rule-Based Reasoning", "Tax Concepts"]
    },
    {
        "level": 4,
        "title": "Level 4: Tax Scenario & Deduction Challenge",
        "description": "Evaluate allowable business expenditure vs capital expenditure and disallowed personal expenses.",
        "scenario": "A proprietorship firm earned gross receipts of ₹45,00,000 and incurred expenses: ₹12,00,000 staff salaries, ₹3,00,000 office rent, ₹1,50,000 owner family holiday travel, and ₹50,000 cash donation to an unregistered local charity.",
        "challenge": "Which expenses can be legally claimed as business deductions against profits?",
        "options": [
            {
                "id": "opt-1",
                "text": "Only Staff Salaries (₹12,00,000) and Office Rent (₹3,00,000) are deductible; Personal vacation and unregistered cash donations are disallowed",
                "isCorrect": True,
                "explanation": "Only expenses wholly and exclusively incurred for business purposes are deductible. Personal expenses and cash donations to unregistered bodies are disallowed under income tax law."
            },
            {
                "id": "opt-2",
                "text": "All four expenses (Total ₹17,00,000) are 100% deductible as proprietor business expenses",
                "isCorrect": False,
                "explanation": "Incorrect. Personal vacations cannot be passed off as operational enterprise costs."
            },
            {
                "id": "opt-3",
                "text": "Only the ₹50,000 cash donation is deductible under corporate social responsibility",
                "isCorrect": False,
                "explanation": "Incorrect. Cash donations over statutory limits and donations to unregistered entities are disallowed."
            },
            {
                "id": "opt-4",
                "text": "None of the expenses are deductible because total receipts are below ₹1 Crore",
                "isCorrect": False,
                "explanation": "Incorrect. Legitimate business salaries and rents are always deductible regardless of turnover."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Rule-Based Reasoning", "Analytical Thinking", "Tax Concepts"]
    },
    {
        "level": 5,
        "title": "Level 5: Mock Tax Reconciliation Report",
        "description": "Reconcile differences between GSTR-1 (sales declared) and GSTR-3B (tax paid) to detect discrepancies.",
        "scenario": "During annual tax reconciliation: GSTR-1 outward taxable supplies = ₹80,00,000 (Tax ₹14,40,000), but GSTR-3B returns filed show taxable supplies = ₹70,00,000 (Tax paid ₹12,60,000). A shortfall of ₹1,80,000 tax exists.",
        "challenge": "What is the consequence of this tax disparity and the mandatory course of corrective action?",
        "options": [
            {
                "id": "opt-1",
                "text": "The business faces a short-payment discrepancy notice with applicable interest; must pay ₹1,80,000 differential tax plus statutory interest via DRC-03",
                "isCorrect": True,
                "explanation": "Under-reporting tax in GSTR-3B compared to GSTR-1 creates an automatic tax recovery liability. Voluntary payment with interest via DRC-03 avoids heavy penalties."
            },
            {
                "id": "opt-2",
                "text": "The tax department automatically forgives disparities under ₹5,00,000 without interest",
                "isCorrect": False,
                "explanation": "Incorrect. All tax shortfalls are subject to recovery with mandatory interest."
            },
            {
                "id": "opt-3",
                "text": "The company should edit last year's sales invoices to show ₹70,00,000 instead",
                "isCorrect": False,
                "explanation": "Incorrect. Falsifying already-issued sales records constitutes criminal fraud."
            },
            {
                "id": "opt-4",
                "text": "Reconciliation is unnecessary as long as income tax returns match bank records",
                "isCorrect": False,
                "explanation": "Incorrect. GST and Income Tax data are cross-linked; discrepancies trigger scrutiny."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Numerical Accuracy", "Attention to Detail", "Analytical Thinking"]
    }
]

# ==============================================================================
# GAME 4: CORPORATE DECISION CHALLENGE (B.Com. Corporate Secretaryship)
# ==============================================================================
CORPORATE_DECISION_LEVELS = [
    {
        "level": 1,
        "title": "Level 1: Corporate Basics & Governance Structure",
        "description": "Understand legal organizational forms (Pvt Ltd, Public Ltd, OPC) and statutory roles of the Board and Company Secretary.",
        "scenario": "A fast-growing robotics startup with 3 founders and ₹2 Crore angel investment wants to raise capital from the general public via an IPO while limiting founder liability.",
        "challenge": "Which company structure is legally required before an entity can list on a recognized stock exchange?",
        "options": [
            {
                "id": "opt-1",
                "text": "Public Limited Company with minimum 7 members, 3 directors, and appointment of a qualified Company Secretary",
                "isCorrect": True,
                "explanation": "Only Public Limited companies can issue shares to the public and list on stock exchanges, adhering to statutory governance and CS compliance."
            },
            {
                "id": "opt-2",
                "text": "One Person Company (OPC) with 1 member and no board oversight",
                "isCorrect": False,
                "explanation": "Incorrect. OPCs cannot issue shares to the public or list on stock exchanges."
            },
            {
                "id": "opt-3",
                "text": "Unregistered General Partnership firm with unlimited personal liability",
                "isCorrect": False,
                "explanation": "Incorrect. Partnerships have unlimited liability and cannot raise public equity."
            },
            {
                "id": "opt-4",
                "text": "Private Limited Company with restricted transferability of shares and max 200 members",
                "isCorrect": False,
                "explanation": "Incorrect. Pvt Ltd cannot invite public investment; it must first convert to a Public Limited entity."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Organizational Thinking", "Communication", "Decision-Making"]
    },
    {
        "level": 2,
        "title": "Level 2: Board Meeting Planner & Statutory Protocol",
        "description": "Organize a valid Board Meeting honoring statutory notice periods, quorum requirements, and agenda sequencing.",
        "scenario": "Apex Dynamics Ltd has 6 directors on its board. The management wishes to convene a board meeting to approve quarterly financial results and declare an interim dividend.",
        "challenge": "What are the legal notice period and minimum quorum required for this board meeting to be valid?",
        "options": [
            {
                "id": "opt-1",
                "text": "Minimum 7 days written notice to all directors; Quorum requires 1/3rd of total directors or 2 directors (whichever is higher) = 2 directors present",
                "isCorrect": True,
                "explanation": "Under standard company law, at least 7 days advance notice is mandatory. Quorum is 1/3rd of total strength (6/3 = 2) or 2 directors, whichever is higher."
            },
            {
                "id": "opt-2",
                "text": "Notice can be sent 1 hour before via WhatsApp; 1 director alone constitutes a quorum",
                "isCorrect": False,
                "explanation": "Incorrect. One director cannot hold a meeting, and urgent notice requires specific statutory reasons with independent director presence."
            },
            {
                "id": "opt-3",
                "text": "Notice must be published 90 days in advance in an international newspaper; all 6 directors must attend",
                "isCorrect": False,
                "explanation": "Incorrect. 90-day newspaper publication is not a board meeting requirement."
            },
            {
                "id": "opt-4",
                "text": "No notice is needed if the Chairman approves the agenda verbally",
                "isCorrect": False,
                "explanation": "Incorrect. Written notice with agenda is a strict statutory mandate."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Attention to Detail", "Organizational Thinking", "Communication"]
    },
    {
        "level": 3,
        "title": "Level 3: Document Detective (Notices, Agendas & Minutes)",
        "description": "Audit draft meeting minutes and resolutions to spot compliance defects, omissions, and ambiguities.",
        "scenario": "Reviewing draft Board Minutes: Resolution 12 approved a ₹5 Crore loan to Director Mr. Roy's private entity. The minutes fail to record Mr. Roy's disclosure of interest, do not record him abstaining from voting, and are unsigned by the Chairperson after 45 days.",
        "challenge": "What are the critical statutory defects in these board minutes?",
        "options": [
            {
                "id": "opt-1",
                "text": "Interested director failed to disclose interest & abstain; unrecorded vote invalidates resolution; minutes unsigned beyond mandatory 30-day window",
                "isCorrect": True,
                "explanation": "Interested directors are legally forbidden from voting on related-party contracts. Minutes must be signed by the Chairperson within 30 days of the meeting."
            },
            {
                "id": "opt-2",
                "text": "There are no defects; interested directors are encouraged to vote on their own loans",
                "isCorrect": False,
                "explanation": "Incorrect. This is a severe conflict of interest and violates statutory board governance."
            },
            {
                "id": "opt-3",
                "text": "The only defect is the font size used in the minutes draft",
                "isCorrect": False,
                "explanation": "Incorrect. Substantive legal violations of disclosure and signing deadlines exist."
            },
            {
                "id": "opt-4",
                "text": "Loans to directors do not need to be recorded in minutes at all",
                "isCorrect": False,
                "explanation": "Incorrect. Related-party loans require board approval and explicit entry into statutory registers."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Attention to Detail", "Ethical Reasoning", "Organizational Thinking"]
    },
    {
        "level": 4,
        "title": "Level 4: Corporate Governance & Ethics",
        "description": "Resolve corporate dilemmas involving insider trading, CSR commitments, and whistleblower protections.",
        "scenario": "Two weeks before quarterly earnings release, a senior VP informs the Assistant CS that company profits plunged 60%, and asks to sell his vested shares quietly before the announcement.",
        "challenge": "As the corporate secretarial officer, what is your statutory and ethical duty?",
        "options": [
            {
                "id": "opt-1",
                "text": "Deny trading clearance immediately; trading window is closed (blackout period); warn the VP against insider trading under SEBI/statutory regulations",
                "isCorrect": True,
                "explanation": "Trading while possessing Unpublished Price Sensitive Information (UPSI) during trading window closure constitutes illegal insider trading."
            },
            {
                "id": "opt-2",
                "text": "Facilitate the sale quietly in exchange for a 5% commission",
                "isCorrect": False,
                "explanation": "Incorrect. Criminal insider trading and breach of fiduciary trust."
            },
            {
                "id": "opt-3",
                "text": "Advise the VP to transfer the shares to his spouse and sell from her account",
                "isCorrect": False,
                "explanation": "Incorrect. Insider trading prohibitions explicitly encompass immediate relatives and connected persons."
            },
            {
                "id": "opt-4",
                "text": "Ignore the request because only the CEO is bound by insider trading regulations",
                "isCorrect": False,
                "explanation": "Incorrect. All employees, directors, and connected persons with access to UPSI are bound."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Ethical Reasoning", "Decision-Making", "Communication"]
    },
    {
        "level": 5,
        "title": "Level 5: Boardroom Challenge (M&A Resolution)",
        "description": "Simulate a critical boardroom resolution balancing shareholder rights, creditor approvals, and regulatory filings.",
        "scenario": "The board considers acquiring a rival green-energy enterprise for ₹50 Crore through issuance of preferential shares. Minority shareholders express concern about dilution.",
        "challenge": "Which governance mechanism safeguards minority shareholder interests while ensuring legal corporate validity?",
        "options": [
            {
                "id": "opt-1",
                "text": "Pass a Special Resolution at an Extraordinary General Meeting (EGM) with 75% shareholder approval, supported by an independent registered valuer report",
                "isCorrect": True,
                "explanation": "Preferential allotment requires a Special Resolution (75%+ majority) and an independent valuation report justifying fair share pricing, ensuring transparency for all shareholders."
            },
            {
                "id": "opt-2",
                "text": "Let the Chairman approve the merger single-handedly without holding a shareholder vote",
                "isCorrect": False,
                "explanation": "Incorrect. Major capital expansion and share allotment require statutory shareholder authorization."
            },
            {
                "id": "opt-3",
                "text": "Issue shares at ₹1 par value to friends without regulatory disclosure",
                "isCorrect": False,
                "explanation": "Incorrect. Violates securities laws and constitutes severe oppression of minority shareholders."
            },
            {
                "id": "opt-4",
                "text": "Cancel all minority shares without compensation to simplify the transaction",
                "isCorrect": False,
                "explanation": "Incorrect. Unlawful confiscation of shareholder property."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Decision-Making", "Ethical Reasoning", "Organizational Thinking"]
    }
]

# ==============================================================================
# GAME 5: BUSINESS TYCOON (BBA - Virtual Business Management)
# ==============================================================================
BUSINESS_TYCOON_LEVELS = [
    {
        "level": 1,
        "title": "Level 1: Startup Selection & Market Niche",
        "description": "Analyze market demand, customer persona, and competitive barriers to select a viable enterprise idea.",
        "scenario": "You have ₹10,00,000 seed savings. Option A: Gourmet cloud kitchen in a crowded college tech hub with ₹250 avg order value and high delivery demand. Option B: Luxury yacht leasing in a landlocked desert town.",
        "challenge": "Which venture exhibits product-market fit and capital feasibility for your startup seed budget?",
        "options": [
            {
                "id": "opt-1",
                "text": "Cloud Kitchen in Tech/College Hub: High order frequency, recurring target demographic, and lean asset footprint",
                "isCorrect": True,
                "explanation": "A cloud kitchen optimizes ₹10L seed capital by eliminating high dining real-estate capex while addressing concentrated everyday customer demand."
            },
            {
                "id": "opt-2",
                "text": "Luxury Yacht Leasing: Infinite margins because yachts are prestigious regardless of geography",
                "isCorrect": False,
                "explanation": "Incorrect. Landlocked geography has zero market demand, and ₹10L cannot fund luxury marine vessels."
            },
            {
                "id": "opt-3",
                "text": "Neither; hoard the cash in zero-interest physical vaults indefinitely",
                "isCorrect": False,
                "explanation": "Incorrect. Does not launch a business; cash value erodes under inflation."
            },
            {
                "id": "opt-4",
                "text": "Spend the entire ₹10,00,000 on a launch party with celebrity influencers on Day 1",
                "isCorrect": False,
                "explanation": "Incorrect. Depletes working capital before establishing operations or kitchen infrastructure."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Strategic Thinking", "Business Reasoning", "Creativity"]
    },
    {
        "level": 2,
        "title": "Level 2: Budget Manager & Runway Allocation",
        "description": "Allocate limited working capital across kitchen equipment, initial inventory, marketing, and cash buffer runway.",
        "scenario": "You have ₹8,00,000 remaining capital. Monthly fixed overhead (rent + core staff) = ₹60,000. You must ensure at least 6 months of operational runway in case of slow ramp-up.",
        "challenge": "What is the optimal capital allocation strategy?",
        "options": [
            {
                "id": "opt-1",
                "text": "Kitchen Capex: ₹3,00,000 | Initial Stock/Marketing: ₹1,40,000 | Emergency Cash Runway: ₹3,60,000 (covers 6 months overhead)",
                "isCorrect": True,
                "explanation": "6 months × ₹60,000 = ₹3,60,000 runway reserve. Allocating ₹3L capex and ₹1.4L stock ensures business launch without risking mid-quarter insolvency."
            },
            {
                "id": "opt-2",
                "text": "Kitchen Capex: ₹7,50,000 | Stock: ₹50,000 | Reserve: ₹0 (Runway: 0 days)",
                "isCorrect": False,
                "explanation": "Incorrect. High risk; a single week of slow sales leads to payroll default and business failure."
            },
            {
                "id": "opt-3",
                "text": "Marketing: ₹7,00,000 | Equipment: ₹50,000 | Reserve: ₹50,000",
                "isCorrect": False,
                "explanation": "Incorrect. Generating customer orders without kitchen capacity to prepare food destroys brand reputation."
            },
            {
                "id": "opt-4",
                "text": "Borrow ₹50,00,000 at 24% interest to build an Olympic-sized kitchen",
                "isCorrect": False,
                "explanation": "Incorrect. Excessive debt burden crushes early-stage unit economics."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Resource Management", "Strategic Thinking", "Decision-Making"]
    },
    {
        "level": 3,
        "title": "Level 3: Marketing & Customer Acquisition (CAC vs LTV)",
        "description": "Evaluate marketing channels, discount strategies, and Customer Acquisition Cost (CAC) against Customer Lifetime Value (LTV).",
        "scenario": "Channel A: Hyperlocal Instagram ads costs ₹150 CAC, bringing customers who order 4 times/month (LTV = ₹600). Channel B: Billboards on highway costing ₹1,200 CAC with customer LTV = ₹400.",
        "challenge": "Which marketing strategy creates positive unit economics and sustainable growth?",
        "options": [
            {
                "id": "opt-1",
                "text": "Scale Channel A: Healthy LTV:CAC ratio of 4:1 (LTV ₹600 / CAC ₹150) yields profitable, repeatable customer acquisition",
                "isCorrect": True,
                "explanation": "A benchmark LTV:CAC ratio of 3:1 or higher indicates a highly sustainable growth engine. Channel B loses ₹800 per acquired customer."
            },
            {
                "id": "opt-2",
                "text": "Invest 100% budget into Channel B because highway billboards look grander to friends",
                "isCorrect": False,
                "explanation": "Incorrect. Channel B has a negative unit margin (LTV ₹400 < CAC ₹1,200), burning cash on every conversion."
            },
            {
                "id": "opt-3",
                "text": "Stop all marketing and rely purely on customers stumbling across the alleyway cloud kitchen",
                "isCorrect": False,
                "explanation": "Incorrect. Cloud kitchens have no street footfall; digital discovery is essential for orders."
            },
            {
                "id": "opt-4",
                "text": "Offer 100% free food forever to maximize user count without ever monetizing",
                "isCorrect": False,
                "explanation": "Incorrect. Unsustainable vanity metrics without revenue."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Business Reasoning", "Strategic Thinking", "Decision-Making"]
    },
    {
        "level": 4,
        "title": "Level 4: Inventory & Operations Shock",
        "description": "Respond to supply chain disruptions, perishable stock management, and quality control under surge demand.",
        "scenario": "Friday evening dinner rush: Orders surge 200%, but your primary packaging supplier failed to deliver meal boxes due to rain, leaving you with only 40 boxes for 120 incoming orders.",
        "challenge": "How should the operations manager respond to preserve business integrity and customer goodwill?",
        "options": [
            {
                "id": "opt-1",
                "text": "Temporarily throttle order intake to 40, dispatch an emergency runner to local wholesale markets for food-grade eco-containers, and communicate delay transparently",
                "isCorrect": True,
                "explanation": "Managing capacity limits protects food safety and customer trust. Sourcing emergency packaging locally prevents total operational shutdown."
            },
            {
                "id": "opt-2",
                "text": "Accept all 120 orders and pack hot food in unhygienic discarded cardboard scraps",
                "isCorrect": False,
                "explanation": "Incorrect. Massive health hazard, food safety violation, and destroys business credibility."
            },
            {
                "id": "opt-3",
                "text": "Take customer money, turn off the phones, and flee the premises",
                "isCorrect": False,
                "explanation": "Incorrect. Unethical, fraudulent behavior."
            },
            {
                "id": "opt-4",
                "text": "Deliver empty boxes to buy time",
                "isCorrect": False,
                "explanation": "Incorrect. Guarantees chargebacks and permanent customer attrition."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Resource Management", "Decision-Making", "Creativity"]
    },
    {
        "level": 5,
        "title": "Level 5: Business Growth & Scaling Strategy",
        "description": "Make strategic expansion decisions balancing reinvestment, franchise licensing, and customer satisfaction.",
        "scenario": "Month 6: Your kitchen generated ₹4,00,000 net profit with a 4.6-star rating and 65% repeat order rate. Competitors are opening nearby.",
        "challenge": "What is the most sound strategic growth decision for Month 7?",
        "options": [
            {
                "id": "opt-1",
                "text": "Reinvest 70% of profits into a second delivery hub in the adjacent business district, launch a loyalty subscription, and lock in vendor volume discounts",
                "isCorrect": True,
                "explanation": "Proven unit economics (4.6 stars, 65% repeat rate) support geographical expansion. Subscription locks in recurring LTV against oncoming competitor entry."
            },
            {
                "id": "opt-2",
                "text": "Withdraw all ₹4,00,000 profit for personal luxury and cut food ingredient quality by 50% to save costs",
                "isCorrect": False,
                "explanation": "Incorrect. Degrading food quality will immediately destroy the 4.6-star rating and hand market share to competitors."
            },
            {
                "id": "opt-3",
                "text": "Triple prices overnight without improving portion sizes or service",
                "isCorrect": False,
                "explanation": "Incorrect. Price inelasticity in casual food delivery will push customers straight to rivals."
            },
            {
                "id": "opt-4",
                "text": "Close the business immediately because reaching profit means the game is over",
                "isCorrect": False,
                "explanation": "Incorrect. Entrepreneurship is about continuous sustainable compounding."
            }
        ],
        "correctOptionId": "opt-1",
        "skills": ["Strategic Thinking", "Business Reasoning", "Decision-Making"]
    }
]

# Map of all 5 game level catalogs
COMMERCE_GAMES_CATALOG = {
    "finance-master": {
        "courseId": "course-bcom-accfinance",
        "courseKey": "bcom-accfinance",
        "courseName": "B.Com. Accounting and Finance",
        "gameName": "Finance Master",
        "levels": FINANCE_MASTER_LEVELS,
        "collection": "commerce_finance_master_assessments",
        "evaluatedSkills": ["Numerical Reasoning", "Accounting Knowledge", "Accuracy", "Logical Reasoning", "Attention to Detail"]
    },
    "banking-quest": {
        "courseId": "course-bcom-bankins",
        "courseKey": "bcom-bankins",
        "courseName": "B.Com. Banking and Insurance",
        "gameName": "Banking Quest",
        "levels": BANKING_QUEST_LEVELS,
        "collection": "commerce_banking_quest_assessments",
        "evaluatedSkills": ["Financial Literacy", "Numerical Reasoning", "Customer Problem-Solving", "Decision-Making", "Risk Awareness"]
    },
    "tax-detective": {
        "courseId": "course-bcom-tax",
        "courseKey": "bcom-tax",
        "courseName": "B.Com. Taxation",
        "gameName": "Tax Detective",
        "levels": TAX_DETECTIVE_LEVELS,
        "collection": "commerce_tax_detective_assessments",
        "evaluatedSkills": ["Numerical Accuracy", "Attention to Detail", "Rule-Based Reasoning", "Analytical Thinking", "Tax Concepts"]
    },
    "corporate-decision": {
        "courseId": "course-bcom-corpsec",
        "courseKey": "bcom-corpsec",
        "courseName": "B.Com. Corporate Secretaryship",
        "gameName": "Corporate Decision Challenge",
        "levels": CORPORATE_DECISION_LEVELS,
        "collection": "commerce_corporate_decision_assessments",
        "evaluatedSkills": ["Attention to Detail", "Organizational Thinking", "Ethical Reasoning", "Communication", "Decision-Making"]
    },
    "business-tycoon": {
        "courseId": "course-bba-tycoon",
        "courseKey": "bba-tycoon",
        "courseName": "BBA",
        "gameName": "Business Tycoon",
        "levels": BUSINESS_TYCOON_LEVELS,
        "collection": "commerce_business_tycoon_assessments",
        "evaluatedSkills": ["Strategic Thinking", "Business Reasoning", "Resource Management", "Creativity", "Decision-Making"]
    }
}


def evaluate_commerce_game_submission(game_key: str, level_submissions: List[Dict[str, Any]], total_time: int) -> Dict[str, Any]:
    """
    Evaluates student game performance server-side against ground-truth levels.
    Calculates overall score (0-100), accuracy, and skill-specific scores.
    """
    game_config = COMMERCE_GAMES_CATALOG.get(game_key)
    if not game_config:
        raise ValueError(f"Unknown game key: {game_key}")

    levels = game_config["levels"]
    total_levels = len(levels)
    correct_count = 0
    level_breakdown = []

    # Map level submissions by level number
    sub_map = {s.get("level"): s.get("selectedOptionId") for s in level_submissions}

    skill_correct = {skill: 0 for skill in game_config["evaluatedSkills"]}
    skill_total = {skill: 0 for skill in game_config["evaluatedSkills"]}

    for lvl in levels:
        lvl_num = lvl["level"]
        selected_id = sub_map.get(lvl_num)
        is_correct = (selected_id == lvl["correctOptionId"])

        if is_correct:
            correct_count += 1

        # Track skills
        for sk in lvl.get("skills", []):
            if sk in skill_total:
                skill_total[sk] += 1
                if is_correct:
                    skill_correct[sk] += 1

        correct_opt = next((o for o in lvl["options"] if o["id"] == lvl["correctOptionId"]), {})
        level_breakdown.append({
            "level": lvl_num,
            "title": lvl["title"],
            "selectedOptionId": selected_id,
            "correctOptionId": lvl["correctOptionId"],
            "isCorrect": is_correct,
            "explanation": correct_opt.get("explanation", "")
        })

    accuracy = round((correct_count / total_levels) * 100.0, 1) if total_levels > 0 else 0.0
    
    # Calculate time efficiency bonus (if completed within 120s with high accuracy)
    time_bonus = 0.0
    if accuracy >= 80 and total_time < 90:
        time_bonus = 5.0
    elif accuracy >= 60 and total_time < 120:
        time_bonus = 2.0

    game_score = min(100.0, round(accuracy + time_bonus, 1))

    # Skill scores normalized to 0-100
    skill_scores = {}
    for sk in game_config["evaluatedSkills"]:
        total_for_sk = skill_total.get(sk, 0)
        if total_for_sk > 0:
            skill_scores[sk] = round((skill_correct[sk] / total_for_sk) * 100.0, 1)
        else:
            skill_scores[sk] = accuracy

    return {
        "gameKey": game_key,
        "courseId": game_config["courseId"],
        "courseName": game_config["courseName"],
        "gameName": game_config["gameName"],
        "gameScore": game_score,
        "accuracy": accuracy,
        "correctCount": correct_count,
        "totalLevels": total_levels,
        "totalTime": total_time,
        "skillScores": skill_scores,
        "levelBreakdown": level_breakdown
    }
