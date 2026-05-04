'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle, Upload, DollarSign, Clock, Users } from 'lucide-react';

const customEase = [0.22, 1, 0.36, 1] as const;

export default function HiringPage() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    taskTitle: '',
    description: '',
    budget: '',
    duration: '',
    skills: [],
    attachments: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Progress */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#1a2a4e]/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-24">
              <h3 className="text-white font-bold text-lg mb-6">Post Your Task</h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Task Details', icon: '📝' },
                  { step: 2, title: 'Budget & Timeline', icon: '💰' },
                  { step: 3, title: 'Review & Post', icon: '✓' }
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    onClick={() => setFormStep(item.step)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      formStep === item.step
                        ? 'bg-[#f90] text-[#1a1a2e]'
                        : formStep > item.step
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-xs font-semibold opacity-75">Step {item.step}</div>
                        <div className="font-semibold">{item.title}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> Be specific about your requirements to attract the best talent.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1a2a4e]/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              
              {/* Step 1: Task Details */}
              {formStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Task Details</h2>
                    <p className="text-gray-400">Tell us about the work you need done</p>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Task Title *</label>
                    <input
                      type="text"
                      name="taskTitle"
                      value={formData.taskTitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Build a React Dashboard Component"
                      className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f90] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the task in detail. Include requirements, deliverables, and any specific technologies..."
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f90] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Required Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., React, TypeScript, Tailwind CSS (comma separated)"
                      className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f90] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Attachments</label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#f90] transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Drag and drop files or click to upload</p>
                      <p className="text-gray-500 text-xs mt-1">Max 10MB per file</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Budget & Timeline */}
              {formStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Budget & Timeline</h2>
                    <p className="text-gray-400">Set your budget and project timeline</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Budget (₹) *</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          placeholder="5000"
                          className="w-full pl-10 pr-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f90] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Duration *</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange as any}
                        className="w-full px-4 py-3 bg-[#0f1419] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#f90] transition-colors"
                      >
                        <option value="">Select duration</option>
                        <option value="1-week">1 Week</option>
                        <option value="2-weeks">2 Weeks</option>
                        <option value="1-month">1 Month</option>
                        <option value="2-months">2 Months</option>
                        <option value="3-months">3 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#0f1419] border border-gray-600 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Pricing Tips</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#f90] mt-0.5 flex-shrink-0" />
                        <span>Higher budgets attract more qualified candidates</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#f90] mt-0.5 flex-shrink-0" />
                        <span>Be realistic about timeline and complexity</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#f90] mt-0.5 flex-shrink-0" />
                        <span>Consider offering performance bonuses</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Post */}
              {formStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Review Your Task</h2>
                    <p className="text-gray-400">Make sure everything looks good before posting</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-[#0f1419] border border-gray-600 rounded-lg p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Task Title</p>
                      <p className="text-white font-semibold">{formData.taskTitle || 'Not provided'}</p>
                    </div>

                    <div className="bg-[#0f1419] border border-gray-600 rounded-lg p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Description</p>
                      <p className="text-white text-sm">{formData.description || 'Not provided'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0f1419] border border-gray-600 rounded-lg p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Budget</p>
                        <p className="text-white font-semibold">₹{formData.budget || '0'}</p>
                      </div>
                      <div className="bg-[#0f1419] border border-gray-600 rounded-lg p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Duration</p>
                        <p className="text-white font-semibold">{formData.duration || 'Not selected'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 text-sm">
                      ✓ <strong>Ready to post!</strong> Your task will be visible to all pre-vetted talent on Adyapan.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  disabled={formStep === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    formStep === 1
                      ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  ← Back
                </motion.button>

                <div className="text-gray-400 text-sm">
                  Step {formStep} of 3
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={formStep === 3 ? handleSubmit : handleNext}
                  className="px-6 py-3 bg-[#f90] text-[#1a1a2e] rounded-lg font-semibold hover:bg-[#e07000] transition-colors"
                >
                  {formStep === 3 ? 'Post Task →' : 'Next →'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
