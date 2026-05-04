'use client';

import { useState } from 'react';
import { Search, Filter, Briefcase, Clock, IndianRupee, MapPin, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';

const tasksData = [
  {
    id: 1,
    title: 'E-commerce Website Development',
    company: 'TechCorp',
    description: 'Build a responsive e-commerce website with product catalog, cart, and checkout functionality.',
    skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    budget: 25000,
    duration: 30,
    applicants: 24,
    location: 'Remote',
    posted: '2 days ago',
    experience: 'Intermediate',
  },
  {
    id: 2,
    title: 'Data Analysis Dashboard',
    company: 'Analytics Inc',
    description: 'Create interactive dashboards for sales data visualization using Python and Plotly.',
    skills: ['Python', 'Pandas', 'Plotly', 'SQL'],
    budget: 18000,
    duration: 21,
    applicants: 18,
    location: 'Bangalore',
    posted: '1 day ago',
    experience: 'Beginner',
  },
  {
    id: 3,
    title: 'Mobile App UI Design',
    company: 'DesignStudio',
    description: 'Design modern UI for a fitness tracking mobile application with 20+ screens.',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    budget: 15000,
    duration: 14,
    applicants: 32,
    location: 'Remote',
    posted: '3 days ago',
    experience: 'Intermediate',
  },
  {
    id: 4,
    title: 'Social Media Marketing Campaign',
    company: 'MarketingPro',
    description: 'Plan and execute a social media campaign across Instagram, Facebook, and LinkedIn.',
    skills: ['Social Media', 'Content Creation', 'Analytics'],
    budget: 12000,
    duration: 15,
    applicants: 45,
    location: 'Remote',
    posted: '5 days ago',
    experience: 'Beginner',
  },
  {
    id: 5,
    title: 'AWS Cloud Migration',
    company: 'CloudTech',
    description: 'Migrate on-premise applications to AWS with CI/CD pipeline setup.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    budget: 40000,
    duration: 45,
    applicants: 12,
    location: 'Hybrid',
    posted: '1 week ago',
    experience: 'Advanced',
  },
  {
    id: 6,
    title: 'Content Writing - Tech Blog',
    company: 'TechBloggers',
    description: 'Write 10 technical articles on web development trends and best practices.',
    skills: ['Technical Writing', 'SEO', 'Research'],
    budget: 8000,
    duration: 10,
    applicants: 28,
    location: 'Remote',
    posted: '4 days ago',
    experience: 'Beginner',
  },
];

const categories = [
  'All',
  'Web Development',
  'Data Science',
  'Design',
  'Marketing',
  'Cloud',
  'Writing',
];

const experienceLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [appliedTasks, setAppliedTasks] = useState<number[]>([]);

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           task.skills.some(skill => 
                             selectedCategory.toLowerCase().includes(skill.toLowerCase()) ||
                             task.title.toLowerCase().includes(selectedCategory.toLowerCase())
                           );
    
    const matchesExperience = selectedExperience === 'All' || 
                             task.experience === selectedExperience;
    
    return matchesSearch && matchesCategory && matchesExperience;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.posted).getTime() - new Date(a.posted).getTime();
    } else if (sortBy === 'budget') {
      return b.budget - a.budget;
    } else if (sortBy === 'applicants') {
      return b.applicants - a.applicants;
    }
    return 0;
  });

  const handleApply = (taskId: number) => {
    if (!appliedTasks.includes(taskId)) {
      setAppliedTasks([...appliedTasks, taskId]);
      alert('Application submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Task Marketplace
          </h1>
          <p className="text-xl text-gray-600">
            Find real-world projects to build your portfolio and earn experience
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Active Tasks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">156</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Total Applicants</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">2,458</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <IndianRupee className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Avg Budget</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹18K</div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Completed</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">892</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by skills, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedExperience(level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedExperience === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="budget">Highest Budget</option>
                <option value="applicants">Most Applicants</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Task Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {task.company}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.experience === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                    task.experience === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.experience}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">₹{task.budget.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{task.duration} days</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{task.applicants}</div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <div>
                      <div className="font-medium">{task.location}</div>
                      <div className="text-xs text-gray-500">Location</div>
                    </div>
                  </div>
                </div>

                {/* Posted Info */}
                <div className="text-xs text-gray-500 mb-4">
                  Posted {task.posted}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(task.id)}
                  disabled={appliedTasks.includes(task.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    appliedTasks.includes(task.id)
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {appliedTasks.includes(task.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedExperience('All');
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Work on Real Projects?</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Build a portfolio that impresses employers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Earn while you learn with project-based income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Get verified credentials for your Skills Passport</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">4</span>
                  </div>
                  <span>Direct placement opportunities with companies</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Success Stories</h3>
              </div>
              <p className="mb-4">
                "I completed 3 projects through Adyapan Marketplace and got hired by TechCorp as a Full Stack Developer. 
                The real project experience made all the difference in my interviews."
              </p>
              <div className="text-sm opacity-90">- Anjali Sharma, Software Developer</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full">
            <div className="px-6 py-3 bg-white rounded-full shadow-sm">
              <span className="text-gray-700 font-medium">
                Ready to post your own project?{' '}
                <button className="text-primary-600 hover:text-primary-700 font-bold">
                  Register as a Company
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}