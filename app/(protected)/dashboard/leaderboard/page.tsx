'use client';

import React, { useEffect, useState } from 'react';

// --- Types ---
type LeaderboardUser = {
  id: string;
  name: string;
  image_url?: string;
  monthly_total: number;
  rank?: number; // Added locally if pulling from list
};

type CurrentUserRank = {
  id: string;
  name: string;
  rank: number | string;
  monthly_total: number;
};

// --- Icons ---
const TrophyIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.652-2.623 1.497-1.675 2.519-2.009 7.559 2.083 11.65 4.092 4.092 9.132 3.758 11.65 2.083.845-.563 1.349-1.588 1.497-2.623h.858c.638 0 1.213-.378 1.482-.963.269-.585.086-1.27-.429-1.654l-1.276-.957.957-1.276c.384-.515.567-1.2.298-1.785-.269-.584-.844-.962-1.482-.962h-.858c-.148-1.035-.652-2.059-1.497-2.623-2.519-1.675-7.559-2.009-11.65 2.083a8.125 8.125 0 00-2.083 11.65c.563.845 1.588 1.349 2.623 1.497v.858c0 .638.378 1.213.963 1.482.585.269 1.27.086 1.654-.429l.957-1.276 1.276.957c.515.384 1.2.567 1.785.298.584-.269.962-.844.962-1.482v-.858a8.126 8.126 0 002.083-11.65c-.564-.845-1.588-1.349-2.623-1.497h-.858c-.638 0-1.213.378-1.482.963-.269.585-.086 1.27.429 1.654l1.276.957-.957 1.276c-.384.515-.567 1.2-.298 1.785.269.584.844.962 1.482.962h.858zM12 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const MedalIcon = ({ rank }: { rank: number }) => {
  const colors = rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-slate-400' : 'text-amber-600';
  return <div className={`${colors} drop-shadow-sm`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg></div>;
};

// --- Helper: Initials Avatar ---
const Avatar = ({ name, url, size = "md" }: { name: string, url?: string, size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = size === "lg" ? "w-16 h-16 text-xl" : size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  
  if (url) {
    return <img src={url} alt={name} className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm`} />;
  }
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center font-bold border-2 border-white shadow-sm`}>
      {initials}
    </div>
  );
};

export default function App() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Simulate network request
      await new Promise(r => setTimeout(r, 800));
      
      // Dummy Data for demonstration
      const mockUsers = Array.from({ length: 15 }).map((_, i) => ({
          id: `u-${i}`,
          name: ['Alice Green', 'Bob Solar', 'Charlie Recycle', 'Diana Eco', 'Evan Wind'][i % 5] + ` ${i+1}`,
          monthly_total: 45 + (i * 12.5),
          image_url: i === 0 ? 'https://i.pravatar.cc/150?u=a' : undefined
      }));
      
      setUsers(mockUsers);
      setCurrentUser({ id: 'u-99', name: 'You', rank: 42, monthly_total: 350 });
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const topThree = users.slice(0, 3);
  const restOfUsers = users.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 font-sans text-slate-900 pb-24">
      <div className="mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span className="text-emerald-500"><TrophyIcon className="w-8 h-8"/></span> 
            Monthly Leaderboard
          </h1>
          <p className="text-slate-500">Celebrating our top eco-warriors for {new Date().toLocaleString('default', { month: 'long' })}.</p>
        </div>

        {isLoading ? (
           <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 items-end mb-8 pt-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                   <div className="relative mb-2">
                      <Avatar name={topThree[1].name} url={topThree[1].image_url} size="md" />
                      <div className="absolute -bottom-2 -right-1 bg-slate-400 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">2</div>
                   </div>
                   <div className="w-full bg-white rounded-t-2xl shadow-sm border border-slate-100 p-4 pb-0 h-32 flex flex-col items-center justify-end relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-400"></div>
                      <p className="text-xs font-bold text-slate-700 text-center truncate w-full">{topThree[1].name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mb-2">{topThree[1].monthly_total.toFixed(0)} kg</p>
                   </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center z-10 -mx-2">
                   <div className="relative mb-2">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</div>
                      <Avatar name={topThree[0].name} url={topThree[0].image_url} size="lg" />
                      <div className="absolute -bottom-2 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">1</div>
                   </div>
                   <div className="w-full bg-gradient-to-b from-white to-yellow-50/50 rounded-t-2xl shadow-md border border-yellow-100 p-4 pb-0 h-40 flex flex-col items-center justify-end relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-yellow-400"></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <p className="text-sm font-bold text-slate-800 text-center truncate w-full mb-0.5">{topThree[0].name}</p>
                      <p className="text-xs text-emerald-600 font-bold font-mono mb-3 bg-emerald-50 px-2 py-0.5 rounded-full">{topThree[0].monthly_total.toFixed(0)} kg</p>
                   </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                   <div className="relative mb-2">
                      <Avatar name={topThree[2].name} url={topThree[2].image_url} size="md" />
                      <div className="absolute -bottom-2 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">3</div>
                   </div>
                   <div className="w-full bg-white rounded-t-2xl shadow-sm border border-slate-100 p-4 pb-0 h-24 flex flex-col items-center justify-end relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-600"></div>
                      <p className="text-xs font-bold text-slate-700 text-center truncate w-full">{topThree[2].name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mb-2">{topThree[2].monthly_total.toFixed(0)} kg</p>
                   </div>
                </div>
              )}
            </div>

            {/* List View */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {restOfUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                    <span className="w-6 text-center text-sm font-bold text-slate-400 font-mono">#{index + 4}</span>
                    <Avatar name={user.name} url={user.image_url} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md">
                        {Number(user.monthly_total).toFixed(1)} <span className="font-normal text-slate-500">kg</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky User Rank Footer */}
      {!isLoading && currentUser && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex items-center gap-4 border border-slate-700">
            <div className="flex flex-col items-center px-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Rank</span>
                <span className="text-xl font-bold text-emerald-400">#{currentUser.rank}</span>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div className="flex-1">
                <p className="text-sm font-bold">You are doing great!</p>
                <p className="text-xs text-slate-400">Only 12kg away from the top 10.</p>
            </div>
            <div className="text-right">
                <span className="text-lg font-bold font-mono">{Number(currentUser.monthly_total).toFixed(1)}</span>
                <span className="text-xs text-slate-500 block">kg CO₂</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}