'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Play, CheckCircle, Download, MessageCircle, Clock, Users, Award } from 'lucide-react';
import PricingModal from '@/components/PricingModal';

// Helper function to get brochure filename from course slug
const getBrochureFilename = (slug: string, courseTitle: string) => {
  // Mapping of course slugs to actual brochure filenames
  const brochureMapping: Record<string, string> = {
    'artificial-intelligence': 'Artificial Intelligence.pdf',
    'ai-engineering': 'Artificial Intelligence Engineering.pdf',
    'generative-ai': 'Generative Artificial Intelligence.pdf',
    'machine-learning': 'Machine Learning.pdf',
    'data-science': 'Data Science Profesional Program.pdf',
    'data-engineering': 'Data Engineering.pdf',
    'data-analytics': 'Data Analytics.pdf',
    'database-management-dbms': 'Database Management System.pdf',
    'data-structures-algorithms': 'Data Structure & Algorithm (DSA).pdf',
    'web-development': 'Web Devlopment.pdf',
    'app-development': 'App Development Program.pdf',
    'python-full-stack': 'Python full stack Development.pdf',
    'python-programming-curriculum': 'Python full stack Development.pdf',
    'java-programming': 'Java Program Curriculum.pdf',
    'java-full-stack': 'Java Full Stack.pdf',
    'selenium-testing-with-java': 'Selenium Testing Java.pdf',
    'devops-engineering': 'Devops Engineering Program.pdf',
    'cloud-computing': 'Cloud Computing.pdf',
    'aws': 'Amazon Web Services.pdf',
    'cyber-security': 'Cyber Security.pdf',
    'blockchain-bitcoin': 'Blockchain & Bitcoin Programming.pdf',
    'ar-vr-development': 'AR-VR Development Program.pdf',
    'ui-ux-design': 'UI_UX Design Program.pdf',
    'graphic-design': 'Graphic Design Program.pdf',
    'vfx': 'VFX.pdf',
    'finance': 'Finance Program.pdf',
    'investment-banking': 'Investment Banking.pdf',
    'business-analytics': 'Business Analytics.pdf',
    'marketing-management': 'Marketing Management Program.pdf',
    'digital-marketing-growth-strategy': 'Digital Marketing & Growth Strategy.pdf',
    'social-media-marketing': 'Social Media Marketing Program.pdf',
    'hrm': 'Human Resource Management (HRM).pdf',
    'management-consultancy': 'Marketing Management Program.pdf',
    'supply-chain-management': 'Supply Chain Management.pdf',
    'sap-fica': 'SAP FICA ( Finance control accounting ).pdf',
    'salesforce': 'SalesForce.pdf',
    'stock-marketing': 'Stock Marketing Program.pdf',
    'acca-f4-business-corporate-law': 'ACCA F4 (Corporate Law).pdf',
    'chartered-accountancy-cfa': 'Chartered Accountancy(Chartered Financial Analyst).pdf',
    'spoken-english-communication': 'ACFrOgBL7ZEDGmdINlBTakKnSmLLTuN.pdf',
    'embedded-systems': 'Embedded System Program.pdf',
    'hybrid-electric-vehicle': 'Hybrid & Electrical Engineering program.pdf',
    'vlsi': 'Very Large Scale Integration (VLSI).pdf',
    'iot-robotics': 'Internet of Things & Robotics Program.pdf',
    'power-systems': 'Hybrid & Electrical Engineering program.pdf',
    'business-financial-economics': 'Finance Program.pdf',
    'investment-analysis': 'Investment Banking.pdf',
    'data-analysis-for-economics': 'Data Analytics.pdf',
    'financial-economics': 'Finance Program.pdf',
    'autocad': 'AutoCAD Design Program.pdf',
    'catia': 'Catia.pdf',
    'car-design': 'AutoCAD Design Program.pdf',
    'quality-safety-professionals': 'Quality & Safety Professionals.pdf',
    'bioinformatics': 'Bioinformatics Program.pdf',
    'microbiology': 'Microbiology program.pdf',
    'molecular-biology': 'Molecular Biology.pdf',
    'genetic-engineering': 'Genetics Engineering Program.pdf',
    'pharmacovigilance': 'Pharmacovigilance Curriculum.pdf',
    'nano-technology': 'Nano Technology Program.pdf',
    'food-science-technology': 'Food Science & Technology.pdf',
    'nutrition-health-management': 'Nutrition & Health Management.pdf',
    'sensory-science': 'Sensory Science.pdf',
    'medical-coding': 'Medical Coding Curriculum.pdf',
    'construction-planning': 'Construction Planning.pdf'
  };

  return brochureMapping[slug] || `${courseTitle} Program.pdf`;
};

// Helper function to generate instructor data based on course
const generateInstructors = (courseTitle: string) => {
  const firstNames = ['Simran', 'Kalyan', 'Sanket', 'Gaurav', 'Ashish', 'Mudita', 'Manish', 'Priya', 'Rajesh', 'Neha'];
  const lastNames = ['Bindra', 'Reddy', 'Patel', 'Sinha', 'Prasad', 'Sharma', 'Garg', 'Kumar', 'Singh', 'Verma'];
  const companies = ['Google', 'Microsoft', 'Amazon', 'Mastercard', 'Philips', 'Samsung', 'Fractal', 'Meta', 'Apple', 'Netflix'];
  const roles = ['Engineer', 'Data Engineer', 'Senior Engineer', 'Tech Lead', 'Architect', 'Manager', 'Specialist', 'Developer'];
  const experiences = ['4+ years exp', '6+ years exp', '7+ years exp', '5+ years exp', '10+ years exp', '8+ years exp', '3+ years exp', '9+ years exp'];

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
    role: `${roles[i % roles.length]}, ${companies[i % companies.length]}`,
    company: companies[i % companies.length],
    experience: experiences[i % experiences.length],
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.1.0`,
    linkedIn: true,
  }));
};

// Helper function to generate course data
const generateCourseData = (title: string, category: string) => ({
  title,
  category,
  duration: '2-3 Months',
  rating: 4.7 + Math.random() * 0.3,
  totalRatings: Math.floor(Math.random() * 10000 + 5000).toString(),
  image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000000)}?q=80&w=800&auto=format&fit=crop`,
  description: `Master ${title}: Comprehensive curriculum with live projects and industry experts`,
  highlights: [
    'Live online interactive sessions from IIT faculty & top industry experts',
    'Guaranteed placement support with our career services for freshers and professionals',
    `Earn prestigious ${title} certification from iHub IIT Roorkee & Microsoft`,
    'Work on real projects and build industry-ready portfolio'
  ],
  partner: 'Microsoft',
  partnerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
  curriculum: {
    title: `Advanced ${title} Curriculum To Help You Master Industry Skills`,
    modules: [
      {
        id: 1,
        title: `${title} Fundamentals`,
        description: `Introduction to ${title} concepts and core principles`,
        topics: {
          'Basics': [
            `What is ${title}`,
            'Key Concepts',
            'Applications',
            'Industry Use Cases'
          ],
          'Foundations': [
            'Core Principles',
            'Best Practices',
            'Tools & Technologies',
            'Getting Started'
          ]
        }
      },
      {
        id: 2,
        title: `${title} Advanced Topics`,
        description: `Advanced concepts and real-world applications of ${title}. Learn industry best practices and advanced techniques used by leading companies.`,
        topics: {
          'Advanced Concepts': [
            'Complex Scenarios & Problem Solving',
            'Optimization Techniques & Performance Tuning',
            'Scalability & Architecture Patterns',
            'Security & Best Practices',
            'Integration with Other Systems',
            'Advanced Debugging & Troubleshooting'
          ],
          'Practical Applications': [
            'Real-world Project Implementation',
            'Case Studies from Industry Leaders',
            'Enterprise Solutions & Patterns',
            'Performance Optimization Strategies',
            'Handling Edge Cases',
            'Production Deployment Practices'
          ]
        }
      },
      {
        id: 3,
        title: `${title} Projects & Deployment`,
        description: `Hands-on project development, testing, and deployment of ${title} solutions. Build production-ready applications and learn deployment strategies.`,
        topics: {
          'Project Development': [
            'Project Planning & Requirements Analysis',
            'System Design & Architecture',
            'Implementation & Development',
            'Testing & Quality Assurance',
            'Code Review & Best Practices',
            'Documentation & Knowledge Transfer'
          ],
          'Deployment & Maintenance': [
            'Deployment Strategies & CI/CD',
            'Production Environment Setup',
            'Monitoring & Performance Tracking',
            'Troubleshooting & Debugging',
            'Scaling & Load Balancing',
            'Maintenance & Updates'
          ]
        }
      }
    ]
  }
});

// Course data structure with all courses
const courseData: Record<string, any> = {
  'artificial-intelligence': {
    title: 'Artificial Intelligence',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.8,
    totalRatings: '12,450',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    description: 'Master AI fundamentals: Machine Learning, Deep Learning, Neural Networks & more',
    highlights: [
      'Live online interactive sessions from IIT faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Earn prestigious AI certification from iHub IIT Roorkee & Microsoft',
      'Work on real AI projects and build industry-ready portfolio'
    ],
    partner: 'Microsoft',
    partnerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
    curriculum: {
      title: 'Advanced AI Curriculum To Help You Master Machine Learning, Deep Learning & Neural Networks',
      modules: [
        {
          id: 1,
          title: 'AI Fundamentals',
          description: 'Introduction to Artificial Intelligence, History, Applications, and Future Scope',
          topics: {
            'Python for AI': [
              'Python Basics for AI',
              'NumPy and Pandas',
              'Data Manipulation',
              'Visualization with Matplotlib'
            ],
            'Mathematics for AI': [
              'Linear Algebra',
              'Statistics and Probability',
              'Calculus Fundamentals',
              'Optimization Techniques'
            ]
          }
        },
        {
          id: 2,
          title: 'Machine Learning',
          description: 'Supervised and Unsupervised Learning Algorithms',
          topics: {
            'Supervised Learning': [
              'Linear Regression',
              'Logistic Regression',
              'Decision Trees',
              'Random Forest',
              'SVM'
            ],
            'Unsupervised Learning': [
              'K-Means Clustering',
              'Hierarchical Clustering',
              'PCA',
              'Association Rules'
            ]
          }
        },
        {
          id: 3,
          title: 'Deep Learning',
          description: 'Neural Networks and Deep Learning Frameworks',
          topics: {
            'Neural Networks': [
              'Perceptron',
              'Multi-layer Perceptron',
              'Backpropagation',
              'Activation Functions'
            ],
            'Deep Learning': [
              'CNN for Image Processing',
              'RNN for Sequential Data',
              'LSTM and GRU',
              'Transfer Learning'
            ]
          }
        },
        {
          id: 4,
          title: 'Natural Language Processing',
          description: 'Text Processing and Language Understanding',
          topics: {
            'NLP Basics': [
              'Text Preprocessing',
              'Tokenization',
              'Stemming and Lemmatization',
              'Named Entity Recognition'
            ],
            'Advanced NLP': [
              'Sentiment Analysis',
              'Text Classification',
              'Language Models',
              'Transformers and BERT'
            ]
          }
        },
        {
          id: 5,
          title: 'Computer Vision',
          description: 'Image Processing and Computer Vision Applications',
          topics: {
            'Image Processing': [
              'Image Fundamentals',
              'Filtering and Enhancement',
              'Feature Detection',
              'Object Recognition'
            ],
            'Advanced Vision': [
              'Face Recognition',
              'Object Detection',
              'Image Segmentation',
              'GANs for Image Generation'
            ]
          }
        },
        {
          id: 6,
          title: 'AI Project & Deployment',
          description: 'Real-world AI Projects and Model Deployment',
          topics: {
            'Project Development': [
              'Problem Definition',
              'Data Collection and Cleaning',
              'Model Selection and Training',
              'Performance Evaluation'
            ],
            'Deployment': [
              'Model Optimization',
              'Cloud Deployment (AWS/Azure)',
              'API Development',
              'Monitoring and Maintenance'
            ]
          }
        }
      ]
    }
  },
  'data-science': {
    title: 'Data Science',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.7,
    totalRatings: '15,796',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    description: 'Master Data Science courses: Python, SQL, ML, Power BI, NLP, Gen AI, & more',
    highlights: [
      'Live online interactive sessions from IIT faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Earn prestigious data science certification from iHub IIT Roorkee & Microsoft',
      'Work on real data science projects with industry datasets'
    ],
    partner: 'Microsoft',
    partnerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
    curriculum: {
      title: 'Advanced Data Engineering Curriculum To Help You Master Cloud, ETL & Big Data',
      modules: [
        {
          id: 1,
          title: 'Programming',
          description: 'Strong basics are non-negotiable. Python and SQL fundamentals for data science.',
          topics: {
            'SQL': [
              'Intro to SQL and Advance Select',
              'Joins',
              'Sorting and Grouping',
              'Aggregation',
              'CTEs',
              'Subqueries',
              'Advance string functions, regex/clause',
              'Windowing Functions',
              'Recursive CTE'
            ],
            'Python': [
              'Python Refresher',
              'Functional Programming',
              'Modules,Errors and Exceptions',
              'OOPS',
              'NumPy',
              'Pandas + Data Visualisation',
              'Project: Navigating the Stock market with Python'
            ]
          }
        },
        {
          id: 2,
          title: 'Data Engineering Fundamentals',
          description: 'Core concepts of data engineering, ETL processes, and data pipelines',
          topics: {
            'ETL Processes': [
              'Extract, Transform, Load',
              'Data Pipeline Design',
              'Data Quality and Validation',
              'Error Handling'
            ],
            'Big Data Concepts': [
              'Distributed Computing',
              'MapReduce',
              'Hadoop Ecosystem',
              'Spark Fundamentals'
            ]
          }
        },
        {
          id: 3,
          title: 'Data Engineering Tools',
          description: 'Modern tools and technologies for data engineering',
          topics: {
            'Apache Spark': [
              'Spark Core',
              'Spark SQL',
              'DataFrames and Datasets',
              'Spark Streaming'
            ],
            'Cloud Platforms': [
              'AWS Data Services',
              'Azure Data Factory',
              'Google Cloud Platform',
              'Data Lake Architecture'
            ]
          }
        },
        {
          id: 4,
          title: 'Cloud Technologies',
          description: 'Cloud-based data engineering solutions and best practices',
          topics: {
            'AWS Services': [
              'S3 and Data Storage',
              'EMR and EC2',
              'Redshift Data Warehouse',
              'Lambda Functions'
            ],
            'Data Warehousing': [
              'Dimensional Modeling',
              'Star and Snowflake Schema',
              'Data Mart Design',
              'Performance Optimization'
            ]
          }
        },
        {
          id: 5,
          title: 'Focused DSA for Data engineers',
          description: 'Data structures and algorithms specific to data engineering',
          topics: {
            'Data Structures': [
              'Arrays and Lists',
              'Hash Tables',
              'Trees and Graphs',
              'Queues and Stacks'
            ],
            'Algorithms': [
              'Sorting Algorithms',
              'Search Algorithms',
              'Graph Algorithms',
              'Optimization Techniques'
            ]
          }
        },
        {
          id: 6,
          title: 'Machine Learning in Data engineering',
          description: 'Integrating ML models into data engineering pipelines',
          topics: {
            'MLOps': [
              'Model Deployment',
              'Model Monitoring',
              'A/B Testing',
              'Model Versioning'
            ],
            'Real-time ML': [
              'Streaming ML',
              'Feature Stores',
              'Model Serving',
              'Batch vs Real-time Inference'
            ]
          }
        }
      ]
    }
  },
  'machine-learning': {
    title: 'Machine Learning',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.9,
    totalRatings: '8,234',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?q=80&w=800&auto=format&fit=crop',
    description: 'Master Machine Learning algorithms, model building, and deployment techniques',
    highlights: [
      'Comprehensive ML algorithms from basics to advanced',
      'Hands-on projects with real-world datasets',
      'Industry-standard tools: Python, Scikit-learn, TensorFlow',
      'End-to-end ML project development and deployment'
    ],
    partner: 'Google',
    partnerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png',
    curriculum: {
      title: 'Comprehensive Machine Learning Curriculum From Basics to Advanced',
      modules: [
        {
          id: 1,
          title: 'ML Fundamentals',
          description: 'Introduction to Machine Learning concepts and mathematics',
          topics: {
            'Introduction': [
              'What is Machine Learning',
              'Types of ML',
              'Applications and Use Cases',
              'ML Workflow'
            ],
            'Mathematics': [
              'Linear Algebra',
              'Statistics',
              'Probability',
              'Calculus for ML'
            ]
          }
        }
      ]
    }
  }
};

export default function CoursePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [activeModule, setActiveModule] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  
  // Try to get course from predefined data, otherwise generate it
  let course = courseData[slug];
  
  if (!course) {
    // Generate course data from slug
    const courseTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Determine category based on common patterns
    let category = 'CSE / IT DOMAINS';
    if (['finance', 'investment', 'marketing', 'hrm', 'management', 'sales', 'commerce'].some(keyword => slug.includes(keyword))) {
      category = 'MANAGEMENT & COMMERCE';
    } else if (['embedded', 'vlsi', 'iot', 'robotics', 'power'].some(keyword => slug.includes(keyword))) {
      category = 'ECE DOMAINS';
    } else if (['economics', 'financial'].some(keyword => slug.includes(keyword))) {
      category = 'ECONOMICS';
    } else if (['autocad', 'catia', 'design', 'mechanical'].some(keyword => slug.includes(keyword))) {
      category = 'MECHANICAL ENGINEERING';
    } else if (['bio', 'bioinformatics', 'microbiology', 'molecular', 'genetic', 'pharma', 'nano', 'food', 'nutrition', 'medical'].some(keyword => slug.includes(keyword))) {
      category = 'BIO & LIFE SCIENCES';
    } else if (['civil', 'construction'].some(keyword => slug.includes(keyword))) {
      category = 'CIVIL ENGINEERING';
    }
    
    course = generateCourseData(courseTitle, category);
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span>›</span>
            <Link href="/#programs" className="hover:text-orange-600">{course.category}</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">{course.title} Course</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">iHub</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">iHub DivyaSampark</div>
                  <div className="text-xs text-gray-600">IIT Roorkee</div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title} Course</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                <span className="text-sm text-gray-500">({course.totalRatings} Ratings)</span>
              </div>

              {/* Highlights */}
              <div className="space-y-3 mb-8">
                {course.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Partner */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">In Collaboration With</p>
                <img src={course.partnerLogo} alt={course.partner} className="h-8" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk to Advisor</span>
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`/brochures/${encodeURIComponent(getBrochureFilename(slug, course.title))}`}
                  download={getBrochureFilename(slug, course.title)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Brochure</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPricingOpen(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Enroll now</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Video */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </motion.button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  Course Introduction
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {course.curriculum.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
                <h3 className="font-bold text-gray-800 mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {course.curriculum.modules.map((module: any, index: number) => (
                    <motion.div
                      key={module.id}
                      onClick={() => setActiveModule(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        index === activeModule 
                          ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md' 
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="font-semibold text-sm text-gray-800">Module {module.id}</div>
                      <div className="text-xs text-gray-600">{module.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {course.curriculum.modules[activeModule].id}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{course.curriculum.modules[activeModule].title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{course.curriculum.modules[activeModule].description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">TOPICS COVERED:</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(course.curriculum.modules[activeModule].topics).map(([category, topics]: [string, any]) => (
                    <div key={category}>
                      <h5 className="font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                        {category}
                      </h5>
                      <ul className="space-y-2">
                        {topics.map((topic: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* Mentor-Led Programs Section */}
      <section className="py-16 bg-[#f5f0eb]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0"
              style={{
                background: 'radial-gradient(circle at 38% 32%, #ffd97a 0%, #f90 45%, #e07000 100%)',
                boxShadow: '0 2px 8px rgba(255,153,0,0.4)',
              }}
            >
              <div className="absolute top-1 left-1.5 w-4 h-2 bg-white/30 rounded-full blur-[1px]" />
              <span className="relative z-10 font-extrabold text-[12px] leading-none" style={{ color: '#5a1a00' }}>
                ady.
              </span>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-2xl mb-12"
            style={{ background: '#1a1a2e' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Text Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-5xl font-bold mb-2" style={{ color: '#f90' }}>
                  Mentor-Led<br />Programs
                </h2>
                <p className="text-white text-lg mb-4">Upskill Through Experience</p>
                <p className="text-gray-300 text-sm">Our mentor-led programs help you:</p>
              </div>

              {/* Right Side - Video Background */}
              <div className="relative h-64 lg:h-auto min-h-80 overflow-hidden">
                {/* Background Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to image if video fails to load
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                    const fallbackImg = target.nextElementSibling as HTMLImageElement;
                    if (fallbackImg) fallbackImg.style.display = 'block';
                  }}
                >
                  {/* Using a professional learning/mentorship video */}
                  <source
                    src="https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4"
                    type="video/mp4"
                  />
                </video>
                
                {/* Fallback image */}
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0"
                  alt="Mentor-led programs"
                  className="w-full h-full object-cover"
                  style={{ display: 'none' }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Three Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Point 01 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-800">01.</span>
                <div className="h-1 w-12" style={{ background: '#f90' }}></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Upskill through <span className="font-bold">virtual internships and real projects</span> from real companies.
              </p>
            </motion.div>

            {/* Point 02 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-800">02.</span>
                <div className="h-1 w-12" style={{ background: '#f90' }}></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Apply your skills in practical, industry-like settings wit
              </p>
            </motion.div>

            {/* Point 03 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-800">03.</span>
                <div className="h-1 w-12" style={{ background: '#f90' }}></div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Build confidence, connections, and a <span className="font-bold">job-ready portfolio</span>
              </p>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-start space-x-4"
          >
            <span className="text-4xl" style={{ color: '#f90' }}>❝</span>
            <p className="text-gray-700 italic text-lg leading-relaxed">
              Every project you work on shapes the professional you become.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">{course.duration}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">Live</div>
              <div className="text-sm text-gray-600">Interactive Sessions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">Certificate</div>
              <div className="text-sm text-gray-600">Industry Recognized</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-800">100%</div>
              <div className="text-sm text-gray-600">Placement Support</div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Instructors Section */}
      <section className="py-16 bg-[#f5f0eb]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Learn from Senior {course.title} Experts
            </h2>
            <p className="text-gray-600">
              and Industry Experts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {generateInstructors(course.title).map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Experience Badge */}
                <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {instructor.experience}
                  </div>
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">{instructor.name}</h3>
                    {instructor.linkedIn && (
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{instructor.role}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-gray-700">@{instructor.company.toLowerCase()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}