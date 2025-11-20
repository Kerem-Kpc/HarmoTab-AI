import React, { useState } from 'react';
import { LoadingStatus, SongData } from './types';
import { generateSongTabs } from './services/geminiService';
import SearchBar from './components/SearchBar';
import SongSheet from './components/SongSheet';
import LoadingState from './components/LoadingState';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [songData, setSongData] = useState<SongData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = async (query: string) => {
    setStatus(LoadingStatus.LOADING);
    setErrorMessage('');
    setSongData(null);

    try {
      const data = await generateSongTabs(query);
      setSongData(data);
      setStatus(LoadingStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(LoadingStatus.ERROR);
      // More user-friendly error handling
      if (error.message && error.message.includes("JSON")) {
        setErrorMessage("We found the song but had trouble formatting the music sheet. Please try again.");
      } else {
        setErrorMessage("We couldn't find accurate lyrics or tabs for that song. It might be an instrumental or too obscure. Try a more popular song!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500 selection:text-white font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl mix-blend-screen"></div>
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-3xl mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mb-8 shadow-2xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-500 ring-4 ring-white/5">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-2xl">
            Harmo<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Tab</span> AI
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Enter any song title. AI will find the official lyrics and compose <span className="text-indigo-300 font-semibold">C Diatonic</span> harmonica tabs instantly.
          </p>
        </header>

        {/* Search Section */}
        <SearchBar onSearch={handleSearch} isSearching={status === LoadingStatus.LOADING} />

        {/* Content Area */}
        <main className="flex-grow w-full mt-8">
          {status === LoadingStatus.IDLE && (
            <div className="text-center mt-12 animate-fade-in opacity-0" style={{animationFillMode: 'forwards', animationDelay: '0.2s'}}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="group bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400 text-3xl group-hover:scale-110 transition-transform">🎵</div>
                  <h3 className="text-xl font-bold text-white mb-3">Smart Analysis</h3>
                  <p className="text-slate-400 leading-relaxed">AI researches accurate lyrics and song structure from trusted web sources.</p>
                </div>
                <div className="group bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1">
                   <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400 text-3xl group-hover:scale-110 transition-transform">🎹</div>
                  <h3 className="text-xl font-bold text-white mb-3">Precise Notation</h3>
                  <p className="text-slate-400 leading-relaxed">Generates Richter-tuned tabs (+Blow / -Draw) optimized for C Diatonic harmonicas.</p>
                </div>
                <div className="group bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1">
                   <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-400 text-3xl group-hover:scale-110 transition-transform">⚡</div>
                  <h3 className="text-xl font-bold text-white mb-3">Gemini 2.5 Flash</h3>
                  <p className="text-slate-400 leading-relaxed">Powered by Google's latest high-speed model for instant, reliable compositions.</p>
                </div>
              </div>
            </div>
          )}

          {status === LoadingStatus.LOADING && <LoadingState />}

          {status === LoadingStatus.ERROR && (
            <div className="text-center py-16 px-6 bg-slate-900/50 border border-red-500/20 rounded-3xl max-w-2xl mx-auto animate-fade-in backdrop-blur-md">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Oops!</h3>
              <p className="text-slate-300 text-lg mb-8">{errorMessage}</p>
              <button 
                onClick={() => setStatus(LoadingStatus.IDLE)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
              >
                Try Another Song
              </button>
            </div>
          )}

          {status === LoadingStatus.SUCCESS && songData && (
            <SongSheet data={songData} />
          )}
        </main>

        <footer className="mt-24 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} HarmoTab AI. 
            <span className="mx-2 opacity-50">|</span>
            Powered by <span className="text-indigo-400 font-semibold">Google Gemini</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;