'use client';

import { useState } from 'react';
import { Brain, Target, Clock, CheckCircle, ArrowRight, BarChart3, TrendingUp, BookOpen } from 'lucide-react';

const assessmentQuestions = [
  {
    id: 1,
    category: 'Web Development',
    question: 'Which of the following best describes your experience with React?',
    options: [
      'I have never used React',
      'I have basic understanding and can follow tutorials',
      'I can build simple components and understand props/state',
      'I can build complex applications with hooks, context, and state management',
      'I have professional experience and can architect large-scale React applications',
    ],
  },
  {
    id: 2,
    category: 'Data Analysis',
    question: 'How comfortable are you with data analysis using Python?',
    options: [
      'I have never used Python for data analysis',
      'I can use basic pandas functions with guidance',
      'I can clean data, perform basic analysis, and create simple visualizations',
      'I can build complex data pipelines and machine learning models',
      'I have professional experience with advanced statistical analysis and ML deployment',
    ],
  },
  {
    id: 3,
    category: 'UI/UX Design',
    question: 'What is your experience with design tools and user research?',
    options: [
      'I have no experience with design tools',
      'I can use basic design tools for simple mockups',
      'I can create wireframes and prototypes, understand basic UX principles',
      'I can conduct user research and create comprehensive design systems',
      'I have professional experience leading design projects and user testing',
    ],
  },
  {
    id: 4,
    category: 'Cloud Computing',
    question: 'What is your experience with cloud platforms like AWS/Azure/GCP?',
    options: [
      'I have no experience with cloud platforms',
      'I understand basic cloud concepts and have used simple services',
      'I can deploy applications and use core services (EC2, S3, etc.)',
      'I can architect cloud solutions and manage infrastructure',
      'I have professional experience with complex cloud architectures and DevOps',
    ],
  },
  {
    id: 5,
    category: 'Communication',
    question: 'How would you rate your written and verbal communication skills?',
    options: [
      'I struggle with clear communication',
      'I can communicate basic ideas but need improvement',
      'I can communicate effectively in most situations',
      'I can present complex ideas clearly and persuasively',
      'I have professional experience with client presentations and technical documentation',
    ],
  },
];

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(assessmentQuestions.length).fill(-1));
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const score = answers.reduce((sum, answer) => sum + (answer + 1) * 20, 0);
      setAssessmentScore(score);
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getSkillLevel = (score: number) => {
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    if (score >= 40) return 'Beginner';
    return 'Novice';
  };

  const getRecommendations = (score: number) => {
    if (score >= 80) {
      return [
        'Advanced project work',
        'Mentorship opportunities',
        'Specialized certifications',
      ];
    } else if (score >= 60) {
      return [
        'Intermediate courses',
        'Project-based learning',
        'Skill refinement',
      ];
    } else {
      return [
        'Foundational courses',
        'Basic projects',
        'Skill building exercises',
      ];
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-400 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Your skills have been assessed and your personalized Career GPS is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">{assessmentScore}%</div>
                <div className="text-lg font-medium text-gray-700">Overall Score</div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  assessmentScore >= 80 ? 'bg-green-100 text-green-800' :
                  assessmentScore >= 60 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getSkillLevel(assessmentScore)} Level
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Technical Skills</span>
                    <span className="text-sm font-medium text-primary-600">{(assessmentScore * 0.8).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${assessmentScore * 0.8}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Soft Skills</span>
                    <span className="text-sm font-medium text-primary-600">{(assessmentScore * 0.6).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${assessmentScore * 0.6}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Recommended Actions</h2>
              </div>
              
              <div className="space-y-4">
                {getRecommendations(assessmentScore).map((rec, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Estimated time to reach next level: {assessmentScore >= 80 ? '3-6 months' : '1-3 months'}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Next Steps</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">1</span>
                  </div>
                  <span>View your personalized Career GPS</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Browse recommended courses</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Explore project opportunities</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                View Career GPS
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Skill Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessmentQuestions.map((q, index) => (
                <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">{q.category}</div>
                  <div className="text-sm text-gray-700 mb-3">{q.question}</div>
                  <div className="text-xs text-gray-500">
                    Level: <span className="font-medium">{answers[index] + 1}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers(Array(assessmentQuestions.length).fill(-1));
                setIsCompleted(false);
              }}
              className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <div className="text-sm font-medium text-primary-600 mb-1">
                {assessmentQuestions[currentQuestion].category}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Question {currentQuestion + 1}
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            {assessmentQuestions[currentQuestion].question}
          </p>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {assessmentQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                    answers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentQuestion === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                answers[currentQuestion] === -1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium">Time</span>
            </div>
            <p className="text-sm text-gray-600">Approx. 10-15 minutes to complete</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium">Questions</span>
            </div>
            <p className="text-sm text-gray-600">Adaptive questions based on your responses</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-primary-600 mr-2" />
              <span className="font-medium">Purpose</span>
            </div>
            <p className="text-sm text-gray-600">Identifies skill gaps and creates personalized plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}