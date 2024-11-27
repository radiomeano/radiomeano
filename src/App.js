import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  const defaultCover = '/logo.png'; // Assicurati che questo file esista nella cartella public

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
    <div className="App">
      <header className="App-header">
        <h1>Radio Meano</h1>
        {currentSong ? (
          <div>
            <img
              src={currentSong.image || defaultCover}
              alt={currentSong.title || 'Radio Meano'}
              style={{ width: '300px', height: '300px' }}
            />
            <h2>{currentSong.title || 'In onda su Radio Meano'}</h2>
            <p>{currentSong.artist?.name || 'Musica senza confini'}</p>
          </div>
        ) : (
          <p>Caricamento in corso...</p>
        )}
        <audio controls src="https://stream.laut.fm/meteomeano"></audio>
      </header>
    </div>
  );
}

export default App;
