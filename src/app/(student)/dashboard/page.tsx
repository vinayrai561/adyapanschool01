'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Award, 
  Briefcase, 
  Users, 
  BookOpen,
  ChevronRight,
  BarChart3,
  Rocket,
  Star
} from 'lucide-react';

const upcomingTasks = [
  { id: 1, title: 'Submit E-commerce Project', dueDate: 'Tomorrow', status: 'pending' },
  { id: 2, title: 'Complete React Assessment', dueDate: 'In 3 days', status: 'in-progress' },
  { id: 3, title: 'Apply for Data Analysis Task', dueDate: 'This week', status: 'pending' },
];

const recentActivities = [
  { id: 1, action: 'Completed Python Assessment', time: '2 hours ago', points: 50 },
  { id: 2, action: 'Applied for Web Dev Project', time: '1 day ago', points: 25 },
  { id: 3, action: 'Earned AWS Credential', time: '2 days ago', points: 100 },
  { id: 4, action: 'Updated Skills Profile', time: '3 days ago', points: 10 },
];

const recommendedTasks = [
  { id: 1, title: 'Mobile App UI Design', company: 'DesignStudio', match: 92, skills: ['Figma', 'UI/UX'] },
  { id: 2, title: 'Data Visualization Dashboard', company: 'Analytics Inc', match: 85, skills: ['Python', 'Plotly'] },
  { id: 3, title: 'API Development', company: 'TechCorp', match: 78, skills: ['Node.js', 'Express'] },
];

function DashboardPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'tasks'>('overview');
  const selectedProgram = searchParams.get('program');
  const selectedAmount = searchParams.get('amount');
  const formattedSelectedAmount = selectedAmount
    ? `₹${Number(selectedAmount).toLocaleString('en-IN')}`
    : null;

  const handleBuyNow = () => {
    const params = new URLSearchParams();
    if (selectedProgram) params.set('program', selectedProgram);
    if (selectedAmount) params.set('amount', selectedAmount);
    const query = params.toString();
    router.push(query ? `/signup?${query}` : '/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Rupesh!</h1>
              <p className="text-gray-600">Here's your learning and earning progress</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="font-medium">Level 3: Advanced Learner</span>
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {(selectedProgram || selectedAmount) && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Selected purchase
              {selectedProgram ? `: ${selectedProgram}` : ''} {formattedSelectedAmount ? ` - ${formattedSelectedAmount}` : ''}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
                { id: 'tasks', label: 'My Tasks', icon: <Briefcase className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-300 rounded-lg flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">82%</div>
                    <div className="text-sm text-gray-600">Career GPS Progress</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-300 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-sm text-gray-600">Credentials Earned</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">+2 this month</div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-300 rounded-lg flex items-center justify-center mr-3">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">₹42K</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">From 5 completed projects</div>
              </div>
            </div>

            {/* Career GPS Progress */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Rocket className="w-6 h-6 text-primary-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Career GPS Progress</h2>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View Full Plan
                </button>
              </div>

              <div className="space-y-6">
                {/* Milestone 1 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900">Foundation Skills Assessment</h3>
                      <span className="text-sm text-green-600">Completed</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Assessed 6 core skills and identified gaps</p>
                    <div className="text-xs text-gray-500">Completed 2 weeks ago</div>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900">Web Development Projects</h3>
                      <span className="text-sm text-blue-600">In Progress</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Complete 2 real-world web development projects</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500">1 of 2 projects completed</div>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-900">Advanced Cloud Certification</h3>
                      <span className="text-sm text-gray-500">Upcoming</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">AWS Solutions Architect certification</p>
                    <div className="text-xs text-gray-500">Starts next month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Tasks */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Briefcase className="w-6 h-6 text-primary-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Recommended Tasks</h2>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recommendedTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{task.title}</h3>
                        <div className="text-sm text-gray-600">{task.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">{task.match}%</div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">Required Skills:</div>
                      <div className="flex flex-wrap gap-2">
                        {task.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
              </div>
              
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Due {task.dueDate}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View All Tasks
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="text-sm text-gray-900">{activity.action}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-500">{activity.time}</div>
                        <div className="text-xs font-medium text-primary-600">+{activity.points} pts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-medium">Take Assessment</div>
                    <div className="text-sm opacity-90">Update your skills profile</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-medium">Browse Projects</div>
                    <div className="text-sm opacity-90">Find new opportunities</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-medium">Update Portfolio</div>
                    <div className="text-sm opacity-90">Add new projects</div>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="font-bold text-gray-900">Learning Resources</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800 mb-1">React Advanced Patterns</div>
                  <div className="text-sm text-blue-600">2 hours • Intermediate</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800 mb-1">Data Analysis with Python</div>
                  <div className="text-sm text-green-600">3 hours • Beginner</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800 mb-1">AWS Fundamentals</div>
                  <div className="text-sm text-purple-600">4 hours • Intermediate</div>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 text-primary-600 hover:text-primary-700 font-medium">
                View All Resources
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Network</div>
                <div className="text-2xl font-bold text-gray-900">42</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Connections made</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Learning Hours</div>
                <div className="text-2xl font-bold text-gray-900">156</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Goals Achieved</div>
                <div className="text-2xl font-bold text-gray-900">12</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Of 15 total</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-700">Skill Points</div>
                <div className="text-2xl font-bold text-gray-900">1,250</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Total earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardPageInner />
    </Suspense>
  );
}
