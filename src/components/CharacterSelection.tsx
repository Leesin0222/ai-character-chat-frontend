import React, { useState } from 'react';
import { characters, Character } from '../characters';
import './CharacterSelection.css';

interface CharacterSelectionProps {
  onSelectCharacter: (character: Character) => void;
}

function CharacterCard({
  char,
  onSelect,
}: {
  char: Character;
  onSelect: () => void;
}) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div
      className="card character-card h-100"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`${char.name}와 대화하기`}
    >
      <div className="character-avatar-wrapper">
        {avatarError ? (
          <div className="character-avatar character-avatar-fallback" aria-hidden>
            {char.name.charAt(0)}
          </div>
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}${char.avatar}`}
            alt={`${char.name} 프로필`}
            className="character-avatar"
            onError={() => setAvatarError(true)}
          />
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{char.name}</h5>
        <p className="card-text flex-grow-1">{char.description}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="btn btn-primary mt-auto"
        >
          이 캐릭터와 대화하기
        </button>
      </div>
    </div>
  );
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelectCharacter }) => {
  return (
    <div className="container text-center my-5 character-selection-page character-selection-enter">
      <h1 className="mb-4">대화할 AI 캐릭터를 선택하세요</h1>
      <div className="row">
        {characters.map((char) => (
          <div key={char.id} className="col-12 col-md-4 mb-4">
            <CharacterCard char={char} onSelect={() => onSelectCharacter(char)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;
