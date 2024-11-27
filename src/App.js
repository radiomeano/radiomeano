import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  // URL della copertina di default
  const defaultCover = '/logo.png'; // Assicurati che questo file sia nella cartella 'public'

  useEffect(() => {
    const fetchCurrentSong = async () => {
      try {
        const response = await fetch('https://api.laut.fm/station/meteomeano/current_song');
        const data = await response.json();
        console.log('Dati API:', data);
        setCurrentSong(data);
      } catch (error) {
        console.error('Errore nel recupero del brano corrente:', error);
      }
    };

    fetchCurrentSong();
    const interval = setInterval(fetchCurrentSong, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="bg-blue-600 w-full py-4 text-white text-center">
        <h1 className="text-3xl font-bold">Radio Meano</h1>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow">
        {currentSong ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
            <img
              src={currentSong.image ? currentSong.image : defaultCover}
              alt={currentSong.title || 'Radio Meano'}
              className="h-40 w-40 mx-auto rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4">
              {currentSong.title || 'In onda su Radio Meano'}
            </h2>
            <p className="text-gray-600">
              {currentSong.artist?.name || 'Musica senza confini'}
            </p>
          </div>
        ) : (
          <p>Caricamento informazioni sul brano in corso...</p>
        )}
        <audio
          controls
          className="mt-4"
          src="https://stream.laut.fm/meteomeano"
        />
      </main>
      <footer className="bg-gray-800 w-full py-2 text-white text-center">
        <p>&copy; 2024 Radio Meano. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}

export default App;
