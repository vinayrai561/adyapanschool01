/**
 * Course catalogue — matches plan slugs from checkout.
 * Used to seed MongoDB and as fallback for dashboard.
 */

// ─── Thumbnail mapping: course name keywords → local thumbnail file ───────────
// Filenames match exactly what's in public/course-thumbnails/
export const THUMBNAIL_MAP: Record<string, string> = {
  // AI / ML
  'artificial intelligence':        '/course-thumbnails/AI .png',
  'ai engineering':                 '/course-thumbnails/AI .png',
  'generative ai':                  '/course-thumbnails/AI .png',
  'machine learning':               '/course-thumbnails/ML .png',
  // Data
  'data science':                   '/course-thumbnails/CS.png',
  'data engineering':               '/course-thumbnails/CS.png',
  'data analytics':                 '/course-thumbnails/CS.png',
  'database management':            '/course-thumbnails/CS.png',
  'data structures':                '/course-thumbnails/CS.png',
  'business analytics':             '/course-thumbnails/Business Analytics .png',
  // Web / Dev
  'web development':                '/course-thumbnails/Web Development.png',
  'web 3.0':                        '/course-thumbnails/Web Development.png',
  'app development':                '/course-thumbnails/Web Development.png',
  'python full stack':              '/course-thumbnails/Python Full stack.png',
  'python programming':             '/course-thumbnails/Python Full stack.png',
  'java programming':               '/course-thumbnails/Java Full Stack .png',
  'java full stack':                '/course-thumbnails/Java Full Stack .png',
  'selenium testing':               '/course-thumbnails/Java Full Stack .png',
  // Cloud / DevOps
  'devops':                         '/course-thumbnails/AWS .png',
  'cloud computing':                '/course-thumbnails/AWS .png',
  'aws':                            '/course-thumbnails/AWS .png',
  // Security / Blockchain
  'cyber security':                 '/course-thumbnails/CS.png',
  'blockchain':                     '/course-thumbnails/Bitcoin .png',
  'bitcoin':                        '/course-thumbnails/Bitcoin .png',
  // Design
  'ar/vr':                          '/course-thumbnails/AR_VR .png',
  'ar vr':                          '/course-thumbnails/AR_VR .png',
  'ui/ux':                          '/course-thumbnails/UI_UX.png',
  'ui ux':                          '/course-thumbnails/UI_UX.png',
  'graphic design':                 '/course-thumbnails/UI_UX.png',
  'vfx':                            '/course-thumbnails/UI_UX.png',
  // Management / Commerce
  'finance':                        '/course-thumbnails/Finance .png',
  'investment banking':             '/course-thumbnails/Finance .png',
  'investment analysis':            '/course-thumbnails/Finance .png',
  'financial economics':            '/course-thumbnails/Finance .png',
  'chartered accountancy':          '/course-thumbnails/Finance .png',
  'acca':                           '/course-thumbnails/ACCA F4 .png',
  'marketing management':           '/course-thumbnails/Business Analytics .png',
  'digital marketing':              '/course-thumbnails/Business Analytics .png',
  'social media marketing':         '/course-thumbnails/Business Analytics .png',
  'hrm':                            '/course-thumbnails/Human Resource Management .png',
  'human resource':                 '/course-thumbnails/Human Resource Management .png',
  'management consultancy':         '/course-thumbnails/Business Analytics .png',
  'supply chain':                   '/course-thumbnails/Business Analytics .png',
  'sap fica':                       '/course-thumbnails/Business Analytics .png',
  'salesforce':                     '/course-thumbnails/Business Analytics .png',
  'stock marketing':                '/course-thumbnails/Finance .png',
  'spoken english':                 '/course-thumbnails/Business Analytics .png',
  // ECE
  'embedded systems':               '/course-thumbnails/CS.png',
  'hybrid':                         '/course-thumbnails/Hybrid & Electric Vehicle .png',
  'electric vehicle':               '/course-thumbnails/Hybrid & Electric Vehicle .png',
  'vlsi':                           '/course-thumbnails/VLSI Final.png',
  'iot':                            '/course-thumbnails/CS.png',
  'robotics':                       '/course-thumbnails/CS.png',
  'power systems':                  '/course-thumbnails/Power Systems .png',
  // Economics
  'business & financial economics': '/course-thumbnails/Finance .png',
  'data analysis for economics':    '/course-thumbnails/Business Analytics .png',
  // Mechanical
  'autocad':                        '/course-thumbnails/AutoCAD .png',
  'catia':                          '/course-thumbnails/AutoCAD .png',
  'car design':                     '/course-thumbnails/AutoCAD .png',
  'quality':                        '/course-thumbnails/AutoCAD .png',
  // Bio & Life Sciences
  'bioinformatics':                 '/course-thumbnails/Bioinformatics.png',
  'microbiology':                   '/course-thumbnails/Microbiology .png',
  'molecular biology':              '/course-thumbnails/Molecular Biology .png',
  'genetic engineering':            '/course-thumbnails/Molecular Biology .png',
  'pharmacovigilance':              '/course-thumbnails/Microbiology .png',
  'nano technology':                '/course-thumbnails/Nano Tech .png',
  'nano tech':                      '/course-thumbnails/Nano Tech .png',
  'food science':                   '/course-thumbnails/Microbiology .png',
  'nutrition':                      '/course-thumbnails/Microbiology .png',
  'sensory science':                '/course-thumbnails/Microbiology .png',
  'medical coding':                 '/course-thumbnails/Medical coding.png',
  // Civil
  'construction':                   '/course-thumbnails/AutoCAD .png',
  'civil':                          '/course-thumbnails/AutoCAD .png',
};

/** Fallback thumbnail when no match is found */
export const FALLBACK_THUMBNAIL = '/course-thumbnails/CS Final.png';

/**
 * Given a course title, return the best-matching local thumbnail path.
 * Tries longest keyword match first for accuracy.
 */
export function getThumbnail(title: string): string {
  const lower = title.toLowerCase();
  // Sort keys by length descending so longer/more-specific keys match first
  const keys = Object.keys(THUMBNAIL_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return THUMBNAIL_MAP[key];
  }
  return FALLBACK_THUMBNAIL;
}

// ─── All Programs data (used by /programs page) ──────────────────────────────
export interface CourseProgram {
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  thumbnail: string;
}

export const ALL_PROGRAMS: CourseProgram[] = [
  // ── CSE / IT DOMAINS ──────────────────────────────────────────────────────
  { title: 'Artificial Intelligence',       slug: 'artificial-intelligence',       category: 'CSE / IT DOMAINS',       description: 'Master AI fundamentals: Machine Learning, Deep Learning, Neural Networks & real-world applications.',                                    price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Artificial Intelligence') },
  { title: 'AI Engineering',               slug: 'ai-engineering',               category: 'CSE / IT DOMAINS',       description: 'Build production-grade AI systems, pipelines, and deploy intelligent models at scale.',                                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('AI Engineering') },
  { title: 'Generative AI',                slug: 'generative-ai',                category: 'CSE / IT DOMAINS',       description: 'Explore LLMs, prompt engineering, image generation, and build GenAI-powered applications.',                                          price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Generative AI') },
  { title: 'Machine Learning',             slug: 'machine-learning',             category: 'CSE / IT DOMAINS',       description: 'Master ML algorithms, model building, evaluation, and deployment with Python and Scikit-learn.',                                    price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Machine Learning') },
  { title: 'Data Science',                 slug: 'data-science',                 category: 'CSE / IT DOMAINS',       description: 'Master Data Science: Python, SQL, ML, Power BI, NLP, Gen AI & more with real-world projects.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Science') },
  { title: 'Data Engineering',             slug: 'data-engineering',             category: 'CSE / IT DOMAINS',       description: 'Build scalable data pipelines, ETL workflows, and cloud-based data infrastructure.',                                               price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Engineering') },
  { title: 'Data Analytics',               slug: 'data-analytics',               category: 'CSE / IT DOMAINS',       description: 'Turn raw data into actionable insights using Excel, SQL, Python, and Power BI dashboards.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Analytics') },
  { title: 'Database Management (DBMS)',   slug: 'database-management-dbms',     category: 'CSE / IT DOMAINS',       description: 'Learn relational databases, SQL, normalization, indexing, and database design principles.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Database Management') },
  { title: 'Data Structures & Algorithms', slug: 'data-structures-algorithms',   category: 'CSE / IT DOMAINS',       description: 'Master DSA concepts, problem-solving patterns, and crack top tech company interviews.',                                            price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Structures') },
  { title: 'Web Development',              slug: 'web-development',              category: 'CSE / IT DOMAINS',       description: 'Build full-stack web apps with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',                                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Web Development') },
  { title: 'Web 3.0',                      slug: 'web-30',                       category: 'CSE / IT DOMAINS',       description: 'Explore decentralized web, smart contracts, DApps, and blockchain-based web development.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Web 3.0') },
  { title: 'App Development',              slug: 'app-development',              category: 'CSE / IT DOMAINS',       description: 'Build cross-platform mobile apps using React Native, Flutter, and modern mobile frameworks.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('App Development') },
  { title: 'Python Full Stack',            slug: 'python-full-stack',            category: 'CSE / IT DOMAINS',       description: 'End-to-end Python development: Django/Flask backend, REST APIs, and React frontend.',                                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Python Full Stack') },
  { title: 'Python Programming Curriculum',slug: 'python-programming-curriculum',category: 'CSE / IT DOMAINS',       description: 'Comprehensive Python from basics to advanced: OOP, libraries, automation, and scripting.',                                          price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Python Programming') },
  { title: 'Java Programming',             slug: 'java-programming',             category: 'CSE / IT DOMAINS',       description: 'Core and advanced Java: OOP, collections, multithreading, and enterprise application patterns.',                                   price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Java Programming') },
  { title: 'Java Full Stack',              slug: 'java-full-stack',              category: 'CSE / IT DOMAINS',       description: 'Full-stack Java development with Spring Boot, Hibernate, REST APIs, and Angular/React.',                                           price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Java Full Stack') },
  { title: 'Selenium Testing with Java',   slug: 'selenium-testing-with-java',   category: 'CSE / IT DOMAINS',       description: 'Automate web testing with Selenium WebDriver, TestNG, Maven, and CI/CD integration.',                                             price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Selenium Testing') },
  { title: 'DevOps Engineering',           slug: 'devops-engineering',           category: 'CSE / IT DOMAINS',       description: 'Master CI/CD, Docker, Kubernetes, Jenkins, Terraform, and cloud-native DevOps practices.',                                        price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('DevOps') },
  { title: 'Cloud Computing',              slug: 'cloud-computing',              category: 'CSE / IT DOMAINS',       description: 'Learn cloud architecture, services, and deployment on AWS, Azure, and Google Cloud Platform.',                                     price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Cloud Computing') },
  { title: 'AWS',                          slug: 'aws',                          category: 'CSE / IT DOMAINS',       description: 'Master Amazon Web Services: EC2, S3, Lambda, RDS, and cloud solution architecture.',                                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('AWS') },
  { title: 'Cyber Security',               slug: 'cyber-security',               category: 'CSE / IT DOMAINS',       description: 'Learn ethical hacking, network security, penetration testing, and cybersecurity frameworks.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Cyber Security') },
  { title: 'Blockchain & Bitcoin',         slug: 'blockchain-bitcoin',           category: 'CSE / IT DOMAINS',       description: 'Understand blockchain technology, cryptocurrency, smart contracts, and DeFi applications.',                                        price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Blockchain') },
  { title: 'AR/VR Development',            slug: 'ar-vr-development',            category: 'CSE / IT DOMAINS',       description: 'Build immersive augmented and virtual reality experiences using Unity and Unreal Engine.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('AR/VR') },
  { title: 'UI/UX Design',                 slug: 'ui-ux-design',                 category: 'CSE / IT DOMAINS',       description: 'Design user-centered interfaces with Figma, wireframing, prototyping, and usability testing.',                                     price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('UI/UX') },
  { title: 'Graphic Design',               slug: 'graphic-design',               category: 'CSE / IT DOMAINS',       description: 'Master visual design, branding, typography, and digital media using Adobe Creative Suite.',                                        price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Graphic Design') },
  { title: 'VFX',                          slug: 'vfx',                          category: 'CSE / IT DOMAINS',       description: 'Create stunning visual effects for film and media using industry-standard VFX tools.',                                             price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('VFX') },
  // ── MANAGEMENT & COMMERCE ─────────────────────────────────────────────────
  { title: 'Finance',                                  slug: 'finance',                                  category: 'MANAGEMENT & COMMERCE', description: 'Master financial analysis, budgeting, valuation, and corporate finance fundamentals.',                                          price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Finance') },
  { title: 'Investment Banking',                       slug: 'investment-banking',                       category: 'MANAGEMENT & COMMERCE', description: 'Learn M&A, IPOs, financial modeling, and investment banking deal processes.',                                                  price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Investment Banking') },
  { title: 'Business Analytics',                      slug: 'business-analytics',                      category: 'MANAGEMENT & COMMERCE', description: 'Use data-driven insights to solve business problems with Excel, SQL, and Power BI.',                                           price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Business Analytics') },
  { title: 'Marketing Management',                    slug: 'marketing-management',                    category: 'MANAGEMENT & COMMERCE', description: 'Learn strategic marketing, consumer behavior, brand management, and market research.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Marketing Management') },
  { title: 'Digital Marketing & Growth Strategy',     slug: 'digital-marketing-growth-strategy',       category: 'MANAGEMENT & COMMERCE', description: 'Master SEO, SEM, social media, email marketing, and growth hacking strategies.',                                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Digital Marketing') },
  { title: 'Social Media Marketing',                  slug: 'social-media-marketing',                  category: 'MANAGEMENT & COMMERCE', description: 'Build and manage brand presence across Instagram, LinkedIn, YouTube, and Meta Ads.',                                           price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Social Media Marketing') },
  { title: 'HRM',                                     slug: 'hrm',                                     category: 'MANAGEMENT & COMMERCE', description: 'Learn human resource management: recruitment, payroll, performance, and HR analytics.',                                        price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('HRM') },
  { title: 'Management Consultancy',                  slug: 'management-consultancy',                  category: 'MANAGEMENT & COMMERCE', description: 'Develop consulting frameworks, problem-solving skills, and business strategy expertise.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Management Consultancy') },
  { title: 'Supply Chain Management',                 slug: 'supply-chain-management',                 category: 'MANAGEMENT & COMMERCE', description: 'Master logistics, procurement, inventory management, and supply chain optimization.',                                          price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Supply Chain') },
  { title: 'SAP FICA',                                slug: 'sap-fica',                                category: 'MANAGEMENT & COMMERCE', description: 'Learn SAP Financial Contract Accounting for utilities and telecommunications industries.',                                       price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('SAP FICA') },
  { title: 'Salesforce',                              slug: 'salesforce',                              category: 'MANAGEMENT & COMMERCE', description: 'Master Salesforce CRM, administration, development, and cloud platform certifications.',                                        price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Salesforce') },
  { title: 'Stock Marketing',                         slug: 'stock-marketing',                         category: 'MANAGEMENT & COMMERCE', description: 'Learn equity markets, technical analysis, trading strategies, and portfolio management.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Stock Marketing') },
  { title: 'ACCA F4 (Business & Corporate Law)',      slug: 'acca-f4-business-corporate-law',          category: 'MANAGEMENT & COMMERCE', description: 'Prepare for ACCA F4 exam covering business law, corporate governance, and legal frameworks.',                                  price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('ACCA') },
  { title: 'Chartered Accountancy / CFA',             slug: 'chartered-accountancy-cfa',               category: 'MANAGEMENT & COMMERCE', description: 'Structured preparation for CA/CFA exams with financial accounting and analysis modules.',                                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Chartered Accountancy') },
  { title: 'Spoken English & Communication',          slug: 'spoken-english-communication',            category: 'MANAGEMENT & COMMERCE', description: 'Build professional communication, presentation, and business English skills for the workplace.',                                price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Spoken English') },
  // ── ECE DOMAINS ───────────────────────────────────────────────────────────
  { title: 'Embedded Systems',          slug: 'embedded-systems',          category: 'ECE DOMAINS', description: 'Learn microcontrollers, RTOS, firmware development, and embedded C programming.',                                                    price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Embedded Systems') },
  { title: 'Hybrid & Electric Vehicle', slug: 'hybrid-electric-vehicle',   category: 'ECE DOMAINS', description: 'Understand EV architecture, battery management systems, and hybrid powertrain technology.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Hybrid') },
  { title: 'VLSI',                      slug: 'vlsi',                      category: 'ECE DOMAINS', description: 'Master VLSI design, Verilog/VHDL, FPGA programming, and chip design methodologies.',                                               price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('VLSI') },
  { title: 'IoT & Robotics',            slug: 'iot-robotics',              category: 'ECE DOMAINS', description: 'Build IoT systems, smart devices, and robotic applications with Arduino and Raspberry Pi.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('IoT') },
  { title: 'Power Systems',             slug: 'power-systems',             category: 'ECE DOMAINS', description: 'Study power generation, transmission, distribution, and renewable energy systems.',                                                  price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Power Systems') },
  // ── ECONOMICS ─────────────────────────────────────────────────────────────
  { title: 'Business & Financial Economics', slug: 'business-financial-economics', category: 'ECONOMICS', description: 'Explore microeconomics, macroeconomics, financial markets, and economic policy analysis.',                                    price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Business & Financial Economics') },
  { title: 'Investment Analysis',            slug: 'investment-analysis',          category: 'ECONOMICS', description: 'Learn equity valuation, portfolio theory, risk analysis, and investment decision frameworks.',                                 price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Investment Analysis') },
  { title: 'Data Analysis for Economics',    slug: 'data-analysis-for-economics',  category: 'ECONOMICS', description: 'Apply statistical tools, econometrics, and data visualization to economic research.',                                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Data Analysis for Economics') },
  { title: 'Financial Economics',            slug: 'financial-economics',          category: 'ECONOMICS', description: 'Study asset pricing, derivatives, risk management, and financial market theory.',                                             price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Financial Economics') },
  // ── MECHANICAL ENGINEERING ────────────────────────────────────────────────
  { title: 'AutoCAD',                        slug: 'autocad',                       category: 'MECHANICAL ENGINEERING', description: 'Master 2D and 3D CAD drafting, mechanical drawings, and design documentation with AutoCAD.',                     price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('AutoCAD') },
  { title: 'CATIA',                          slug: 'catia',                         category: 'MECHANICAL ENGINEERING', description: 'Learn CATIA V5/V6 for 3D modeling, surface design, and product lifecycle management.',                           price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('CATIA') },
  { title: 'Car Design',                     slug: 'car-design',                    category: 'MECHANICAL ENGINEERING', description: 'Explore automotive design principles, styling, aerodynamics, and concept car development.',                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Car Design') },
  { title: 'Quality & Safety Professionals', slug: 'quality-safety-professionals',  category: 'MECHANICAL ENGINEERING', description: 'Learn quality management systems, ISO standards, safety protocols, and Six Sigma methodologies.',               price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Quality') },
  // ── BIO & LIFE SCIENCES ───────────────────────────────────────────────────
  { title: 'Bioinformatics',               slug: 'bioinformatics',               category: 'BIO & LIFE SCIENCES', description: 'Apply computational tools to analyze biological data, genomics, and protein structures.',                              price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Bioinformatics') },
  { title: 'Microbiology',                 slug: 'microbiology',                 category: 'BIO & LIFE SCIENCES', description: 'Study microorganisms, microbial genetics, immunology, and industrial microbiology applications.',                     price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Microbiology') },
  { title: 'Molecular Biology',            slug: 'molecular-biology',            category: 'BIO & LIFE SCIENCES', description: 'Explore DNA, RNA, gene expression, cloning techniques, and molecular diagnostics.',                                   price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Molecular Biology') },
  { title: 'Genetic Engineering',          slug: 'genetic-engineering',          category: 'BIO & LIFE SCIENCES', description: 'Learn CRISPR, recombinant DNA technology, gene therapy, and biotechnology applications.',                             price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Genetic Engineering') },
  { title: 'Pharmacovigilance',            slug: 'pharmacovigilance',            category: 'BIO & LIFE SCIENCES', description: 'Study drug safety monitoring, adverse event reporting, and regulatory pharmacovigilance systems.',                    price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Pharmacovigilance') },
  { title: 'Nano Technology',              slug: 'nano-technology',              category: 'BIO & LIFE SCIENCES', description: 'Explore nanomaterials, nanofabrication, and applications in medicine, electronics, and energy.',                     price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Nano Technology') },
  { title: 'Food Science & Technology',    slug: 'food-science-technology',      category: 'BIO & LIFE SCIENCES', description: 'Learn food processing, preservation, quality control, and food safety regulations.',                                  price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Food Science') },
  { title: 'Nutrition & Health Management',slug: 'nutrition-health-management',  category: 'BIO & LIFE SCIENCES', description: 'Study clinical nutrition, dietetics, health promotion, and therapeutic diet planning.',                               price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Nutrition') },
  { title: 'Sensory Science',              slug: 'sensory-science',              category: 'BIO & LIFE SCIENCES', description: 'Understand sensory evaluation methods, consumer testing, and product development applications.',                      price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Sensory Science') },
  { title: 'Medical Coding',               slug: 'medical-coding',               category: 'BIO & LIFE SCIENCES', description: 'Master ICD-10, CPT coding, medical billing, and healthcare documentation standards.',                                price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Medical Coding') },
  // ── CIVIL ENGINEERING ─────────────────────────────────────────────────────
  { title: 'Construction Planning',        slug: 'construction-planning',        category: 'CIVIL ENGINEERING',   description: 'Learn project planning, scheduling, cost estimation, and construction management techniques.',                         price: '₹3,000', duration: '2-3 Months', thumbnail: getThumbnail('Construction') },
];

export const COURSE_CATALOGUE = [
  {
    slug: 'plan-1',
    title: 'Adyapan Starter',
    subtitle: 'Build your foundation with core industry skills',
    duration: '1 Months',
    category: 'Foundation',
    level: 'Beginner' as const,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Introduction & Fundamentals',
        lessons: [
          { title: 'Welcome to Adyapan', duration: '5 min', isFree: true },
          { title: 'Course Overview & Roadmap', duration: '8 min', isFree: true },
          { title: 'Setting Up Your Environment', duration: '12 min', isFree: false },
          { title: 'Core Concepts Explained', duration: '18 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Core Skills',
        lessons: [
          { title: 'Skill Building Session 1', duration: '20 min', isFree: false },
          { title: 'Skill Building Session 2', duration: '22 min', isFree: false },
          { title: 'Hands-on Exercise', duration: '30 min', isFree: false },
          { title: 'Quiz & Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Practical Application',
        lessons: [
          { title: 'Real-world Project Intro', duration: '10 min', isFree: false },
          { title: 'Project Walkthrough', duration: '35 min', isFree: false },
          { title: 'Submission Guidelines', duration: '8 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Certification',
        lessons: [
          { title: 'Final Assessment', duration: '20 min', isFree: false },
          { title: 'Certificate Walkthrough', duration: '5 min', isFree: false },
          { title: 'Next Steps & Career Guidance', duration: '12 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-2',
    title: 'Adyapan Standard',
    subtitle: 'Hands-on projects with expert mentorship',
    duration: '2 Months',
    category: 'Professional',
    level: 'Intermediate' as const,
    thumbnail: 'AWS.png',
    modules: [
      {
        title: 'Module 1 — Foundation & Core Concepts',
        lessons: [
          { title: 'Program Introduction', duration: '6 min', isFree: true },
          { title: 'Industry Overview', duration: '14 min', isFree: true },
          { title: 'Tools & Technologies', duration: '20 min', isFree: false },
          { title: 'Best Practices', duration: '18 min', isFree: false },
          { title: 'Module Quiz', duration: '10 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Hands-on Projects',
        lessons: [
          { title: 'Project 1: Setup & Planning', duration: '25 min', isFree: false },
          { title: 'Project 1: Development', duration: '45 min', isFree: false },
          { title: 'Project 1: Review & Feedback', duration: '20 min', isFree: false },
          { title: 'Project 2: Advanced Features', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Industry Case Studies',
        lessons: [
          { title: 'Case Study 1', duration: '30 min', isFree: false },
          { title: 'Case Study 2', duration: '28 min', isFree: false },
          { title: 'Discussion & Analysis', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Mentorship Sessions',
        lessons: [
          { title: 'Mentor Session 1: Career Path', duration: '45 min', isFree: false },
          { title: 'Mentor Session 2: Technical Review', duration: '45 min', isFree: false },
          { title: 'Portfolio Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Assessment & Certification',
        lessons: [
          { title: 'Final Project Submission', duration: '60 min', isFree: false },
          { title: 'Peer Review', duration: '20 min', isFree: false },
          { title: 'Certificate & Next Steps', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-3',
    title: 'Adyapan Professional',
    subtitle: 'Real projects, placement support & 1:1 mentorship',
    duration: '3 Months',
    category: 'Advanced',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Advanced Concepts',
        lessons: [
          { title: 'Advanced Architecture Overview', duration: '20 min', isFree: true },
          { title: 'Design Patterns', duration: '35 min', isFree: false },
          { title: 'Performance Optimization', duration: '28 min', isFree: false },
          { title: 'Security Best Practices', duration: '22 min', isFree: false },
          { title: 'Module Assessment', duration: '15 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Real-world Project Development',
        lessons: [
          { title: 'Project Scoping & Planning', duration: '30 min', isFree: false },
          { title: 'Sprint 1: Core Features', duration: '60 min', isFree: false },
          { title: 'Sprint 2: Advanced Features', duration: '60 min', isFree: false },
          { title: 'Sprint 3: Testing & QA', duration: '45 min', isFree: false },
          { title: 'Sprint 4: Deployment', duration: '40 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Industry Expert Sessions',
        lessons: [
          { title: 'Expert Talk: Industry Trends', duration: '50 min', isFree: false },
          { title: 'Expert Talk: Career Growth', duration: '45 min', isFree: false },
          { title: 'Live Q&A Session', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Portfolio Building',
        lessons: [
          { title: 'Portfolio Strategy', duration: '20 min', isFree: false },
          { title: 'GitHub Profile Optimization', duration: '25 min', isFree: false },
          { title: 'LinkedIn Profile', duration: '20 min', isFree: false },
          { title: 'Resume Building', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Placement Preparation',
        lessons: [
          { title: 'Mock Interview 1', duration: '45 min', isFree: false },
          { title: 'Mock Interview 2', duration: '45 min', isFree: false },
          { title: 'Aptitude & Coding Tests', duration: '60 min', isFree: false },
        ],
      },
      {
        title: 'Module 6 — Certification',
        lessons: [
          { title: 'Final Capstone Project', duration: '90 min', isFree: false },
          { title: 'Evaluation & Feedback', duration: '30 min', isFree: false },
          { title: 'Certificate Ceremony', duration: '10 min', isFree: false },
        ],
      },
    ],
  },
  {
    slug: 'plan-4-premium',
    title: 'Adyapan Career Pro',
    subtitle: 'Placement guarantee, 1:1 mentorship & industry projects',
    duration: '4 Months',
    category: 'Career',
    level: 'Advanced' as const,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    modules: [
      {
        title: 'Module 1 — Deep-dive Core Curriculum',
        lessons: [
          { title: 'Program Kickoff & Goal Setting', duration: '15 min', isFree: true },
          { title: 'Core Technology Deep Dive', duration: '45 min', isFree: false },
          { title: 'Advanced Patterns & Architecture', duration: '40 min', isFree: false },
          { title: 'System Design Fundamentals', duration: '50 min', isFree: false },
          { title: 'Module 1 Assessment', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 2 — Industry-grade Projects',
        lessons: [
          { title: 'Project 1: E-commerce Platform', duration: '90 min', isFree: false },
          { title: 'Project 2: Real-time Application', duration: '90 min', isFree: false },
          { title: 'Project 3: Data Pipeline', duration: '75 min', isFree: false },
          { title: 'Code Review & Optimization', duration: '45 min', isFree: false },
        ],
      },
      {
        title: 'Module 3 — Expert Masterclasses',
        lessons: [
          { title: 'Masterclass: Scaling Systems', duration: '60 min', isFree: false },
          { title: 'Masterclass: Cloud Architecture', duration: '60 min', isFree: false },
          { title: 'Masterclass: AI/ML Integration', duration: '60 min', isFree: false },
          { title: 'Live Workshop', duration: '90 min', isFree: false },
        ],
      },
      {
        title: 'Module 4 — Mock Interviews & GD',
        lessons: [
          { title: 'Technical Interview Prep', duration: '45 min', isFree: false },
          { title: 'Mock Interview Round 1', duration: '60 min', isFree: false },
          { title: 'Mock Interview Round 2', duration: '60 min', isFree: false },
          { title: 'Group Discussion Practice', duration: '45 min', isFree: false },
          { title: 'HR Interview Prep', duration: '30 min', isFree: false },
        ],
      },
      {
        title: 'Module 5 — Resume & Portfolio',
        lessons: [
          { title: 'ATS-Optimized Resume', duration: '35 min', isFree: false },
          { title: 'Portfolio Website', duration: '45 min', isFree: false },
          { title: 'LinkedIn Optimization', duration: '25 min', isFree: false },
          { title: 'GitHub Profile', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 6 — Placement Drive',
        lessons: [
          { title: 'Company Shortlisting', duration: '20 min', isFree: false },
          { title: 'Application Strategy', duration: '25 min', isFree: false },
          { title: 'Offer Negotiation', duration: '20 min', isFree: false },
        ],
      },
      {
        title: 'Module 7 — Certification',
        lessons: [
          { title: 'Final Capstone Presentation', duration: '60 min', isFree: false },
          { title: 'Peer & Mentor Evaluation', duration: '30 min', isFree: false },
          { title: 'Certificate & Alumni Network', duration: '15 min', isFree: false },
        ],
      },
    ],
  },
];

/** Compute totalLessons from modules */
export function withTotalLessons(course: typeof COURSE_CATALOGUE[0]) {
  const total = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  return { ...course, totalLessons: total };
}
