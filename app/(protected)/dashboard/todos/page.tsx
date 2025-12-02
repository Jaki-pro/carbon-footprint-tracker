'use client';

import React, { useEffect, useState } from 'react';

// --- Types ---
type Todo = {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  category: string;
  description?: string;
  estimated_co2_saving?: number;
};

// --- Icons ---
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const EmptyCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0A48.108 48.108 0 016.75 5.394m0 0L6.22 5.242a1.5 1.5 0 00-1.897 1.13L2.25 9h19.5L19.664 6.372a1.5 1.5 0 00-1.897-1.13L16.5 5.394m-12.75 0l1.275 0" /></svg>;

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/todos');
        if (res.ok) setTodos(await res.json());
        
    } catch (e) { 
        console.error("Error loading todos:", e);
    }
    finally { setIsLoading(false); }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
        // Real API call:
        const res = await fetch('/api/ai/suggest-todos', { method: 'POST' });
        if (res.ok) await fetchTodos();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    // Optimistic Update
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: newStatus } : t));
    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) { console.error(e); }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm('Remove this item?')) return;
    setTodos(prev => prev.filter(t => t.id !== id));
    // try { await fetch(`/api/todos/${id}`, { method: 'DELETE' }); } catch (e) { console.error(e); }
  };

  // Grouping logic
  const groupedTodos = todos.reduce((acc, todo) => {
    const cat = todo.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const completionRate = todos.length > 0 
    ? Math.round((todos.filter(t => t.status === 'completed').length / todos.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen p-6 lg:p-8 text-slate-900 font-sans">
      <div className="   mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Action Plan</h1>
            <p className="text-slate-500 mt-1">AI-curated steps to reduce your carbon footprint.</p>
            
            {todos.length > 0 && (
                <div className="mt-5 flex items-center gap-4">
                    <div className="h-2.5 w-48 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${completionRate}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{completionRate}% Complete</span>
                </div>
            )}
          </div>
          
          <button 
            onClick={generatePlan} 
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:shadow-none"
          >
            {isGenerating ? (
               <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Analyzing...
               </>
            ) : (
               <>
                 <SparklesIcon /> Generate New Plan
               </>
            )}
          </button>
        </div>

        {/* Grouped Todo Lists */}
        {isLoading ? (
           <div className="flex justify-center py-20">
               <div className="flex flex-col items-center gap-3">
                   <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-sm text-slate-400 font-medium">Curating your plan...</p>
               </div>
           </div>
        ) : todos.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-slate-800">No active tasks</h3>
              <p className="text-slate-500 mb-6">Click "Generate New Plan" to get AI recommendations.</p>
           </div>
        ) : (
           Object.keys(groupedTodos).map((category) => (
             <div key={category} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 px-2">
                    <span className="text-lg font-bold text-slate-800">{category}</span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{groupedTodos[category].length}</span>
                </div>
                
                <div className="grid gap-3">
                   {groupedTodos[category].map((todo) => (
                      <div 
                        key={todo.id} 
                        className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 ${
                            todo.status === 'completed' 
                            ? 'bg-slate-50 border-slate-100 opacity-75' 
                            : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5'
                        }`}
                      >
                         <button 
                            onClick={() => toggleStatus(todo)}
                            className="mt-1 flex-shrink-0 transition-transform active:scale-90 focus:outline-none"
                         >
                            {todo.status === 'completed' ? <CheckCircleIcon /> : <EmptyCircleIcon />}
                         </button>
                         
                         <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-base md:text-lg truncate ${todo.status === 'completed' ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                                {todo.title}
                            </h4>
                            {todo.description && (
                                <p className={`text-sm mt-1 leading-relaxed ${todo.status === 'completed' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {todo.description}
                                </p>
                            )}
                            {todo.estimated_co2_saving && (
                                <div className="mt-3 flex items-center">
                                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${
                                        todo.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        Save {todo.estimated_co2_saving} kg CO₂
                                    </span>
                                </div>
                            )}
                         </div>

                         <button 
                            onClick={() => deleteTodo(todo.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                            title="Remove task"
                         >
                            <TrashIcon />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
           ))
        )}

      </div>
    </div>
  );
}