import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import CharacterSelection from './components/CharacterSelection';
import { Character } from './characters';
import './App.css';
import './index.css';

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleBackToSelection = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="App d-flex justify-content-center align-items-center vh-100">
      {selectedCharacter ? (
        <ChatWindow
          selectedCharacter={selectedCharacter}
          onBackToSelection={handleBackToSelection}
        />
      ) : (
        <CharacterSelection onSelectCharacter={handleSelectCharacter} />
      )}
    </div>
  );
}

export default App;
