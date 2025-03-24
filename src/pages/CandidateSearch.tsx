import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextCandidate = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await searchGithub();
      
      if (users && users.length > 0) {
        // Try each user in the list until we find a valid one
        for (const user of users) {
          const userDetails = await searchGithubUser(user.login);
          if (userDetails) {  // If we got valid user details
            setCurrentCandidate({
              id: userDetails.id,
              name: userDetails.name,
              username: userDetails.login,
              location: userDetails.location,
              avatar_url: userDetails.avatar_url,
              email: userDetails.email,
              html_url: userDetails.html_url,
              company: userDetails.company
            });
            return;  // Exit once we find a valid user
          }
          // If userDetails is null, silently continue to next user
        }
        // If we get here, none of the users were valid
        setError('No valid candidates found');
        setCurrentCandidate(null);
      } else {
        setError('No more candidates available');
        setCurrentCandidate(null);
      }
    } catch (err) {
      setError('Error loading candidate');
      setCurrentCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  const saveCandidate = () => {
    if (currentCandidate) {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      if (!savedCandidates.some((c: Candidate) => c.id === currentCandidate.id)) {
        localStorage.setItem('savedCandidates', JSON.stringify([...savedCandidates, currentCandidate]));
      }
      loadNextCandidate();
    }
  };

  useEffect(() => {
    loadNextCandidate();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Candidate Search</h1>
      
      {currentCandidate ? (
        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-6">
            <img 
              src={currentCandidate.avatar_url} 
              alt={`${currentCandidate.username}'s avatar`}
              className="w-32 h-32 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentCandidate.name || currentCandidate.username}</h2>
              <p className="text-gray-400">@{currentCandidate.username}</p>
              {currentCandidate.location && (
                <p className="mt-2">📍 {currentCandidate.location}</p>
              )}
              {currentCandidate.company && (
                <p className="mt-1">🏢 {currentCandidate.company}</p>
              )}
              {currentCandidate.email && (
                <p className="mt-1">📧 {currentCandidate.email}</p>
              )}
              <a 
                href={currentCandidate.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-400 hover:text-blue-300"
              >
                View GitHub Profile
              </a>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => loadNextCandidate()}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
            >
              <FaMinus /> <span>Skip</span>
            </button>
            <button
              onClick={saveCandidate}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
            >
              <FaPlus /> <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl">
          {error || 'No candidates available'}
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;