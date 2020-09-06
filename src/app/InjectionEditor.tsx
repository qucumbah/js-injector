import React, { useState } from 'react';

import { Injection } from './types';

type Props = {
  injection: Injection,
  onSave: (injection: Injection) => void,
  onExit: () => void,
};

const InjectionEditor: React.FC<Props> = ({
  injection,
  onSave,
  onExit,
}: Props) => {
  const [injectionCode, setInjectionCode] = useState<string>(injection.code);
  const [injectionRegex, setInjectionRegex] = useState<string>(injection.regex);

  const [
    isInjectionRegexValid,
    setIsInjectionRegexValid,
  ] = useState<boolean>(true);

  const checkIfInjectionRegexIsValid = (regexString: string) => {
    try {
      RegExp(regexString);
      setIsInjectionRegexValid(true);
    } catch {
      setIsInjectionRegexValid(false);
    }
  };

  return (
    <div>
      <textarea
        value={injectionCode}
        onChange={(event) => setInjectionCode(event.target.value)}
      />
      <input
        value={injectionRegex}
        onChange={(event) => {
          setInjectionRegex(event.target.value);
          checkIfInjectionRegexIsValid(event.target.value);
        }}
      />
      <button
        className="saveButton"
        onClick={() => onSave({
          id: injection.id,
          code: injectionCode,
          regex: injectionRegex,
        })}
        disabled={!isInjectionRegexValid}
        type="button"
      >
        Save
      </button>
      <button
        className="exitButton"
        onClick={onExit}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
};

export default InjectionEditor;
