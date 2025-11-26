'use client';

import React, { useEffect, useState } from 'react';

// --- ICONS ---
const LeafIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A.5.5 0 0115.5 5.5v8.19l-2.7-2.7a.5.5 0 00-.707 0l-2.7 2.7V5.5a.5.5 0 01.362-.486l5-2a.5.5 0 01.638 0l5 2a.5.5 0 01.362.486v12.502a.5.5 0 01-.712.448l-4.5-2a.5.5 0 00-.576 0l-4.5 2a.5.5 0 01-.712-.448V5.5a.5.5 0 01.362-.486l5-2a.5.5 0 01.638 0l5 2z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.499a2.25 2.25 0 00-2.25-2.25H9.375a2.25 2.25 0 00-2.25 2.25v5.741m9.375 0h.75a2.25 2.25 0 002.25-2.25V9.499a2.25 2.25 0 00-2.25-2.25h-.75m0 5.741h-9.375m9.375 0h.375m-9.75 0h.375" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>;
const ArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* --- GLOBAL STYLES & ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
        .floating-nav-container {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .floating-nav-container.scrolled {
          width: 90%;
          max-width: 1000px;
          top: 1rem;
          border-radius: 9999px;
        }
        .floating-nav-container.scrolled .nav-content {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
        }
        .perspective-1200 {
          perspective: 1200px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
      `}} />


      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-40 overflow-hidden bg-grid">
        
        {/* Dynamic Aurora Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[10%] w-[35rem] h-[35rem] bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[90px] animate-blob"></div>
            <div className="absolute top-[10%] right-[5%] w-[30rem] h-[30rem] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-[90px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[90px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/80 border border-emerald-100 shadow-sm backdrop-blur-sm mb-8 hover:scale-105 transition-transform cursor-default">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
            <span className="text-slate-600 text-xs font-medium">AI-Powered Recommendations Available &rarr;</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Impact Tracking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] animate-gradient">Reimagined.</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            The first gamified carbon footprint tracker that turns sustainability into a daily habit. 
            Measure activities, earn badges, and build a greener future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-28 w-full sm:w-auto">
            <a href="/dashboard" className="group relative w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="flex items-center justify-center gap-2 relative z-10">
                Start Tracking Free <ArrowRight />
              </div>
            </a>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md flex items-center justify-center gap-2">
              <PlayIcon /> View Demo
            </button>
          </div>

          {/* --- 3D DASHBOARD PREVIEW (Second Hero) --- */}
          <div className="relative w-full max-w-6xl mx-auto perspective-1200 group">
             
             {/* FLOATING: Badge Unlocked */}
             <div className="absolute -top-8 -right-10 z-30 animate-blob animation-delay-2000 hidden lg:block">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/30">🏆</div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New Achievement</p>
                      <p className="text-base font-bold text-slate-900">Zero Carbon Week</p>
                   </div>
                </div>
             </div>

             {/* FLOATING: AI Insight */}
             <div className="absolute top-1/2 -left-16 z-30 animate-blob hidden lg:block">
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 max-w-xs">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <SparklesIcon />
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Smart Insight</p>
                      <p className="text-sm font-medium text-slate-900 leading-tight">"You saved 12kg CO₂ by cycling today. Keep it up!"</p>
                   </div>
                </div>
             </div>

             {/* Glow behind dashboard */}
             <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[95%] h-[85%] bg-emerald-500/10 blur-[80px] -z-10 rounded-full"></div>
             
             {/* The Dashboard Card Container */}
             <div className="relative bg-white border border-slate-200/60 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden backdrop-blur-sm transform transition-transform duration-700 ease-out hover:scale-[1.005]">
                
                {/* Browser Header */}
                <div className="h-12 bg-slate-50/80 border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-20 backdrop-blur-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="mx-auto h-7 px-4 bg-white border border-slate-200 rounded-md flex items-center justify-center text-xs text-slate-400 font-medium shadow-sm">
                    app.ecotracker.com/overview
                  </div>
                </div>
                
                {/* Dashboard UI Content */}
                <div className="p-8 bg-slate-50/50 grid grid-cols-12 gap-8 min-h-[600px]">
                   
                   {/* Sidebar Navigation (Visual) */}
                   <div className="col-span-2 hidden lg:flex flex-col gap-2 border-r border-slate-200/50 pr-6">
                      <div className="mb-6 flex items-center gap-2 text-slate-900 font-bold">
                          <div className="p-1.5 bg-emerald-600 rounded-lg text-white"><LeafIcon className="w-4 h-4"/></div>
                          <span>EcoTracker</span>
                      </div>
                      
                      {['Dashboard', 'Activity Log', 'Analytics', 'Challenges'].map((item, i) => (
                          <div key={i} className={`h-10 w-full rounded-xl flex items-center px-4 text-sm font-medium ${i === 0 ? 'bg-white shadow-sm border border-slate-100 text-emerald-700' : 'text-slate-500 hover:bg-white/50'}`}>
                             {item}
                          </div>
                      ))}

                      <div className="mt-auto bg-slate-900 rounded-2xl p-4 text-white">
                         <p className="text-xs text-slate-400 mb-1">Your Footprint</p>
                         <p className="text-xl font-bold">1.2 Tons</p>
                         <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-emerald-400 h-full w-3/4"></div>
                         </div>
                      </div>
                   </div>

                   {/* Main Content Area */}
                   <div className="col-span-12 lg:col-span-10 grid grid-cols-3 gap-6">
                      
                      {/* Header Section */}
                      <div className="col-span-3 flex justify-between items-end mb-2">
                          <div>
                              <h2 className="text-2xl font-bold text-slate-900">Welcome back, Alex! 👋</h2>
                              <p className="text-slate-500 mt-1">Here's your daily carbon summary.</p>
                          </div>
                          <div className="flex gap-3">
                             <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">This Week</div>
                             <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-md shadow-emerald-600/20">Add Activity</div>
                          </div>
                      </div>

                      {/* Top Stat Cards - Meaningful Data */}
                      {[
                        { label: 'Carbon Saved', value: '128 kg', sub: '+12% from last week', color: 'text-emerald-600', icon: '📉' },
                        { label: 'Active Streak', value: '14 Days', sub: 'Personal best!', color: 'text-orange-500', icon: '🔥' },
                        { label: 'Tree Equivalent', value: '5 Trees', sub: 'Planted virtually', color: 'text-blue-600', icon: '🌳' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                           <div className="flex justify-between items-start mb-4">
                              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100">{stat.icon}</div>
                           </div>
                           <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                           <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                           <p className={`text-xs font-medium mt-2 ${stat.color}`}>{stat.sub}</p>
                        </div>
                      ))}

                      {/* Main Chart Area: Savings vs Limit */}
                      <div className="col-span-3 lg:col-span-2 bg-white h-80 rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                          <div className="flex justify-between mb-6 items-center">
                             <h3 className="font-bold text-slate-800">Emission Trends</h3>
                             <div className="flex gap-2 text-xs font-medium">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Actual</span>
                                <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-300"></div>Limit</span>
                             </div>
                          </div>
                          
                          {/* CSS-Only Bar Chart Visualization */}
                          <div className="flex items-end justify-between h-48 gap-4 px-2">
                             {[45, 70, 35, 60, 85, 55, 40].map((h, i) => (
                                <div key={i} className="w-full flex flex-col justify-end h-full gap-1 group cursor-pointer">
                                   {/* Tooltip */}
                                   <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded absolute -mt-8 ml-[-10px] pointer-events-none">
                                      {h}kg
                                   </div>
                                   {/* Background bar (limit) */}
                                   <div className="w-full bg-slate-100 rounded-t-sm h-full relative overflow-hidden">
                                      {/* Foreground bar (actual) */}
                                      <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm transition-all duration-500 hover:bg-emerald-400"></div>
                                   </div>
                                   <span className="text-[10px] text-slate-400 text-center mt-2">
                                      {['M','T','W','T','F','S','S'][i]}
                                   </span>
                                </div>
                             ))}
                          </div>
                      </div>

                      {/* Right Side: Live Feed */}
                      <div className="col-span-3 lg:col-span-1 bg-slate-50 h-80 rounded-3xl border border-slate-200/60 p-6 relative overflow-hidden">
                          <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
                          <div className="space-y-4">
                             {[
                                { icon: '🚌', title: 'Bus Ride', desc: 'Commute • 5km', time: '2h ago' },
                                { icon: '🥗', title: 'Vegan Meal', desc: 'Lunch • 0.5kg CO₂', time: '5h ago' },
                                { icon: '💡', title: 'Lights Off', desc: 'Energy • 2hrs', time: '8h ago' }
                             ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg">{item.icon}</div>
                                   <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                                      <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                                   </div>
                                   <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                                </div>
                             ))}
                          </div>
                          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                      </div>

                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* --- TRUSTED BY (Minimal) --- */}
      <section className="py-12 border-y border-slate-100 bg-white">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by green initiatives worldwide</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
               <span className="text-2xl font-black text-slate-800">GREEN<span className="text-emerald-600">CORP</span></span>
               <span className="text-2xl font-black text-slate-800">ECO<span className="text-blue-600">SHIFT</span></span>
               <span className="text-2xl font-black text-slate-800">PLANET<span className="text-purple-600">FWD</span></span>
               <span className="text-2xl font-black text-slate-800">ZERO<span className="text-slate-400">CARBON</span></span>
            </div>
         </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Background pattern for interest */}
        <div className="absolute inset-0 bg-grid opacity-[0.5]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Everything you need to <br /><span className="text-emerald-600">master your footprint.</span></h2>
            <p className="text-slate-500 text-lg">Powerful features wrapped in a beautiful, intuitive design. We make sustainability simple, actionable, and rewarding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Main Tracking */}
            <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-24 bg-emerald-50/80 blur-3xl rounded-full -z-10 transition-all duration-500 group-hover:bg-emerald-100/50"></div>
               <div className="relative z-10">
                 <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
                    <ChartIcon />
                 </div>
                 <h3 className="text-2xl font-bold mb-3 text-slate-900">Real-Time Carbon Analytics</h3>
                 <p className="text-slate-500 mb-10 max-w-md leading-relaxed">Visualize your data instantly. Log activities across Transport, Food, Energy, and Waste to see exactly where your emissions come from.</p>
                 
                 {/* Abstract Chart UI */}
                 <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100 p-6 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10"></div>
                    <div className="flex items-end justify-between h-full gap-3 px-4 pb-4">
                        {[30, 50, 45, 70, 60, 85, 65, 50, 75, 60, 90, 80].map((h, i) => (
                            <div key={i} style={{height: `${h}%`}} className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        ))}
                    </div>
                 </div>
               </div>
            </div>

            {/* Feature 2: Gamification */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-900/20 border border-slate-800 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
               {/* Shine effect */}
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors"></div>
               
               <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 backdrop-blur-sm border border-white/10">
                  <TrophyIcon />
               </div>
               <h3 className="text-2xl font-bold mb-3">Gamified Progress</h3>
               <p className="text-slate-400 mb-12 leading-relaxed">Earn badges, level up, and climb the leaderboard. Making eco-friendly choices has never been this addictive.</p>
               <div className="flex gap-6 justify-center items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-500 relative z-10">
                    🏆
                    <div className="absolute -bottom-2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">LVL 10</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center opacity-60 text-2xl grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">🌱</div>
               </div>
            </div>

            {/* Feature 3: AI Insights */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 group">
               <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <SparklesIcon />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-slate-900">AI Recommendations</h3>
               <p className="text-slate-500 leading-relaxed mb-6">Get personalized, actionable tips powered by AI to reduce your specific footprint based on your habits.</p>
               <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-800 italic">
                 "Try biking to work tomorrow to save 2.5kg of CO₂!"
               </div>
            </div>

            {/* Feature 4: Budgeting */}
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-[2.5rem] p-10 shadow-xl shadow-emerald-500/30 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
               {/* Decorative Circle */}
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
               
               <div className="flex-1 relative z-10">
                 <h3 className="text-2xl font-bold mb-3">Carbon Budgeting</h3>
                 <p className="text-emerald-50 mb-8 leading-relaxed text-lg">Set monthly emission limits just like a financial budget. We'll alert you when you're getting close to your cap.</p>
                 <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-emerald-50 font-medium bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm"><CheckCircle /> Set Daily/Monthly Limits</li>
                    <li className="flex items-center gap-4 text-emerald-50 font-medium bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm"><CheckCircle /> Smart Alerts & Notifications</li>
                 </ul>
               </div>
               <div className="w-full md:w-5/12 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 relative z-10 shadow-2xl">
                  <div className="flex justify-between text-sm mb-4">
                     <span className="text-emerald-100 font-medium">Monthly Budget</span>
                     <span className="text-white font-bold bg-white/20 px-2 py-0.5 rounded text-xs">75%</span>
                  </div>
                  <div className="w-full h-4 bg-emerald-900/40 rounded-full overflow-hidden mb-6">
                     <div className="h-full bg-yellow-400 w-3/4 shadow-[0_0_15px_rgba(250,204,21,0.6)] relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
                     </div>
                  </div>
                  <div className="text-xs font-medium text-emerald-100 bg-emerald-800/40 p-3 rounded-xl text-center border border-emerald-700/30">
                    ⚠️ Approaching transport limit
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="relative group cursor-pointer">
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative px-10 py-24 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 leading-none flex items-center justify-center flex-col overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-[0.5] -z-10"></div>
                  
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">Ready to make a <br /><span className="text-emerald-600">difference?</span></h2>
                  <p className="text-slate-500 text-xl mb-12 max-w-xl leading-relaxed">Start tracking your carbon footprint today. Join thousands of others in the fight against climate change.</p>
                  <a href="/auth/register" className="px-12 py-5 bg-slate-900 text-white font-bold text-lg rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-xl hover:shadow-slate-900/30 flex items-center gap-2">
                     Get Started for Free <ArrowRight />
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
                        <LeafIcon />
                     </div>
                     <span className="text-xl font-bold text-slate-900">EcoTracker</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xs">Empowering individuals to monitor, reduce, and offset their carbon footprint for a sustainable future.</p>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                  <ul className="space-y-4 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Features</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">API</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Integrations</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                  <ul className="space-y-4 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Community</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Impact Report</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
                  <ul className="space-y-4 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                     <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a></li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
               <p>© {new Date().getFullYear()} Personal Carbon Footprint Tracker. All rights reserved.</p>
               <div className="flex gap-6">
                  <a href="#" className="hover:text-slate-600">Twitter</a>
                  <a href="#" className="hover:text-slate-600">LinkedIn</a>
                  <a href="#" className="hover:text-slate-600">Instagram</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}