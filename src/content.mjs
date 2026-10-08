export const profile = {
  fullName: 'Shanmukha Krishna Chaitanya Munagala',
  shortName: 'Shanmukha Munagala',
  firstName: 'Shanmukha',
  initials: 'SM',
  location: 'Bath, United Kingdom',
  role: 'Machine Learning Engineer & Researcher',
  current: 'MSc Advanced Machine Learning with Professional Placement · University of Bath',
  email: 'skcm7099@gmail.com',
  github: 'https://github.com/ShanmukhaKrishnaChaitanya',
  linkedin: 'https://www.linkedin.com/in/shanmukhakrishnachaitanyamunagala/',
  summary: 'I build machine learning systems that turn complex data into useful decisions. My work spans production financial data, smart grid stability, natural language processing, and applied classification.',
  bio: [
    'I am studying Advanced Machine Learning with Professional Placement at the University of Bath, following a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning at SRM University AP.',
    'Previously, I worked as a Software Engineer in Machine Learning at Spizen Technologies, developing and deploying models for similarity pattern matching and price classification on blockchain transactional data. That experience connected my research interests with the demands of real-time production systems.',
    'My research explores how machine learning can support practical decisions across energy systems, battery analytics, and classification problems. I enjoy the full process: understanding the data, engineering useful features, comparing models, and making the results clear.'
  ],
  interests: ['Applied Machine Learning', 'Anomaly Detection', 'Natural Language Processing', 'Deep Learning', 'Generative AI', 'Scalable ML Pipelines'],
  availability: 'Open to Machine Learning, Data Science, and AI opportunities'
};

export const projects = [
  {
    slug: 'smart-grid',
    title: 'Predicting smart grid stability',
    fullTitle: 'Machine Learning-Based Classification for Smart Grid Stability Using Operational Features Dataset',
    category: 'machine-learning',
    categoryLabel: 'Machine Learning',
    eyebrow: 'ENERGY SYSTEMS',
    summary: 'A classification pipeline that uses operational features to identify stability patterns across 60,000 smart grid observations.',
    tags: ['Python', 'Ensemble Learning', 'SMOTE–Tomek'],
    metric: { value: '92.11%', label: 'Peak accuracy' },
    challenge: 'Grid stability depends on interactions between multiple operational parameters. The project explored how supervised learning could capture those relationships while accounting for class imbalance in a 60,000-instance dataset.',
    approach: [
      { title: 'Prepare the operational data', description: 'Refined features, applied a stratified split, and addressed class imbalance with SMOTE–Tomek as part of the preprocessing workflow.' },
      { title: 'Compare supervised models', description: 'Trained and evaluated Logistic Regression, K-Nearest Neighbors, Naive Bayes, Random Forest, and Gradient Boosting.' },
      { title: 'Evaluate classification performance', description: 'Compared accuracy and AUC-ROC to understand how well the models distinguished stability classes and captured nonlinear system dynamics.' }
    ],
    results: [
      { value: '60,000', label: 'Dataset instances' },
      { value: '92.11%', label: 'Peak accuracy' },
      { value: '0.98', label: 'AUC-ROC' }
    ],
    outcome: 'Ensemble methods demonstrated stronger performance in capturing the nonlinear relationships in the operational data. The project brought feature preparation, imbalance handling, and comparative evaluation into one machine learning pipeline.',
    limitations: 'These figures describe the project dataset evaluation. Applying the model to an operating grid would require validation against new grid conditions and a separate assessment of reliability over time.',
    repo: null
  },
  {
    slug: 'keyword-extraction',
    title: 'Finding the keywords that matter',
    fullTitle: 'Keyword Extraction for Content Optimization',
    category: 'nlp',
    categoryLabel: 'Natural Language Processing',
    eyebrow: 'LANGUAGE & CONTENT',
    summary: 'An end-to-end NLP workflow comparing three keyword extraction methods to surface useful terms from noisy content.',
    tags: ['NLTK', 'TF-IDF', 'TextRank', 'YAKE'],
    metric: { value: '3', label: 'Algorithms compared' },
    challenge: 'Content contains structural noise that can obscure the terms most useful for analysis. The project explored how preprocessing and different extraction methods affect the keywords available for content optimization.',
    approach: [
      { title: 'Collect and clean content', description: 'Built a data collection and preprocessing workflow using Python, Pandas, NLTK, and Scikit-learn, removing over 90% of structural noise.' },
      { title: 'Implement three methods', description: 'Implemented TF-IDF, TextRank, and YAKE within the keyword extraction pipeline.' },
      { title: 'Compare the trade-offs', description: 'Analyzed differences between the extraction approaches and used the comparison to derive insights for content optimization.' }
    ],
    results: [
      { value: '3', label: 'Extraction algorithms' },
      { value: '>90%', label: 'Structural noise removed' }
    ],
    outcome: 'The pipeline made it possible to compare statistical and graph-based approaches to keyword extraction within a consistent content-processing workflow.',
    limitations: 'The reported noise reduction concerns preprocessing, rather than keyword relevance or search performance. Extraction quality should be assessed against the language, subject, and editorial goals of each new collection.',
    repo: null
  },
  {
    slug: 'waste-classification',
    title: 'Turning waste images into categories',
    fullTitle: 'Waste Image Classification',
    category: 'computer-vision',
    categoryLabel: 'Computer Vision',
    eyebrow: 'APPLIED COMPUTER VISION',
    summary: 'A multi-class image classification workflow combining learned visual features, dimensionality reduction, and genetic feature selection.',
    tags: ['ResNet50', 'Autoencoder', 'Genetic Algorithm', 'XGBoost'],
    metric: { value: 'Hybrid', label: 'Feature pipeline' },
    challenge: 'Waste categorization requires a useful representation of visual differences between classes. The project investigated how feature extraction, dimensionality reduction, and feature selection could work together in a multi-class classification system.',
    approach: [
      { title: 'Extract visual representations', description: 'Used ResNet50 as part of the image feature extraction pipeline.' },
      { title: 'Reduce and select features', description: 'Combined an autoencoder for dimensionality reduction with a Genetic Algorithm for feature selection.' },
      { title: 'Benchmark classifiers', description: 'Applied XGBoost for classification and benchmarked performance against SVM and ensemble models.' }
    ],
    results: [
      { value: 'ResNet50', label: 'Visual feature extraction' },
      { value: 'Genetic', label: 'Feature selection' },
      { value: 'XGBoost', label: 'Classification' }
    ],
    outcome: 'The project combined deep visual representations with feature selection and conventional classifiers, creating a framework for comparing approaches to waste image categorization.',
    limitations: 'No numerical performance figure is published here. Performance on new images would need evaluation across different lighting, backgrounds, and waste conditions before use in a recycling workflow.',
    repo: null
  },
  {
    slug: 'epilepsy-diagnosis',
    title: 'Recognizing seizure patterns in EEG',
    fullTitle: 'Epilepsy Diagnosis through Machine Learning',
    category: 'machine-learning',
    categoryLabel: 'Machine Learning',
    eyebrow: 'SIGNAL CLASSIFICATION',
    summary: 'An EEG classification pipeline using statistical features and imbalance correction to identify epileptic seizure patterns.',
    tags: ['EEG', 'Feature Engineering', 'XGBoost', 'SMOTE'],
    metric: { value: '95.03%', label: 'Peak accuracy' },
    challenge: 'Large-scale EEG data contains substantial volume and class imbalance. The project focused on extracting a compact statistical representation that retained useful signal information for seizure classification.',
    approach: [
      { title: 'Build a compact representation', description: 'Engineered a statistical feature extraction workflow that reduced the data from 3 million to 30,000 samples while preserving critical information.' },
      { title: 'Address class imbalance', description: 'Applied SMOTE as part of the machine learning workflow to address imbalance between classes.' },
      { title: 'Train and compare models', description: 'Trained and evaluated multiple classifiers, with XGBoost achieving the highest reported accuracy.' }
    ],
    results: [
      { value: '95.03%', label: 'Peak accuracy with XGBoost' },
      { value: '3M → 30K', label: 'Samples after preprocessing' }
    ],
    outcome: 'Statistical feature engineering and imbalance handling supported a more compact classification pipeline, with a peak accuracy of 95.03% using XGBoost in the project evaluation.',
    limitations: 'The result is a research dataset evaluation, not evidence of clinical diagnostic performance. Clinical use would require independent, patient-level validation and assessment beyond aggregate accuracy.',
    repo: null
  }
];

// Keep publication titles verbatim from the supplied résumé; reuse these records everywhere.
export const publications = [
  {
    id: 'thermal-stress-li-ion-batteries',
    title: 'Thermal Stress based Degradation Classification of Li-ion Batteries Using Machine Learning',
    authors: 'Shanmukha Krishna Chaitanya Munagala, et al.',
    conference: '6th IEEE International Conference on Sustainable Energy and Future Electric Transportation',
    shortConference: 'SeFet 2026',
    venue: 'VNIT Nagpur, Maharashtra, India',
    date: '8–11 July 2026',
    year: '2026',
    topic: 'Battery Analytics',
    doi: null
  },
  {
    id: 'smart-grid-ground-faults',
    title: 'Detection of Single-Line-to-Ground Faults in Smart Grid using Machine Learning',
    authors: 'Sunkara Ekeswara Reddy, Shanmukha Krishna Chaitanya Munagala',
    conference: 'Fifth International Conference on Power, Control and Computing Technologies',
    shortConference: 'ICPC2T-2026',
    venue: 'NIT Raipur, Chhattisgarh, India',
    date: '11–13 March 2026',
    year: '2026',
    topic: 'Smart Grids',
    doi: null
  },
  {
    id: 'ev-battery-efficiency-faults',
    title: 'A Machine Learning Approach for Efficiency-Based Fault Detection in EV batteries',
    authors: 'Bhagya Satya Sri Vutukuri, Shanmukha Krishna Chaitanya Munagala, et al.',
    conference: '2025 IEEE 4th International Conference on Smart Technologies for Power, Energy, and Control',
    shortConference: 'STPEC 2025',
    venue: 'NIT Goa, Goa, India',
    date: '10–13 December 2025',
    year: '2025',
    topic: 'Electric Vehicles',
    doi: null
  },
  {
    id: 'fire-and-smoke-detection',
    title: 'Performance Analysis of Fire and Smoke Detection System Employing Machine Learning Techniques',
    authors: 'Shanmukha Krishna Chaitanya Munagala, et al.',
    conference: 'International Conference on Computational Robotics, Testing and Engineering Evaluation',
    shortConference: 'ICCRTEE 2025',
    venue: 'Kalasalingam Academy of Research and Education, Tamil Nadu, India',
    date: '28–30 May 2025',
    year: '2025',
    topic: 'Applied Classification',
    doi: 'https://doi.org/10.1109/ICCRTEE64519.2025.11053116'
  }
];

export const experience = [
  {
    role: 'Software Engineer (Machine Learning)',
    company: 'Spizen Technologies (CLR3 Ventures)',
    location: 'Bengaluru, India',
    date: 'December 2025 – April 2026',
    description: 'Developed and deployed machine learning models on large-scale blockchain transactional data in real-time production pipelines.',
    highlights: [
      'Built models for similarity pattern matching and price classification.',
      'Designed end-to-end workflows spanning data engineering, preprocessing, feature engineering, training, and performance evaluation.',
      'Conducted applied research for pattern discovery and anomaly detection in dynamic financial data systems.'
    ],
    tags: ['Production ML', 'Financial Data', 'Anomaly Detection']
  },
  {
    role: 'Machine Learning Research Intern',
    company: 'SRM University AP',
    location: 'Amaravati, India',
    date: 'June 2025 – July 2025',
    description: 'Developed a machine learning pipeline for smart grid stability classification using multiple operational parameters.',
    highlights: [
      'Evaluated multiple models for stability classification.',
      'Implemented preprocessing and class imbalance correction with SMOTE–Tomek.'
    ],
    tags: ['Smart Grids', 'Model Evaluation', 'SMOTE–Tomek']
  },
  {
    role: 'Front-End Developer',
    company: 'Indian Institute of Technology Roorkee',
    location: 'India',
    date: 'June 2024 – July 2024',
    description: 'Developed responsive front-end components for an educational virtual lab using HTML, CSS, and JavaScript.',
    highlights: [
      'Collaborated with a multidisciplinary team on an interactive learning platform.',
      'Integrated theoretical modules, computational tools, and assessment features.'
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Virtual Labs']
  }
];

export const education = [
  {
    degree: 'MSc Advanced Machine Learning with Professional Placement',
    school: 'University of Bath',
    location: 'Bath, United Kingdom',
    date: '2026 – 2028 (Expected)',
    details: 'Including Professional Placement Year',
    current: true
  },
  {
    degree: 'B.Tech Computer Science and Engineering',
    school: 'SRM University AP',
    location: 'Amaravati, India',
    date: '2022 – 2026',
    details: 'Specialization in Artificial Intelligence and Machine Learning · GPA 7.89 / 10',
    current: false
  }
];

export const skills = [
  { title: 'Programming', items: ['Python', 'C'] },
  { title: 'Machine Learning', items: ['Classification', 'Regression', 'Clustering', 'Anomaly Detection', 'Ensemble Learning', 'Feature Engineering', 'Model Selection', 'Cross-Validation', 'Model Evaluation'] },
  { title: 'Deep Learning & NLP', items: ['Neural Networks', 'Deep Learning', 'Natural Language Processing'] },
  { title: 'Generative AI', items: ['Large Language Models', 'GPT-based Applications', 'Prompt Engineering', 'Structured Prompting'] },
  { title: 'Data Science & Libraries', items: ['Scikit-learn', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Matplotlib', 'Exploratory Data Analysis'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'Jupyter Notebook', 'Google Colab'] }
];

export const certifications = [
  { title: 'Neural Networks and Deep Learning', issuer: 'DeepLearning.AI · Coursera', link: null },
  { title: 'Machine Learning Specialization', issuer: 'Stanford University & DeepLearning.AI · Coursera', link: null }
];

export const workshops = [
  { title: 'Amaravati Quantum Valley Workshop', issuer: 'Government of Andhra Pradesh', date: 'June 2025' },
  { title: '9th Research Day', issuer: 'SRM University AP', date: 'April 2025' },
  { title: 'Generative AI Workshop', issuer: 'Intel · IIT Roorkee', date: 'March 2024' },
  { title: 'Basics of Stock Market Workshop', issuer: 'SEBI · IIT Roorkee', date: 'March 2024' },
  { title: 'Product Management Workshop', issuer: 'IIT Madras', date: 'January 2024' },
  { title: 'UI/UX with Figma Workshop', issuer: 'IIT Madras', date: 'January 2024' },
  { title: 'Full Stack Web Development Workshop', issuer: 'IIT Bhubaneswar', date: 'March 2023' },
  { title: 'Hands-on Blockchain Workshop', issuer: 'SRM University AP', date: 'March 2023' }
];
