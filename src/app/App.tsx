import React, { useState, useEffect } from 'react';

import InjectionBrowser from './InjectionBrowser';
import InjectionEditor from './InjectionEditor';

import { Injection } from './types';

const App: React.FC<{}> = () => {
  const [injections, setInjections] = useState<Injection[]>([]);

  type EditingState = { isEditing: false } | {
    isEditing: true,
    currentInjectionId: number,
  };

  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
  });

  const [nextInjectionId, setNextInjectionId] = useState<number>(0);

  const [canSaveSettings, setCanSaveSettings] = useState<boolean>(false);

  useEffect(() => {
    if (canSaveSettings) {
      chrome.storage.sync.set({ injections, editingState, nextInjectionId });
    }
  }, [injections, editingState, nextInjectionId]);

  useEffect(() => {
    chrome.storage?.sync.get(
      ['injections', 'editingState', 'nextInjectionId'],
      ({
        injections: savedInjections,
        editingState: savedEditingState,
        nextInjectionId: savedNextInjectionId,
      }) => {
        if (savedInjections) {
          setInjections(savedInjections);
        }
        if (savedEditingState) {
          setEditingState(savedEditingState);
        }
        if (savedNextInjectionId) {
          setNextInjectionId(savedNextInjectionId);
        }

        setCanSaveSettings(true);
      },
    );
  }, []);

  const getInjectionBrowser = () => (
    <InjectionBrowser
      injections={injections}
      onEditStart={(newCurrentInjectionId: number) => {
        setEditingState({
          isEditing: true,
          currentInjectionId: newCurrentInjectionId,
        });
      }}
      onInjectionAdd={() => {
        const newInjections = injections.slice();
        newInjections.push({
          code: '',
          id: nextInjectionId,
          regex: '',
        });
        setNextInjectionId(nextInjectionId + 1);

        setInjections(newInjections);
      }}
      onInjectionRemove={(injectionToRemoveId: number) => {
        setInjections(
          injections.filter(
            (injection) => injection.id !== injectionToRemoveId
          ),
        );
      }}
    />
  );

  const getInjectionEditor = () => {
    if (!editingState.isEditing) {
      throw new Error('Can\'t get injection editor if editing state is false');
    }

    return (
      <InjectionEditor
        injection={injections.find((injection) => (
          injection.id === editingState.currentInjectionId
        )) as Injection}
        onSave={(newInjection: Injection) => {
          const newInjections = injections.map((oldInjection) => (
            (oldInjection.id === newInjection.id) ? newInjection : oldInjection
          ));
          setInjections(newInjections);
          setEditingState({ isEditing: false });
        }}
        onExit={() => setEditingState({ isEditing: false })}
      />
    );
  };

  return (
    <div>
      {editingState.isEditing ? getInjectionEditor() : getInjectionBrowser()}
    </div>
  );
};

export default App;
