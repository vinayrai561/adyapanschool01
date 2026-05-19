'use client';

import { useState } from 'react';
import { Award, Download, Share2, Eye, EyeOff, CheckCircle, TrendingUp, Users, Briefcase, Clock, MapPin } from 'lucide-react';

const skillsData = [
  { id: 1, name: 'React', level: 85, category: 'Frontend', lastUpdated: '2024-01-15' },
  { id: 2, name: 'Node.js', level: 78, category: 'Backend', lastUpdated: '2024-01-10' },
  { id: 3, name: 'Python', level: 92, category: 'Data Science', lastUpdated: '2024-01-12' },
  { id: 4, name: 'UI/UX Design', level: 65, category: 'Design', lastUpdated: '2023-12-20' },
  { id: 5, name: 'AWS', level: 72, category: 'Cloud', lastUpdated: '2023-12-15' },
  { id: 6, name: 'Communication', level: 88, category: 'Soft Skills', lastUpdated: '2024-01-05' },
];

const credentialsData = [
  { id: 1, title: 'Full Stack Web Development', issuer: 'Adyapan', type: 'Course Completion', date: '2024-01-10', verified: true },
  { id: 2, title: 'Data Analysis with Python', issuer: 'Adyapan', type: 'Micro-Credential', date: '2023-12-15', verified: true },
  { id: 3, title: 'AWS Cloud Practitioner', issuer: 'Amazon', type: 'Certification', date: '2023-11-20', verified: true },
  { id: 4, title: 'E-commerce Platform', issuer: 'TechCorp', type: 'Project Completion', date: '2023-12-05', verified: true },
  { id: 5, title: 'Social Media Campaign', issuer: 'MarketingPro', type: 'Project Completion', date: '2023-11-10', verified: true },
];

const projectsData = [
  { id: 1, title: 'E-commerce Website', company: 'TechCorp', skills: ['React', 'Node.js', 'MongoDB'], status: 'Completed', rating: 4.8 },
  { id: 2, title: 'Data Dashboard', company: 'Analytics Inc', skills: ['Python', 'Pandas', 'Plotly'], status: 'Completed', rating: 4.9 },
  { id: 3, title: 'Mobile App UI', company: 'DesignStudio', skills: ['Figma', 'UI/UX'], status: 'In Progress', rating: null },
];

export default function PassportPage() {
  const [isPublic, setIsPublic] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'credentials' | 'projects'>('skills');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Skills Passport',
        text: 'Check out my verified skills and project portfolio',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    alert('PDF download feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Passport Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Passport</h1>
              <p className="text-gray-600">Your verified skills, credentials, and project portfolio</p>
            </div>
            
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  isPublic
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {isPublic ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {isPublic ? 'Public' : 'Private'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl font-bold">JD</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
                  <p className="text-gray-600">Full Stack Developer</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Bangalore, India</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Open to opportunities</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">Overall Score</h3>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">82%</div>
              <div className="text-sm text-gray-600">Advanced Level</div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Progress</span>
                  <span>82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-bold text-gray-900">Career Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-600">Credentials</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">6</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'skills', label: 'Skills', count: skillsData.length },
                { id: 'credentials', label: 'Credentials', count: credentialsData.length },
                { id: 'projects', label: 'Projects', count: projectsData.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skills Assessment</h2>
                  <div className="text-sm text-gray-500">Last updated: Today</div>
                </div>
                
                <div className="space-y-6">
                  {skillsData.map((skill) => (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{skill.name}</h3>
                          <div className="text-sm text-gray-500">{skill.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">{skill.level}%</div>
                          <div className="text-xs text-gray-500">Updated {skill.lastUpdated}</div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Proficiency</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              skill.level >= 80 ? 'bg-green-500' :
                              skill.level >= 60 ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Level: {
                          skill.level >= 80 ? 'Advanced' :
                          skill.level >= 60 ? 'Intermediate' :
                          skill.level >= 40 ? 'Beginner' : 'Novice'
                        }</span>
                        <button className="text-primary-600 hover:text-primary-700">
                          View details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'credentials' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Credentials & Certifications</h2>
                  <div className="text-sm text-primary-600">All blockchain-verified</div>
                </div>
                
                <div className="space-y-4">
                  {credentialsData.map((credential) => (
                    <div key={credential.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            credential.verified 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Award className="w-6 h-6" />
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">{credential.title}</h3>
                              <div className="text-sm text-gray-600">Issued by {credential.issuer}</div>
                            </div>
                            {credential.verified && (
                              <div className="flex items-center text-sm text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verified
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <div className="mr-4">
                              <span className="font-medium">Type:</span> {credential.type}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {credential.date}
                            </div>
                          </div>
                          
                          <div className="mt-3 flex space-x-2">
                            <button className="text-sm text-primary-600 hover:text-primary-700">
                              View Credential
                            </button>
                            <button className="text-sm text-primary-600 hover:text-primary-700">
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Project Portfolio</h2>
                  <div className="text-sm text-gray-500">Real-world experience</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectsData.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{project.title}</h3>
                          <div className="text-sm text-gray-600">{project.company}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Skills used:</div>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {project.rating ? (
                          <div className="flex items-center">
                            <div className="text-yellow-500 mr-1">★</div>
                            <span className="font-medium">{project.rating}</span>
                            <span className="text-gray-500 text-sm ml-1">rating</span>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No rating yet</div>
                        )}
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Skills Assessment</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Credentials</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Projects</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Identity</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-2">Blockchain Verification</div>
                <div className="text-xs text-gray-600">
                  All credentials are stored on blockchain for tamper-proof verification
                </div>
              </div>
            </div>

            {/* Career Insights */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">Career Insights</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-90">Match Score</div>
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm opacity-90">With Full Stack Developer roles</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Avg Salary</div>
                  <div className="text-2xl font-bold">₹8.5L</div>
                  <div className="text-sm opacity-90">For your skill level</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Demand</div>
                  <div className="text-2xl font-bold">High</div>
                  <div className="text-sm opacity-90">In current market</div>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                View Job Matches
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Add New Skill</div>
                  <div className="text-sm text-gray-500">Take assessment for new skills</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Share Passport</div>
                  <div className="text-sm text-gray-500">Share with recruiters</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Update Profile</div>
                  <div className="text-sm text-gray-500">Add experience & education</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}