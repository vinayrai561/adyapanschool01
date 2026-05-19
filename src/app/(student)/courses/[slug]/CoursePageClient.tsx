'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Download, Play, Star, CheckCircle, ChevronDown, ChevronUp,
  Users, Clock, Award, BookOpen, Briefcase, TrendingUp,
  Phone, Mail, MessageCircle, X,
} from 'lucide-react';
import { getThumbnail } from '@/lib/courseData';
import PricingModal from '@/components/PricingModal';

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

function seededHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h) / 2147483647;
}

const generateCourseData = (title: string, category: string) => ({
  title,
  category,
  duration: '2-3 Months',
  rating: parseFloat((4.7 + seededHash(title) * 0.3).toFixed(1)),
  totalRatings: (Math.floor(seededHash(title + 'r') * 10000 + 5000)).toLocaleString(),
  image: getThumbnail(title),
  description: `Master ${title}: Comprehensive curriculum with live projects and industry experts`,
  highlights: [
    'Live online interactive sessions from Adyapan faculty & top industry experts',
    'Guaranteed placement support with our career services for freshers and professionals',
    `Earn prestigious ${title} certification`,
    'Work on real projects and build industry-ready portfolio'
  ],
  curriculum: {
    title: `Advanced ${title} Curriculum To Help You Master Industry Skills`,
    modules: [
      {
        id: 1,
        title: `${title} Fundamentals`,
        description: `Introduction to ${title} concepts and core principles`,
        topics: {
          'Basics': [`What is ${title}`, 'Key Concepts', 'Applications', 'Industry Use Cases'],
          'Foundations': ['Core Principles', 'Best Practices', 'Tools & Technologies', 'Getting Started']
        }
      },
      {
        id: 2,
        title: `${title} Advanced Topics`,
        description: `Advanced concepts and real-world applications of ${title}.`,
        topics: {
          'Advanced Concepts': ['Complex Scenarios & Problem Solving', 'Optimization Techniques', 'Scalability & Architecture', 'Security & Best Practices'],
          'Practical Applications': ['Real-world Project Implementation', 'Case Studies', 'Enterprise Solutions', 'Performance Optimization']
        }
      },
      {
        id: 3,
        title: `${title} Projects & Deployment`,
        description: `Hands-on project development and deployment of ${title} solutions.`,
        topics: {
          'Project Development': ['Project Planning', 'System Design', 'Implementation', 'Testing & QA'],
          'Deployment': ['CI/CD Pipelines', 'Production Setup', 'Monitoring', 'Scaling']
        }
      }
    ]
  }
});

const courseData: Record<string, any> = {
  'artificial-intelligence': {
    title: 'Artificial Intelligence',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.8,
    totalRatings: '12,450',
    image: getThumbnail('Artificial Intelligence'),
    description: 'Master AI fundamentals: Machine Learning, Deep Learning, Neural Networks & more',
    highlights: [
      'Live online interactive sessions from Adyapan faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Work on real AI projects and build industry-ready portfolio'
    ],
    curriculum: {
      title: 'Advanced AI Curriculum To Help You Master Machine Learning, Deep Learning & Neural Networks',
      modules: [
        { id: 1, title: 'AI Fundamentals', description: 'Introduction to AI, History, Applications', topics: { 'Python for AI': ['Python Basics', 'NumPy and Pandas', 'Data Manipulation', 'Visualization'], 'Mathematics for AI': ['Linear Algebra', 'Statistics', 'Calculus', 'Optimization'] } },
        { id: 2, title: 'Machine Learning', description: 'Supervised and Unsupervised Learning', topics: { 'Supervised Learning': ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM'], 'Unsupervised Learning': ['K-Means', 'Hierarchical Clustering', 'PCA', 'Association Rules'] } },
        { id: 3, title: 'Deep Learning', description: 'Neural Networks and Deep Learning Frameworks', topics: { 'Neural Networks': ['Perceptron', 'MLP', 'Backpropagation', 'Activation Functions'], 'Deep Learning': ['CNN', 'RNN', 'LSTM', 'Transfer Learning'] } },
        { id: 4, title: 'NLP', description: 'Text Processing and Language Understanding', topics: { 'NLP Basics': ['Text Preprocessing', 'Tokenization', 'Stemming', 'NER'], 'Advanced NLP': ['Sentiment Analysis', 'Text Classification', 'Language Models', 'Transformers'] } },
        { id: 5, title: 'Computer Vision', description: 'Image Processing and CV Applications', topics: { 'Image Processing': ['Image Fundamentals', 'Filtering', 'Feature Detection', 'Object Recognition'], 'Advanced Vision': ['Face Recognition', 'Object Detection', 'Segmentation', 'GANs'] } },
        { id: 6, title: 'AI Project & Deployment', description: 'Real-world AI Projects and Deployment', topics: { 'Project Development': ['Problem Definition', 'Data Collection', 'Model Training', 'Evaluation'], 'Deployment': ['Model Optimization', 'Cloud Deployment', 'API Development', 'Monitoring'] } }
      ]
    }
  },
  'data-science': {
    title: 'Data Science',
    category: 'CSE / IT DOMAINS',
    duration: '2-3 Months',
    rating: 4.7,
    totalRatings: '15,796',
    image: getThumbnail('Data Science'),
    description: 'Master Data Science courses: Python, SQL, ML, Power BI, NLP, Gen AI, & more',
    highlights: [
      'Live online interactive sessions from IIT faculty & top industry experts',
      'Guaranteed placement support with our career services for freshers and professionals',
      'Earn prestigious data science certification',
      'Work on real data science projects with industry datasets'
    ],
    curriculum: {
      title: 'Advanced Data Science Curriculum',
      modules: [
        { id: 1, title: 'Programming', description: 'Python and SQL fundamentals', topics: { 'SQL': ['Intro to SQL', 'Joins', 'Aggregation', 'CTEs', 'Window Functions'], 'Python': ['Python Refresher', 'OOP', 'NumPy', 'Pandas', 'Visualization'] } },
        { id: 2, title: 'Data Engineering Fundamentals', description: 'ETL and data pipelines', topics: { 'ETL': ['Extract Transform Load', 'Pipeline Design', 'Data Quality'], 'Big Data': ['Distributed Computing', 'MapReduce', 'Hadoop', 'Spark'] } },
        { id: 3, title: 'Machine Learning', description: 'ML algorithms and model building', topics: { 'Supervised': ['Regression', 'Classification', 'Ensemble Methods'], 'Unsupervised': ['Clustering', 'Dimensionality Reduction'] } },
        { id: 4, title: 'Cloud Technologies', description: 'Cloud-based data solutions', topics: { 'AWS': ['S3', 'EMR', 'Redshift', 'Lambda'], 'Data Warehousing': ['Dimensional Modeling', 'Star Schema', 'Performance'] } },
        { id: 5, title: 'DSA for Data', description: 'Data structures for data engineering', topics: { 'Data Structures': ['Arrays', 'Hash Tables', 'Trees', 'Graphs'], 'Algorithms': ['Sorting', 'Search', 'Graph Algorithms'] } },
        { id: 6, title: 'ML in Production', description: 'MLOps and model deployment', topics: { 'MLOps': ['Model Deployment', 'Monitoring', 'A/B Testing', 'Versioning'], 'Real-time ML': ['Streaming ML', 'Feature Stores', 'Model Serving'] } }
      ]
    }
  },
};

export default function CoursePageClient() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [activeModule, setActiveModule] = useState(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [brochureLoading, setBrochureLoading] = useState(false);
  const [brochureError, setBrochureError] = useState('');

  let course = courseData[slug];

  if (!course) {
    const courseTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    let category = 'CSE / IT DOMAINS';
    if (['finance', 'investment', 'marketing', 'hrm', 'management', 'sales', 'commerce'].some(k => slug.includes(k))) category = 'MANAGEMENT & COMMERCE';
    else if (['embedded', 'vlsi', 'iot', 'robotics', 'power'].some(k => slug.includes(k))) category = 'ECE DOMAINS';
    else if (['economics', 'financial'].some(k => slug.includes(k))) category = 'ECONOMICS';
    else if (['autocad', 'catia', 'design', 'mechanical'].some(k => slug.includes(k))) category = 'MECHANICAL ENGINEERING';
    else if (['bio', 'bioinformatics', 'microbiology', 'molecular', 'genetic', 'pharma', 'nano', 'food', 'nutrition', 'medical'].some(k => slug.includes(k))) category = 'BIO & LIFE SCIENCES';
    else if (['civil', 'construction'].some(k => slug.includes(k))) category = 'CIVIL ENGINEERING';
    course = generateCourseData(courseTitle, category);
  }

  const instructors = generateInstructors(course.title);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/programs" className="hover:text-orange-600">{course.category}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-gray-800 font-medium">{course.title} Course</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title} Course</h1>
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                <span className="text-sm text-gray-500">({course.totalRatings} Ratings)</span>
              </div>
              <div className="space-y-3 mb-8">
                {course.highlights.filter(Boolean).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: brochureLoading ? 1 : 1.05 }}
                    whileTap={{ scale: brochureLoading ? 1 : 0.95 }}
                    disabled={brochureLoading}
                    onClick={async () => {
                      setBrochureError('');
                      setBrochureLoading(true);
                      try {
                        const res = await fetch(`/api/courses/brochure?title=${encodeURIComponent(course.title)}`);
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          setBrochureError(data.error || 'Brochure not available for this course.');
                          return;
                        }
                        const blob = await res.blob();
                        const disposition = res.headers.get('Content-Disposition') || '';
                        const match = disposition.match(/filename="(.+?)"/);
                        const filename = match ? match[1] : `${course.title} Brochure.pdf`;
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = filename;
                        document.body.appendChild(a); a.click(); a.remove();
                        URL.revokeObjectURL(url);
                      } catch { setBrochureError('Something went wrong. Please try again.'); }
                      finally { setBrochureLoading(false); }
                    }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${brochureLoading ? 'bg-orange-100 text-orange-400 cursor-not-allowed border border-orange-200' : 'bg-gradient-to-r from-[#ffa800] to-[#ff6b00] text-white shadow-md hover:shadow-orange-300'}`}
                  >
                    {brochureLoading ? (
                      <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg><span>Downloading...</span></>
                    ) : (
                      <><Download className="w-4 h-4" /><span>Download Brochure</span></>
                    )}
                  </motion.button>
                  {brochureError && <p className="text-xs text-red-500 mt-1.5 text-center">{brochureError}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPricingOpen(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Enroll now</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={course.image} alt={`${course.title} course`}
                  className="w-full h-80 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/course-thumbnails/CS Final.png'; }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg" aria-label="Play course introduction">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </motion.button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">Course Introduction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Students Enrolled', value: '10,000+' },
              { icon: Clock, label: 'Course Duration', value: course.duration },
              { icon: Award, label: 'Placement Rate', value: '95%' },
              { icon: BookOpen, label: 'Live Sessions', value: '40+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-gray-50">
                <Icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-[#f5f0eb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{course.curriculum.title}</h2>
          <div className="space-y-4">
            {course.curriculum.modules.map((module: any, index: number) => (
              <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <button
                  onClick={() => setActiveModule(activeModule === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={activeModule === index}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                    </div>
                  </div>
                  {activeModule === index ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {activeModule === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-gray-100">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(module.topics).map(([topicTitle, items]) => (
                          <div key={topicTitle}>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">{topicTitle}</h4>
                            <ul className="space-y-2">
                              {(items as string[]).map((item, i) => (
                                <li key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Learn from Industry Experts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {instructors.slice(0, 8).map((instructor) => (
              <div key={instructor.id} className="text-center p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-orange-600">{instructor.name.charAt(0)}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{instructor.name}</p>
                <p className="text-xs text-gray-500 mt-1">{instructor.role}</p>
                <p className="text-xs text-orange-500 mt-1">{instructor.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isPricingOpen && <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />}
    </div>
  );
}
