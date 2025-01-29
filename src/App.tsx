import React, { useState, useEffect } from 'react';

// YouTube API Key (Replace with your actual API key)
const API_KEY = const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

// Fetch top 100 cat videos from YouTube API
const fetchVideos = async (pageToken = '') => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=cat&order=viewCount&part=snippet&type=video&maxResults=50&pageToken=${pageToken}`
  );
  const data = await response.json();
  return {
    videos: data.items,
    nextPageToken: data.nextPageToken,
    prevPageToken: data.prevPageToken,
  };
};

function App() {
  const [videos, setVideos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageToken, setNextPageToken] = useState<string>('');
  const [prevPageToken, setPrevPageToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Load the initial set of 50 videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const { videos, nextPageToken, prevPageToken } = await fetchVideos();
      setVideos(videos);
      setNextPageToken(nextPageToken);
      setPrevPageToken(prevPageToken);
      setLoading(false);
    };
    loadVideos();
  }, []);

  // Handle page navigation
  const goToNextPage = async () => {
    if (!nextPageToken) return;
    setLoading(true);
    const { videos, nextPageToken: newNextPageToken, prevPageToken } = await fetchVideos(nextPageToken);
    setVideos(videos);
    setNextPageToken(newNextPageToken);
    setPrevPageToken(prevPageToken);
    setCurrentPage((prev) => prev + 1);
    setLoading(false);
  };

  const goToPreviousPage = async () => {
    if (!prevPageToken) return;
    setLoading(true);
    const { videos, nextPageToken, prevPageToken: newPrevPageToken } = await fetchVideos(prevPageToken);
    setVideos(videos);
    setNextPageToken(nextPageToken);
    setPrevPageToken(newPrevPageToken);
    setCurrentPage((prev) => prev - 1);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-800 shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐱</span>
              <h1 className="text-2xl font-bold text-pink-500">PurrTube</h1>
            </div>
            <p className="text-gray-400">Endless Cat Entertainment</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col justify-center items-center py-8">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-[90%] sm:w-[70%] lg:w-[50%]">
            <div className="relative pb-[56.25%] h-0">
              {videos.length > 0 && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videos[0].id.videoId}`}
                  title="Cat Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 py-8">
          <button
            onClick={goToPreviousPage}
            disabled={!prevPageToken || loading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-400">{`Page ${currentPage}`}</span>
          <button
            onClick={goToNextPage}
            disabled={!nextPageToken || loading}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 PurrTube - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
