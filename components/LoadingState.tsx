import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Animated Pulse */}
        <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
        <div className="absolute w-24 h-24 bg-purple-500/30 rounded-full animate-pulse delay-75"></div>
        
        {/* Musical Icon */}
        <svg className="w-16 h-16 text-indigo-400 relative z-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Composing Tablature...</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          AI is listening to the song, writing the lyrics, and converting notes to harmonica tabs just for you.
        </p>
      </div>
    </div>
  );
};

export default LoadingState;