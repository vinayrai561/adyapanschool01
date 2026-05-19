'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Award, Clock, Users, CheckCircle, Star } from 'lucide-react';

// Certification data - same as in navbar
const certificationCompanies = [
  {
    id: 1,
    name: 'Adobe',
    logo: '/logos/Adobe_Corporate_wordmark.svg.png',
    certifications: [
      'Adobe Certified Professional - Photoshop',
      'Adobe Certified Professional - Illustrator',
      'Adobe Certified Professional - InDesign',
      'Adobe Certified Professional - After Effects',
      'Adobe Certified Professional - Premiere Pro',
      'Adobe Certified Professional - Animate',
      'Adobe Certified Professional - Dreamweaver'
    ]
  },
  {
    id: 2,
    name: 'Apple',
    logo: '/logos/applelogo.jpg',
    certifications: [
      'App Development with Swift - Certified User',
      'App Development with Swift - Associate'
    ]
  },
  {
    id: 3,
    name: 'Autodesk',
    logo: '/logos/autodesklogo.jpg',
    certifications: [
      'Autodesk Certified User - AutoCAD',
      'Autodesk Certified User - Fusion 360',
      'Autodesk Certified User - Inventor',
      'Autodesk Certified User - Revit Architecture',
      'Autodesk Certified User - 3ds Max',
      'Autodesk Certified User - Maya',
      'Autodesk Certified User - Tinkercad 3D Design'
    ]
  },
  {
    id: 4,
    name: 'Cisco',
    logo: '/logos/ciscologo.jpg',
    certifications: [
      'Cisco Certified Support Technician - Networking',
      'Cisco Certified Support Technician - Cybersecurity'
    ]
  },
  {
    id: 5,
    name: 'Communication Skills for Business',
    logo: '/logos/communicationskillsforbusinesslogo.png',
    certifications: [
      'CSB - Professional Communication',
      'CSB - English for IT'
    ]
  },
  {
    id: 6,
    name: 'ESB',
    logo: '/logos/project-management-institutelol.svg',
    certifications: [
      'ESB v.2'
    ]
  },
  {
    id: 7,
    name: 'IC3 Digital Literacy',
    logo: '/logos/IC3logo.webp',
    certifications: [
      'IC3 Digital Literacy - Global Standard 6',
      'IC3 Digital Literacy - Global Standard 5',
      'IC3 - Spark',
      'IC3 - Fast Track',
      'PHP Developer Fundamentals'
    ]
  },
  {
    id: 8,
    name: 'Information Technology Specialist',
    logo: '/logos/informationtechnologyspecialist.png',
    certifications: [
      'Artificial Intelligence',
      'Cloud Computing',
      'Computational Thinking',
      'Cybersecurity',
      'Data Analytics',
      'Databases',
      'Device Configuration and Management',
      'HTML and CSS',
      'HTML5 Application Development',
      'Java',
      'JavaScript',
      'Networking',
      'Network Security',
      'Python',
      'Software Development'
    ]
  },
  {
    id: 9,
    name: 'Intuit',
    logo: '/logos/intuit-logo-chief-executive-management-idlogo.jpg',
    certifications: [
      'Intuit - QuickBooks Certified User Online',
      'Intuit - Design for Delight Innovator',
      'Intuit - Certified Bookkeeping Professional'
    ]
  },
  {
    id: 10,
    name: 'Microsoft Certified Fundamentals',
    logo: '/logos/microsoftcertifiedfundamentalslogo.png',
    certifications: [
      'Microsoft Azure Fundamentals (AZ-900)',
      'Microsoft 365 Fundamentals (MS-900)',
      'Microsoft Azure AI Fundamentals (AI-900)',
      'Microsoft Azure Data Fundamentals (DP-900)',
      'Microsoft Power Platform Fundamentals (PL-900)',
      'Microsoft Dynamics 365 Fundamentals CRM (MB-910)',
      'Microsoft Dynamics 365 Fundamentals ERP (MB-920)',
      'Microsoft Security, Compliance, and Identity Fundamentals (SC-900)'
    ]
  },
  {
    id: 11,
    name: 'Microsoft Office Specialist',
    logo: '/logos/microsoft-office-specialist-microsoft-officelogo.png',
    certifications: [
      'MOS - Word',
      'MOS - Excel',
      'MOS - PowerPoint',
      'MOS - Word Expert',
      'MOS - Excel Expert'
    ]
  },
  {
    id: 12,
    name: 'Microsoft Certified Educator',
    logo: '/logos/MicrosoftCertifiedEducator_Logo.jpg',
    certifications: [
      'Technology Literacy for Educators (62-193)'
    ]
  },
  {
    id: 13,
    name: 'PMI Project Management Institute',
    logo: '/logos/project-management-institutelol.svg',
    certifications: [
      'PMI - Project Management Ready™'
    ]
  },
  {
    id: 14,
    name: 'Unity',
    logo: '/logos/unitylogo.png',
    certifications: [
      'Unity Certified User: Programmer',
      'Unity Certified User: VR Developer',
      'Unity Certified User: Artist'
    ]
  },
  {
    id: 15,
    name: 'Meta',
    logo: '/logos/Meta-Logo.png',
    certifications: [
      'Meta Certified: Digital Marketing Associate'
    ]
  },
  {
    id: 16,
    name: 'Critical Career Skills',
    logo: '/logos/criticalcareerskillsLOGO.webp',
    certifications: [
      'CCS Generative AI Foundations'
    ]
  }
];

// Function to get certificate image path based on certification name
const getCertificateImage = (certificationName: string, companyName: string) => {
  // Create a mapping of certification names to image file names
  const certificateImageMap: { [key: string]: string } = {
    // Adobe Certificates
    'Adobe Certified Professional - Photoshop': 'Adobe Photoshop.png',
    'Adobe Certified Professional - Illustrator': 'Adobe Illustrator.png',
    'Adobe Certified Professional - InDesign': 'Adobe InDesign.png',
    'Adobe Certified Professional - After Effects': 'Adobe After Effects.png',
    'Adobe Certified Professional - Premiere Pro': 'Adobe Premiere Pro.png',
    'Adobe Certified Professional - Animate': 'Adobe Animate.png',
    'Adobe Certified Professional - Dreamweaver': 'Adobe Dreamweaver.png',
    
    // Apple Certificates
    'App Development with Swift - Certified User': 'App Development with Swift Certified User.png',
    'App Development with Swift - Associate': 'App Development with Swift Associate.png',
    
    // Autodesk Certificates
    'Autodesk Certified User - AutoCAD': 'Autodesk AutoCAD.png',
    'Autodesk Certified User - Fusion 360': 'Autodesk Fusion360.png',
    'Autodesk Certified User - Inventor': 'Autodesk Inventor.png',
    'Autodesk Certified User - Revit Architecture': 'Autodesk Revit.png',
    'Autodesk Certified User - 3ds Max': 'Autodesk 3ds Max.png',
    'Autodesk Certified User - Maya': 'Autodesk Maya.png',
    
    // Cisco Certificates
    'Cisco Certified Support Technician - Networking': 'Cisco Networking.png',
    'Cisco Certified Support Technician - Cybersecurity': 'Cisco Cybersecurity.png',
    
    // Communication Skills for Business
    'CSB - Professional Communication': 'CSB Professional Communication.png',
    'CSB - English for IT': 'CSB English for IT.png',
    
    // IC3 Digital Literacy
    'IC3 Digital Literacy - Global Standard 6': 'IC3 Digital Literacy.png',
    'IC3 Digital Literacy - Global Standard 5': 'IC3 Digital Literacy.png',
    'IC3 - Spark': 'IC3 Digital Literacy.png',
    'IC3 - Fast Track': 'IC3 Digital Literacy.png',
    
    // Information Technology Specialist
    'Artificial Intelligence': 'ITS Certificate.png',
    'Cloud Computing': 'ITS Certificate.png',
    'Computational Thinking': 'ITS Certificate.png',
    'Cybersecurity': 'ITS Certificate.png',
    'Data Analytics': 'ITS Certificate.png',
    'Databases': 'ITS Certificate.png',
    'Device Configuration and Management': 'ITS Certificate.png',
    'HTML and CSS': 'ITS Certificate.png',
    'HTML5 Application Development': 'ITS Certificate.png',
    'Java': 'ITS Certificate.png',
    'JavaScript': 'ITS Certificate.png',
    'Networking': 'ITS Certificate.png',
    'Network Security': 'ITS Certificate.png',
    'Python': 'ITS Certificate.png',
    'Software Development': 'ITS Certificate.png',
    
    // Intuit
    'Intuit - QuickBooks Certified User Online': 'Intuit QuickBooks Certified User.png',
    
    // Microsoft Certified Fundamentals
    'Microsoft Azure Fundamentals (AZ-900)': 'MCF Certificate.png',
    'Microsoft 365 Fundamentals (MS-900)': 'MCF Certificate.png',
    'Microsoft Azure AI Fundamentals (AI-900)': 'MCF Certificate.png',
    'Microsoft Azure Data Fundamentals (DP-900)': 'MCF Certificate.png',
    'Microsoft Power Platform Fundamentals (PL-900)': 'MCF Certificate.png',
    'Microsoft Dynamics 365 Fundamentals CRM (MB-910)': 'MCF Certificate.png',
    'Microsoft Dynamics 365 Fundamentals ERP (MB-920)': 'MCF Certificate.png',
    'Microsoft Security, Compliance, and Identity Fundamentals (SC-900)': 'MCF Certificate.png',
    
    // Microsoft Office Specialist
    'MOS - Word': 'MOS Word Associate.png',
    'MOS - Excel': 'MOS Excel Associate.png',
    'MOS - PowerPoint': 'MOS PowerPoint Associate.png',
    'MOS - Word Expert': 'MOS Word Expert.png',
    'MOS - Excel Expert': 'MOS Excel Expert.png',
    
    // Microsoft Certified Educator
    'Technology Literacy for Educators (62-193)': 'MCE.png',
    
    // PMI
    'PMI - Project Management Ready™': 'PMI.png',
    
    // Unity
    'Unity Certified User: Programmer': 'Unity Programmer.png',
    'Unity Certified User: VR Developer': 'Unity VR.png',
    'Unity Certified User: Artist': 'Unity Artist.png',
    
    // Meta
    'Meta Certified: Digital Marketing Associate': 'Meta.png',
  };

  // Return the mapped image or a default one
  return certificateImageMap[certificationName] || 'ITS Certificate.png';
};

// Function to get brochure PDF path based on certification name
const getBrochurePath = (certificationName: string, companyName: string) => {
  // Create a mapping of certification names to brochure file names
  const brochureMap: { [key: string]: string } = {
    // Adobe Certificates
    'Adobe Certified Professional - Photoshop': 'Adobe Photoshop.pdf',
    'Adobe Certified Professional - Illustrator': 'Adobe Illustrator.pdf',
    'Adobe Certified Professional - InDesign': 'Adobe InDesign.pdf',
    'Adobe Certified Professional - After Effects': 'Adobe After Effects.pdf',
    'Adobe Certified Professional - Premiere Pro': 'Adobe Premiere Pro.pdf',
    'Adobe Certified Professional - Animate': 'Adobe Animate.pdf',
    'Adobe Certified Professional - Dreamweaver': 'Adobe Dreamweaver.pdf',
    
    // Apple Certificates
    'App Development with Swift - Certified User': 'App Development with Swift Certified User.pdf',
    'App Development with Swift - Associate': 'App Development with Swift Associate.pdf',
    
    // Autodesk Certificates
    'Autodesk Certified User - AutoCAD': 'Autodesk AutoCAD.pdf',
    'Autodesk Certified User - Fusion 360': 'Autodesk Fusion360.pdf',
    'Autodesk Certified User - Inventor': 'Autodesk Inventor.pdf',
    'Autodesk Certified User - Revit Architecture': 'Autodesk Revit.pdf',
    'Autodesk Certified User - 3ds Max': 'Autodesk 3ds Max.pdf',
    'Autodesk Certified User - Maya': 'Autodesk Maya.pdf',
    'Autodesk Certified User - Tinkercad 3D Design': 'Autodesk AutoCAD.pdf', // Using AutoCAD as fallback
    
    // Cisco Certificates
    'Cisco Certified Support Technician - Networking': 'Cisco Networking.pdf',
    'Cisco Certified Support Technician - Cybersecurity': 'Cisco Cybersecurity.pdf',
    
    // Communication Skills for Business
    'CSB - Professional Communication': 'CSB Professional Communication.pdf',
    'CSB - English for IT': 'CSB English for IT.pdf',
    
    // ESB
    'ESB v.2': 'Artificial Intelligence.pdf', // Using AI as fallback
    
    // IC3 Digital Literacy
    'IC3 Digital Literacy - Global Standard 6': 'IC3 Digital Literacy.pdf',
    'IC3 Digital Literacy - Global Standard 5': 'IC3 Digital Literacy.pdf',
    'IC3 - Spark': 'IC3 Digital Literacy.pdf',
    'IC3 - Fast Track': 'IC3 Digital Literacy.pdf',
    'PHP Developer Fundamentals': 'ITS Software Development.pdf',
    
    // Information Technology Specialist
    'Artificial Intelligence': 'ITS AI.pdf',
    'Cloud Computing': 'ITS Cloud Computing.pdf',
    'Computational Thinking': 'ITS Computational Thinking.pdf',
    'Cybersecurity': 'ITS Cybersecurity.pdf',
    'Data Analytics': 'ITS Data Analytics.pdf',
    'Databases': 'ITS Databases.pdf',
    'Device Configuration and Management': 'ITS Devices.pdf',
    'HTML and CSS': 'ITS HTML and CSS.pdf',
    'HTML5 Application Development': 'ITS HTML App Development.pdf',
    'Java': 'ITS Java.pdf',
    'JavaScript': 'ITS Javascript.pdf',
    'Networking': 'ITS Networking.pdf',
    'Network Security': 'ITS Network Security.pdf',
    'Python': 'ITS Python.pdf',
    'Software Development': 'ITS Software Development.pdf',
    
    // Intuit
    'Intuit - QuickBooks Certified User Online': 'Intuit Quickbooks Certified User.pdf',
    'Intuit - Design for Delight Innovator': 'Intuit Quickbooks Certified User.pdf',
    'Intuit - Certified Bookkeeping Professional': 'Intuit Quickbooks Certified User.pdf',
    
    // Microsoft Certified Fundamentals
    'Microsoft Azure Fundamentals (AZ-900)': 'MCF Azure.pdf',
    'Microsoft 365 Fundamentals (MS-900)': 'MCF 365 Fundamentals.pdf',
    'Microsoft Azure AI Fundamentals (AI-900)': 'MCF Azure AI.pdf',
    'Microsoft Azure Data Fundamentals (DP-900)': 'MCF Azure Data.pdf',
    'Microsoft Power Platform Fundamentals (PL-900)': 'MCF Power Platform Fundamentals.pdf',
    'Microsoft Dynamics 365 Fundamentals CRM (MB-910)': 'MCF Dynamic 365 MB-910 Fundamentals.pdf',
    'Microsoft Dynamics 365 Fundamentals ERP (MB-920)': 'MCF Dynamic 365 MB-920 Fundamentals.pdf',
    'Microsoft Security, Compliance, and Identity Fundamentals (SC-900)': 'MCF Security Fundamentals.pdf',
    
    // Microsoft Office Specialist
    'MOS - Word': 'MOS Word Associate.pdf',
    'MOS - Excel': 'MOS Excel Associate.pdf',
    'MOS - PowerPoint': 'MOS Powerpoint Associate.pdf',
    'MOS - Word Expert': 'MOS Word Expert.pdf',
    'MOS - Excel Expert': 'MOS Excel Expert.pdf',
    
    // Microsoft Certified Educator
    'Technology Literacy for Educators (62-193)': 'MCE.pdf',
    
    // PMI
    'PMI - Project Management Ready™': 'PMI.pdf',
    
    // Unity
    'Unity Certified User: Programmer': 'Unity Programmer.pdf',
    'Unity Certified User: VR Developer': 'Unity VR Developer.pdf',
    'Unity Certified User: Artist': 'Unity Artist .pdf',
    
    // Meta
    'Meta Certified: Digital Marketing Associate': 'Meta.pdf',
    
    // Critical Career Skills
    'CCS Generative AI Foundations': 'Gen AI.pdf',
  };

  // Return the mapped brochure or a default one
  return brochureMap[certificationName] || 'Artificial Intelligence.pdf';
};

// Function to generate deterministic ID based on certification name
const generateCertificateId = (certificationName: string, companyName: string, length: number = 6) => {
  const combined = certificationName + companyName;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let num = Math.abs(hash);
  
  for (let i = 0; i < length; i++) {
    result += chars[num % chars.length];
    num = Math.floor(num / chars.length);
  }
  
  return result.padStart(length, '0');
};

// Function to generate dynamic content based on certification
const generateCertificationContent = (certification: string, companyName: string) => {
  const isAdobe = companyName === 'Adobe';
  const isMicrosoft = companyName.includes('Microsoft');
  const isUnity = companyName === 'Unity';
  const isMeta = companyName === 'Meta';
  const isApple = companyName === 'Apple';
  
  let acronym = '';
  let description = '';
  let pathwayText = '';
  
  if (isAdobe) {
    acronym = '(ACP)';
    description = `${certification} is the industry-recognized certification that demonstrates mastery of Adobe Creative Cloud software and must-have knowledge for digital media careers. Each exam is integrated with an Adobe application and designed by experts, allowing for an authentic assessment of job-ready skills.`;
    pathwayText = `Adyapan provides a full pathway solution that students can use to prepare for the ${certification}. From tailored learning materials and practice tests to Adobe endorsed certification exams, Adyapan provides assistance every step of the way.`;
  } else if (isMicrosoft) {
    acronym = companyName.includes('Fundamentals') ? '(MF)' : companyName.includes('Office') ? '(MOS)' : '(MCE)';
    description = `${certification} is the industry-recognized certification that validates your skills and knowledge in Microsoft technologies. This certification demonstrates your expertise and commitment to staying current with Microsoft's latest tools and platforms.`;
    pathwayText = `Adyapan provides comprehensive training and preparation for the ${certification}. Our expert instructors and hands-on approach ensure you're fully prepared for the Microsoft certification exam.`;
  } else if (isUnity) {
    acronym = '(UCU)';
    description = `${certification} is the industry-standard certification for Unity developers and creators. This certification validates your ability to create interactive experiences and demonstrates your proficiency with Unity's powerful development platform.`;
    pathwayText = `Adyapan offers specialized Unity training programs to prepare you for the ${certification}. Learn from industry experts and work on real projects to build your Unity skills.`;
  } else if (isMeta) {
    acronym = '(MDA)';
    description = `${certification} is the official certification from Meta that validates your digital marketing expertise. This certification demonstrates your ability to create effective marketing campaigns across Meta's family of platforms.`;
    pathwayText = `Adyapan provides comprehensive digital marketing training to prepare you for the ${certification}. Master the latest marketing strategies and tools used by industry professionals.`;
  } else if (isApple) {
    acronym = '(Swift)';
    description = `${certification} validates your skills in Swift programming and iOS app development. This certification demonstrates your ability to create innovative mobile applications using Apple's development tools and frameworks.`;
    pathwayText = `Adyapan offers comprehensive iOS development training to prepare you for the ${certification}. Learn Swift programming and iOS development from experienced instructors.`;
  } else {
    acronym = '';
    description = `${certification} is an industry-recognized certification that validates your professional skills and expertise. This certification demonstrates your commitment to excellence and helps advance your career in your chosen field.`;
    pathwayText = `Adyapan provides comprehensive training and preparation for the ${certification}. Our expert instructors and practical approach ensure you're fully prepared for success.`;
  }
  
  return { acronym, description, pathwayText };
};

export default function CertificationPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  
  // Find the certification and company based on slug
  const findCertificationBySlug = (slug: string) => {
    const normalizedSlug = slug.toLowerCase();
    
    for (const company of certificationCompanies) {
      for (const cert of company.certifications) {
        const certSlug = cert.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        if (certSlug === normalizedSlug) {
          return { certification: cert, company };
        }
      }
    }
    return null;
  };

  const result = findCertificationBySlug(slug);
  
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Certification Not Found</h1>
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { certification, company } = result;
  const { acronym, description, pathwayText } = generateCertificationContent(certification, company.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Professional Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            <span className="text-slate-400">›</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors font-medium">Certifications</span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-800 font-semibold">{certification}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Certifications</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-16">
          {/* Main Content - Full Width */}
          <div>
            {/* Professional Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              {/* Company Logo & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl border-2 border-slate-200 flex items-center justify-center p-2 sm:p-3 shadow-lg mx-auto sm:mx-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="text-sm font-bold text-slate-600 text-center">${company.name.substring(0, 3)}</div>`;
                      }
                    }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {company.name} Certification
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                      Industry Recognized
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">
                      Professional Level
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 mb-4 leading-tight text-center sm:text-left">
                {certification}
                {acronym && <span className="text-blue-600 ml-2">{acronym}</span>}
              </h1>
              
              {/* Rating & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 text-center sm:text-left">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">4.9 (3,247 reviews)</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 sm:space-x-6 text-xs sm:text-sm font-semibold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>12,450+ Enrolled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>2-3 Months</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span>95% Pass Rate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Professional Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Overview</h2>
                <div className="prose prose-lg prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-lg mb-6">
                    {description}
                  </p>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {pathwayText}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Professional Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Link
                  href="/enroll"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 sm:space-x-3 border-2 border-blue-600"
                >
                  <Award className="w-6 h-6" />
                  <span>Get Certificate</span>
                </Link>
              </motion.div>
              
              <motion.a
                href={`/brochures/${getBrochurePath(certification, company.name)}`}
                download={`${certification} - Syllabus.pdf`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-white border-2 border-slate-300 text-slate-700 px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:border-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Download className="w-5 h-5" />
                <span>Download Syllabus</span>
              </motion.a>
            </motion.div>

            {/* Professional Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-slate-200 mb-16"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">What You'll Get</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { icon: Award, text: 'Industry-recognized certification', color: 'text-blue-500' },
                  { icon: Users, text: 'Hands-on practical training', color: 'text-emerald-500' },
                  { icon: Star, text: 'Expert instructor guidance', color: 'text-amber-500' },
                  { icon: CheckCircle, text: 'Practice tests and assessments', color: 'text-purple-500' },
                  { icon: Clock, text: 'Career support and placement assistance', color: 'text-rose-500' },
                  { icon: Download, text: 'Lifetime access to course materials', color: 'text-indigo-500' }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`w-10 h-10 ${feature.color.replace('text-', 'bg-').replace('-500', '-100')} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-5 h-5 ${feature.color} flex-shrink-0`} />
                      </div>
                      <span className="text-slate-700 font-semibold text-base">{feature.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Professional Sample Certificate Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-slate-200"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-lg mb-4">
              <Award className="w-6 h-6" />
              <span>Sample Certificate</span>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Preview of the industry-recognized certificate you'll receive upon successful completion of the program
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* Professional Certificate Preview */}
            <div className="relative bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-slate-200 shadow-2xl overflow-hidden max-w-4xl w-full">
              {/* Certificate Image */}
              <div className="relative">
                <img
                  src={`/certificates/${getCertificateImage(certification, company.name)}`}
                  alt={`${certification} Sample Certificate`}
                  className="w-full h-auto rounded-2xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/certificates/ITS Certificate.png';
                  }}
                />
                
                {/* Professional Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-6xl md:text-8xl font-black text-slate-200 opacity-20 rotate-12 select-none">
                    SAMPLE
                  </div>
                </div>
                
                {/* Premium Corner Elements */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl opacity-70" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl opacity-70" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl opacity-70" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-blue-400 rounded-br-2xl opacity-70" />
                
                {/* Holographic Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/3 to-transparent pointer-events-none rounded-2xl" />
              </div>
              
              {/* Professional Certificate Info */}
              <div className="mt-8 text-center bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
                <div className="text-base font-semibold text-slate-700 mb-2">
                  Certificate ID: {company.name.substring(0, 3).toUpperCase()}-{generateCertificateId(certification, company.name, 12)}
                </div>
                <div className="text-sm text-slate-500">
                  Issued by <span className="font-semibold text-slate-700">{company.name}</span> • 
                  Verify at <span className="font-semibold text-blue-600">verify.{company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}