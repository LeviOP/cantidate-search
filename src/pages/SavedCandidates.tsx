import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const loadSavedCandidates = () => {
      const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      setSavedCandidates(candidates);
    };

    loadSavedCandidates();
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', loadSavedCandidates);
    
    return () => {
      window.removeEventListener('storage', loadSavedCandidates);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Saved Candidates</h1>
      
      {savedCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img 
                  src={candidate.avatar_url} 
                  alt={`${candidate.username}'s avatar`}
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{candidate.name || candidate.username}</h2>
                  <p className="text-gray-400">@{candidate.username}</p>
                  {candidate.location && (
                    <p className="mt-1 text-sm">📍 {candidate.location}</p>
                  )}
                  {candidate.company && (
                    <p className="mt-1 text-sm">🏢 {candidate.company}</p>
                  )}
                  {candidate.email && (
                    <p className="mt-1 text-sm">📧 {candidate.email}</p>
                  )}
                  <a 
                    href={candidate.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
                  >
                    View GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl">
          No candidates have been saved yet
        </div>
      )}
    </div>
  );
};

export default SavedCandidates;
