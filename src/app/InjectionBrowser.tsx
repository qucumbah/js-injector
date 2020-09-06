import React, { useState } from 'react';

import { Injection } from './types';

type Props = {
  injections: Injection[],
  onEditStart: (injectionId: number) => void,
  onInjectionAdd: () => void,
  onInjectionRemove: (injectionId: number) => void,
};

const InjectionBrowser: React.FC<Props> = ({
  injections,
  onEditStart,
  onInjectionAdd,
  onInjectionRemove,
}: Props) => {
  const [url, setUrl] = useState<string>();

  chrome.tabs?.query({
    active: true,
    currentWindow: true,
  }, ([currentTab]: [chrome.tabs.Tab]) => {
    setUrl(currentTab.url);
  });

  return (
    <div className="injectionBrowser">
      {injections?.map(
        ({ id: injectionId, regex: injectionRegex }: Injection) => {
          const matchesCurrentUrl = url && RegExp(injectionRegex).test(url);
          return (
            <div
              key={injectionId}
              className={matchesCurrentUrl ? 'match' : 'nomatch'}
              title={matchesCurrentUrl ? 'matches current page' : ''}
            >
              {injectionRegex}
              <button
                className="editButton"
                onClick={() => onEditStart(injectionId)}
                type="button"
              >
                Edit
              </button>
              <button
                className="removeButton"
                onClick={() => onInjectionRemove(injectionId)}
                type="button"
              >
                Remove
              </button>
            </div>
          );
        },
      )}
      <button
        className="addInjectionButton"
        onClick={onInjectionAdd}
        type="button"
      >
        Add injection
      </button>
    </div>
  );
};

export default InjectionBrowser;
