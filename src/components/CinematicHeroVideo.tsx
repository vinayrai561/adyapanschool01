'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  text: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  scale: number;
  opacity: number;
  blur: number;
  timestamp: number;
  color: string;
  size: 'small' | 'medium' | 'large';
}

const CinematicHeroVideo: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(0);
  const [isStormMode, setIsStormMode] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPermanentMode, setIsPermanentMode] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxNotifications = 25;

  // Solid notification colors array
  const notificationColors = [
    'bg-orange-500', // Orange
    'bg-blue-500',   // Blue
    'bg-green-500',  // Green
    'bg-purple-500', // Purple
    'bg-red-500',    // Red
    'bg-pink-500',   // Pink
    'bg-indigo-500', // Indigo
    'bg-yellow-500', // Yellow
    'bg-teal-500',   // Teal
    'bg-cyan-500',   // Cyan
    'bg-emerald-500',// Emerald
    'bg-rose-500',   // Rose
    'bg-violet-500', // Violet
    'bg-amber-500',  // Amber
    'bg-lime-500',   // Lime
  ];

  const notificationSizes = ['small', 'medium', 'large'] as const;

  const notificationTexts = [
    "Want Internship with Real Experience?",
    "Build Skills Before Graduation.",
    "Need Placement Support?",
    "Skills Are the New Degree.",
    "Get Hired Faster.",
    "Launch Your Career.",
    "Industry Starts Here.",
    "Real Skills. Real Careers.",
    "Learn Beyond Limits.",
    "Become Industry Ready.",
    "Want Mock Interview Preparation?",
    "Ready for Your First Internship?",
    "Where Skills Meet Opportunities.",
    "College Alone Isn't Enough.",
    "Build Before You Graduate."
  ];

  const generateNotification = (isStorm = false): Notification => {
    const containerWidth = containerRef.current?.clientWidth || 1200;
    const containerHeight = containerRef.current?.clientHeight || 800;
    
    // More realistic positioning - avoid edges and center area where phone is
    const leftSide = Math.random() < 0.5;
    const xPosition = leftSide 
      ? Math.random() * (containerWidth * 0.35) // Left 35% of screen
      : containerWidth * 0.65 + Math.random() * (containerWidth * 0.3); // Right 30% of screen
    
    // Random color and size for each notification
    const randomColor = notificationColors[Math.floor(Math.random() * notificationColors.length)];
    const randomSize = notificationSizes[Math.floor(Math.random() * notificationSizes.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      text: notificationTexts[Math.floor(Math.random() * notificationTexts.length)],
      x: Math.max(20, Math.min(xPosition, containerWidth - 320)), // Ensure notification fits
      y: Math.random() * (containerHeight - 150) + 50, // Avoid top and bottom edges
      delay: isStorm ? Math.random() * 1 : Math.random() * 3, // Slower delays
      duration: isStorm ? 4 + Math.random() * 3 : 8 + Math.random() * 5, // Much longer duration
      scale: randomSize === 'small' ? 0.8 : randomSize === 'medium' ? 1.0 : 1.2, // Different sizes
      opacity: 1, // Full opacity for solid colors
      blur: 0, // No blur for crisp notifications
      timestamp: Date.now(),
      color: randomColor,
      size: randomSize
    };
  };

  const addNotification = (isStorm = false) => {
    try {
      // Limit to maximum notifications
      if (notifications.length >= maxNotifications) {
        // Remove oldest notification to make room
        setNotifications(prev => prev.slice(1));
      }

      const newNotification = generateNotification(isStorm);
      setNotifications(prev => [...prev, newNotification]);
      
      // Only auto-remove in storm mode, keep permanent in normal mode
      if (isStormMode || !isPermanentMode) {
        const timeoutId = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, (newNotification.delay + newNotification.duration) * 1000);
        return timeoutId;
      }
    } catch (error) {
      console.warn('Error adding notification:', error);
    }
  };

  const unleashStorm = () => {
    try {
      setIsStormMode(true);
      setIsPermanentMode(false);
      setCounter(0);
      
      // Clear existing notifications
      setNotifications([]);
      
      // Create storm of notifications - slower and more controlled
      const stormInterval = setInterval(() => {
        try {
          // Add fewer notifications at once for better control
          for (let i = 0; i < 2; i++) {
            setTimeout(() => addNotification(true), i * 200); // Slower stagger
          }
        } catch (error) {
          console.warn('Error in storm interval:', error);
        }
      }, 800); // Much slower interval

      // Counter animation - slower
      const counterInterval = setInterval(() => {
        setCounter(prev => {
          if (prev >= maxNotifications) {
            clearInterval(counterInterval);
            return maxNotifications;
          }
          return prev + Math.floor(Math.random() * 3) + 1; // Slower increment
        });
      }, 200); // Slower counter updates

      // Stop storm after 12 seconds (longer duration)
      const stormTimeout = setTimeout(() => {
        clearInterval(stormInterval);
        setIsStormMode(false);
        setIsPermanentMode(true); // Return to permanent mode
        const cleanupTimeout = setTimeout(() => {
          // Don't clear notifications in permanent mode
          setCounter(0);
        }, 2000);
        
        return cleanupTimeout;
      }, 12000); // Longer storm duration

      return stormTimeout;
    } catch (error) {
      console.warn('Error unleashing storm:', error);
      setIsStormMode(false);
      setIsPermanentMode(true);
    }
  };

  // Auto-play sequence with enhanced notification management
  useEffect(() => {
    const sequence = [
      () => setCurrentPhase(1), // Phone appears
      () => addNotification(), // First notification
      () => {
        addNotification();
        addNotification();
      }, // More notifications
      () => setCurrentPhase(2), // Text appears
      () => {
        // Auto storm after 10 seconds
        setTimeout(unleashStorm, 2000);
      }
    ];

    sequence.forEach((action, index) => {
      setTimeout(action, (index + 1) * 2000);
    });

    // Enhanced auto notification system - slower and more realistic
    const autoNotificationSystem = () => {
      if (!isStormMode && notifications.length < maxNotifications) {
        // Add notifications in slower waves
        const wave1 = setTimeout(() => {
          addNotification();
        }, 2000); // Slower first wave

        const wave2 = setTimeout(() => {
          addNotification();
        }, 5000); // Much slower second wave

        const wave3 = setTimeout(() => {
          if (notifications.length < maxNotifications - 2) {
            addNotification();
          }
        }, 8000); // Even slower third wave

        return () => {
          clearTimeout(wave1);
          clearTimeout(wave2);
          clearTimeout(wave3);
        };
      }
    };

    // Start auto notification system - much slower
    const autoInterval = setInterval(autoNotificationSystem, 15000); // Much slower auto system

    // Only cleanup in storm mode, keep permanent in normal mode
    const cleanupInterval = setInterval(() => {
      if (isStormMode) { // Only cleanup during storm mode
        setNotifications(prev => {
          const now = Date.now();
          return prev.filter(notification => {
            // Remove notifications older than 30 seconds only in storm mode
            const notificationAge = now - notification.timestamp;
            return notificationAge < 30000;
          });
        });
      }
    }, 10000); // Less frequent cleanup

    return () => {
      clearInterval(autoInterval);
      clearInterval(cleanupInterval);
    };
  }, [isStormMode, notifications.length]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-black"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Moving Gradients */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-orange-900/20 to-blue-900/20"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(249, 115, 22, 0.2), rgba(30, 58, 138, 0.2))",
              "linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))",
              "linear-gradient(225deg, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2), rgba(249, 115, 22, 0.2))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Light Streaks */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-20"
            style={{
              width: '200px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Left Side - Text Content */}
        <motion.div
          className="flex-1 max-w-2xl text-center lg:text-left mb-8 lg:mb-0"
          initial={{ opacity: 0, x: -100 }}
          animate={{ 
            opacity: currentPhase >= 2 ? 1 : 0,
            x: currentPhase >= 2 ? 0 : -100
          }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <span className="text-white block">Build Skills.</span>
            <span className="text-white block">Get Experience.</span>
            <span className="text-orange-400 block">Get Hired.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            ADYAPAN School helps students become industry-ready with internships, 
            real projects, certifications, mentorship, and placement-focused training.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.button
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl text-base sm:text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-2xl hover:shadow-orange-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Career
            </motion.button>
            
            <motion.button
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl text-base sm:text-lg border border-white/20 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Internship Program
            </motion.button>
            
            <motion.button
              onClick={unleashStorm}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl text-base sm:text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-2xl hover:shadow-purple-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={isStormMode ? { 
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                  "0 0 40px rgba(147, 51, 234, 0.8)",
                  "0 0 20px rgba(147, 51, 234, 0.5)"
                ]
              } : {}}
              transition={{ duration: 0.5, repeat: isStormMode ? Infinity : 0 }}
            >
              <span className="hidden sm:inline">Unleash Notification Storm</span>
              <span className="sm:hidden">Storm Mode</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side - 3D Phone */}
        <motion.div
          className="flex-1 flex justify-center items-center relative max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
          animate={{ 
            opacity: currentPhase >= 1 ? 1 : 0,
            scale: currentPhase >= 1 ? 1 : 0.5,
            rotateY: 0
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* 3D Phone - More Mobile Realistic */}
          <motion.div
            className="relative w-64 h-[480px] sm:w-80 sm:h-[600px] perspective-1000"
            animate={{
              rotateY: [-1, 1, -1], // Slower, more subtle rotation
              rotateX: [-0.5, 0.5, -0.5], // Gentler tilt
            }}
            transition={{
              duration: 12, // Much slower rotation
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Phone Body - More realistic proportions */}
            <div className="relative w-full h-full bg-gradient-to-b from-gray-800 to-black rounded-[2.5rem] shadow-2xl border-2 border-gray-600 overflow-hidden">
              
              {/* Phone Screen Glow */}
              <div className="absolute inset-3 bg-gradient-to-b from-blue-900 via-purple-900 to-orange-900 rounded-[2rem] shadow-inner">
                
                {/* Screen Content */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-gradient-to-b from-gray-900 to-black">
                  
                  {/* Status Bar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <span className="ml-2 font-bold">ADYAPAN</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">100%</span>
                      <div className="w-6 h-3 border border-white rounded-sm">
                        <div className="w-full h-full bg-green-400 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* ADYAPAN Branding */}
                  <motion.div
                    className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center"
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 4, repeat: Infinity }} // Slower breathing effect
                  >
                    <div className="text-3xl font-black text-white mb-2">ADYAPAN</div>
                    <div className="text-sm text-orange-400 font-bold">School</div>
                  </motion.div>

                  {/* Screen Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-purple-500/20 rounded-[2rem]" />
                  
                  {/* Notification Counter */}
                  {counter > 0 && (
                    <motion.div
                      className="absolute top-16 right-6 bg-red-500 text-white text-sm font-black px-3 py-2 rounded-full shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        y: [0, -2, 0] // Gentle floating
                      }}
                      transition={{ 
                        scale: { type: "spring", stiffness: 500 },
                        y: { duration: 3, repeat: Infinity }
                      }}
                    >
                      {counter}
                    </motion.div>
                  )}

                  {/* Chat Interface Preview */}
                  <div className="absolute bottom-8 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <div className="flex-1 bg-white/20 rounded-full px-3 py-2">
                          <span className="text-white text-xs font-bold">Start your journey...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Reflections - More realistic */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[2.5rem] pointer-events-none" />
              <div className="absolute top-12 left-8 w-20 h-40 bg-white/10 rounded-full blur-2xl" />
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="absolute z-20 pointer-events-none"
            style={{
              left: notification.x,
              top: notification.y,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              y: 30,
              rotateX: -45
            }}
            animate={{ 
              opacity: notification.opacity,
              scale: notification.scale,
              y: 0,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.9,
              y: -20,
              transition: { duration: 0.8 } // Slower exit
            }}
            transition={{ 
              delay: notification.delay,
              duration: 1.2, // Slower entrance
              ease: "easeOut"
            }}
          >
            {/* Mobile-First Chat-like Notification Card with Solid Colors */}
            <div className={`relative ${
              notification.size === 'small' ? 'max-w-xs' : 
              notification.size === 'medium' ? 'max-w-sm' : 'max-w-md'
            }`}>
              <div className={`${notification.color} rounded-2xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/20`}>
                
                {/* Notification Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                      <span className="text-white text-sm font-black">A</span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">ADYAPAN</div>
                      <div className="text-white/80 text-xs font-medium">School • now</div>
                    </div>
                  </div>
                  
                  {/* Active Indicator */}
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full shadow-lg"
                    animate={{ 
                      opacity: [1, 0.4, 1],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Chat-like Message Bubble */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3 border border-white/30">
                  <p className={`text-white font-bold leading-relaxed ${
                    notification.size === 'small' ? 'text-xs' : 
                    notification.size === 'medium' ? 'text-sm' : 'text-base'
                  }`}>
                    {notification.text}
                  </p>
                </div>

                {/* Chat Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <motion.button
                      className="px-3 py-1.5 bg-white/30 hover:bg-white/40 text-white text-xs font-bold rounded-lg transition-all backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join Now
                    </motion.button>
                    <motion.button
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-all backdrop-blur-sm border border-white/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                  
                  {/* Message Status */}
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <span className="text-white text-xs font-bold">✓✓</span>
                  </div>
                </div>

                {/* Enhanced Solid Color Glow */}
                <div className={`absolute inset-0 ${notification.color} rounded-2xl blur-xl -z-10 opacity-40`} />
                
                {/* Mobile-optimized Accent */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-white/40 rounded-r-full shadow-lg" />
                
                {/* Chat Bubble Tail */}
                <div className={`absolute -bottom-2 left-6 w-4 h-4 ${notification.color} border-l border-b border-white/20 transform rotate-45 rounded-bl-sm`}></div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Storm Mode Overlay Effects */}
      {isStormMode && (
        <>
          {/* Screen Flash - Slower */}
          <motion.div
            className="absolute inset-0 bg-orange-400/15 z-30 pointer-events-none"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }} // Slower flash
          />
          
          {/* Lens Flare - Slower */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-orange-400/20 via-purple-500/15 to-transparent rounded-full blur-3xl z-25 pointer-events-none"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }} // Much slower lens flare
          />
        </>
      )}

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default CinematicHeroVideo;