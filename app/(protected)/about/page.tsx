import React from 'react';

// --- ICONS ---
const LeafIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A.5.5 0 0115.5 5.5v8.19l-2.7-2.7a.5.5 0 00-.707 0l-2.7 2.7V5.5a.5.5 0 01.362-.486l5-2a.5.5 0 01.638 0l5 2a.5.5 0 01.362.486v12.502a.5.5 0 01-.712.448l-4.5-2a.5.5 0 00-.576 0l-4.5 2a.5.5 0 01-.712-.448V5.5a.5.5 0 01.362-.486l5-2a.5.5 0 01.638 0l5 2z" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const CheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;

// --- NAVBAR (Server Component Version) ---


export default function AboutPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-emerald-100/40 rounded-full blur-[100px] -z-10"></div>
         <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-blue-100/40 rounded-full blur-[100px] -z-10"></div>
      </div>


      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Our Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Empowering individuals to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">heal the planet.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            EcoTracker isn&apos;t just a dashboard; it&apos;s a commitment. We combine data science, modern technology, and gamification to make sustainability accessible, actionable, and engaging for everyone.
          </p>
        </div>
      </section>

      {/* --- STORY / PROBLEM SECTION --- */}
      <section className="py-20  border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-100 rounded-full blur-2xl"></div>
              <div className="relative z-10 bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                       <GlobeIcon />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-slate-900">The Challenge</h3>
                       <p className="text-sm text-slate-500">Why we started</p>
                    </div>
                 </div>
                 <p className="text-slate-600 leading-relaxed mb-4">
                    Climate change feels overwhelming. Many people want to help but don&apos;t know where to start. &quot;Does my commute matter?&quot; &quot;Is recycling enough?"
                 </p>
                 <p className="text-slate-600 leading-relaxed font-medium">
                    We believe that individual actions, when aggregated, create massive change. But you can&apos;t manage what you don&apos;t measure.
                 </p>
              </div>
           </div>
           
           <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Bridging the gap between <span className="text-emerald-600">intention</span> and <span className="text-emerald-600">action</span>.</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                 EcoTracker provides the tools to quantify your daily impact. By turning abstract carbon emissions into tangible numbers, we help you make informed decisions about your lifestyle.
              </p>
              <ul className="space-y-4">
                 {[
                    'Real-time emission calculations based on global standards.',
                    'AI-driven insights tailored to your habits.',
                    'Community challenges to foster collective responsibility.',
                 ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                       <CheckCircle />
                       <span>{item}</span>
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* --- TECH STACK (Portfolio Focus) --- */}
      <section className="py-24 ">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <CodeIcon />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built with Modern Tech</h2>
            <p className="text-slate-500 mb-16 max-w-2xl mx-auto">
               This project showcases a full-stack architecture designed for performance, scalability, and developer experience.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  { name: 'Next.js 14', desc: 'App Router & Server Components', bg: 'bg-black text-white' },
                  { name: 'TypeScript', desc: 'Type-safe reliability', bg: 'bg-blue-600 text-white' },
                  { name: 'PostgreSQL', desc: 'Robust relational data', bg: 'bg-indigo-600 text-white' },
                  { name: 'Gemini AI', desc: 'Generative recommendations', bg: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' },
                  { name: 'Tailwind CSS', desc: 'Responsive styling', bg: 'bg-cyan-500 text-white' },
                  { name: 'Chart.js', desc: 'Data visualization', bg: 'bg-orange-500 text-white' },
                  { name: 'NextAuth.js', desc: 'Secure authentication', bg: 'bg-purple-600 text-white' },
                  { name: 'Node Postgres', desc: 'Raw SQL optimization', bg: 'bg-green-600 text-white' },
               ].map((tech) => (
                  <div key={tech.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                     <div className={`w-10 h-10 ${tech.bg} rounded-lg flex items-center justify-center font-bold text-xs mb-4 mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                        {tech.name[0]}
                     </div>
                     <h3 className="font-bold text-slate-900">{tech.name}</h3>
                     <p className="text-xs text-slate-500 mt-1">{tech.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                  <LeafIcon className="w-5 h-5" />
               </div>
               <span className="text-lg font-bold text-slate-900">EcoTracker</span>
            </div>
            
            <p className="text-slate-500 text-sm">
               Designed & Built with <HeartIcon /> by <span className="font-bold text-slate-700">Your Name</span>
            </p>

            <div className="flex gap-6 text-sm font-medium text-slate-600">
               <a href="https://jaki-pro.github.io/Portfolio/" target='_blank' className="hover:text-emerald-600 transition-colors">Portfolio</a>
               <a href="https://github.com/jaki-pro" target='_blank' className="hover:text-emerald-600 transition-colors">GitHub</a>
               <a href="https://www.linkedin.com/m/in/jakariahossain23/" target='_blank' className="hover:text-emerald-600 transition-colors">LinkedIn</a>
            </div>
         </div>
      </footer>

    </div>
  );
}