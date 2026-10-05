DATA_SCIENCE_WRITTEN_QUESTIONS = [
    {
        "id": "ds_w_1",
        "topic": "Descriptive Statistics",
        "question": "Which measure of central tendency is least sensitive to extreme outliers in a skewed income dataset?",
        "options": ["Median", "Mean", "Standard Deviation", "Range"],
        "correctAnswer": "Median",
        "difficulty": "easy",
        "conceptTested": "Robustness of central tendency metrics against distribution skewness."
    },
    {
        "id": "ds_w_2",
        "topic": "Machine Learning Fundamentals",
        "question": "Predicting the continuous market price of a house based on square footage, location, and age is an example of which type of problem?",
        "options": ["Regression Problem", "Classification Problem", "Clustering Problem", "Dimensionality Reduction"],
        "correctAnswer": "Regression Problem",
        "difficulty": "easy",
        "conceptTested": "Distinction between continuous regression targets and discrete class labels."
    },
    {
        "id": "ds_w_3",
        "topic": "Data Preprocessing",
        "question": "What is the primary objective of data normalization / feature scaling (such as Min-Max scaling or Z-score standardization)?",
        "options": [
            "To prevent features with larger numeric scales from disproportionately dominating distance-based algorithms",
            "To compress the dataset file size for faster email transmission",
            "To automatically remove rows that contain any missing values",
            "To convert text labels into random floating-point integers"
        ],
        "correctAnswer": "To prevent features with larger numeric scales from disproportionately dominating distance-based algorithms",
        "difficulty": "medium",
        "conceptTested": "Feature magnitude normalization in distance-based estimators."
    },
    {
        "id": "ds_w_4",
        "topic": "Model Evaluation",
        "question": "In a severe medical fraud detection task where missing a fraudulent transaction is far more dangerous than false alarms, which metric should be prioritized?",
        "options": ["Recall (Sensitivity)", "Precision", "Accuracy", "Specificity"],
        "correctAnswer": "Recall (Sensitivity)",
        "difficulty": "medium",
        "conceptTested": "Trade-offs in precision vs recall under asymmetric misclassification costs."
    },
    {
        "id": "ds_w_5",
        "topic": "Data Quality & Missing Values",
        "question": "If a categorical survey column has 2% missing values scattered randomly at completely random intervals (MCAR), which imputation strategy preserves data distribution without distorting numerical variance?",
        "options": [
            "Mode imputation or category indicator encoding",
            "Filling missing entries with the mathematical mean of neighboring columns",
            "Replacing all missing values with zero",
            "Doubling all existing category counts"
        ],
        "correctAnswer": "Mode imputation or category indicator encoding",
        "difficulty": "easy",
        "conceptTested": "Handling missing data in categorical attributes."
    },
    {
        "id": "ds_w_6",
        "topic": "Correlation vs Causation",
        "question": "A dataset exhibits a Pearson correlation coefficient of r = 0.88 between daily ice cream sales and municipal drowning incidents. What is the most statistically sound conclusion?",
        "options": [
            "A confounding variable (such as hot summer temperature) influences both variables independently",
            "Eating ice cream directly causes swimmers to drown",
            "Drowning incidents cause citizens to purchase more ice cream",
            "The calculation is mathematically invalid and must be negative"
        ],
        "correctAnswer": "A confounding variable (such as hot summer temperature) influences both variables independently",
        "difficulty": "medium",
        "conceptTested": "Identification of confounding variables and causal inference fallacies."
    },
    {
        "id": "ds_w_7",
        "topic": "Exploratory Data Analysis",
        "question": "Which graphical visualization is best suited for simultaneously inspecting the median, interquartile range (IQR), and potential outliers of a distribution?",
        "options": ["Box and Whisker Plot", "Pie Chart", "Line Chart", "Stacked Bar Chart"],
        "correctAnswer": "Box and Whisker Plot",
        "difficulty": "easy",
        "conceptTested": "Interpreting five-number summary visual representations."
    },
    {
        "id": "ds_w_8",
        "topic": "Overfitting & Generalization",
        "question": "A complex decision tree achieves 100% training accuracy but drops to 54% accuracy on the test set. What phenomenon has occurred and how is it mitigated?",
        "options": [
            "Overfitting; mitigated by pruning the tree, setting max_depth, or using ensemble methods",
            "Underfitting; mitigated by adding more high-degree polynomial features",
            "Data leakage; mitigated by multiplying the learning rate by ten",
            "Zero variance; mitigated by removing test data samples"
        ],
        "correctAnswer": "Overfitting; mitigated by pruning the tree, setting max_depth, or using ensemble methods",
        "difficulty": "difficult",
        "conceptTested": "The bias-variance tradeoff and regularization techniques."
    },
    {
        "id": "ds_w_9",
        "topic": "Data Ethics & Bias",
        "question": "When training an algorithmic hiring screening model on historical resumes from a company that historically hired 90% male engineers, what ethical risk emerges?",
        "options": [
            "Historical algorithmic bias: the model learns to penalize female indicators unless explicitly audited and debiased",
            "Zero computational convergence due to gender text tokens",
            "The model will automatically delete all engineering resumes",
            "Database normalization failure during SQL index creation"
        ],
        "correctAnswer": "Historical algorithmic bias: the model learns to penalize female indicators unless explicitly audited and debiased",
        "difficulty": "medium",
        "conceptTested": "Algorithmic fairness, historical data bias, and responsible AI governance."
    },
    {
        "id": "ds_w_10",
        "topic": "Hypothesis Testing & P-values",
        "question": "In an A/B test evaluating a website change, a data scientist obtains a p-value of 0.012 at a significance threshold of alpha = 0.05. What is the valid statistical interpretation?",
        "options": [
            "Reject the null hypothesis; there is statistically significant evidence of a difference between versions",
            "Accept the null hypothesis; there is a 98.8% probability the null hypothesis is true",
            "The test is inconclusive because the p-value must be greater than 0.5",
            "The new version is guaranteed to increase revenue by exactly 1.2%"
        ],
        "correctAnswer": "Reject the null hypothesis; there is statistically significant evidence of a difference between versions",
        "difficulty": "difficult",
        "conceptTested": "Null hypothesis significance testing and threshold interpretation."
    }
]
