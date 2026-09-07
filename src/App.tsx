import { useEffect, useState } from 'react';
import { audioController } from './audio/AudioController';
import { MasterControls } from './features/audio/MasterControls';
import { DrumMachinePanel } from './features/drum-machine/DrumMachinePanel';
import { SynthPanel } from './features/synth/SynthPanel';
import './App.css';

type AppView = 'synth' | 'drums';

function App() {
  const [activeView, setActiveView] =
    useState<AppView>('synth');

  useEffect(() => {
    return () => {
      audioController.dispose();
    };
  }, []);

  const handleViewChange = (nextView: AppView) => {
    if (nextView === activeView) {
      return;
    }

    if (activeView === 'synth') {
      audioController.releaseNote();
    }

    setActiveView(nextView);
  };

  return (
    <main className="application">
      <header className="application__topbar">
        <nav
          className="application__tabs"
          role="tablist"
          aria-label="Instrument views"
        >
          <button
            id="synth-tab"
            type="button"
            role="tab"
            aria-selected={activeView === 'synth'}
            aria-controls="synth-view"
            className={
              activeView === 'synth'
                ? 'application__tab application__tab--active'
                : 'application__tab'
            }
            onClick={() => handleViewChange('synth')}
          >
            Synthesizer
          </button>

          <button
            id="drums-tab"
            type="button"
            role="tab"
            aria-selected={activeView === 'drums'}
            aria-controls="drums-view"
            className={
              activeView === 'drums'
                ? 'application__tab application__tab--active'
                : 'application__tab'
            }
            onClick={() => handleViewChange('drums')}
          >
            Drum Machine
          </button>
        </nav>

        <MasterControls />
      </header>

      <div className="application__view">
        {activeView === 'synth' && (
          <div
            id="synth-view"
            role="tabpanel"
            aria-labelledby="synth-tab"
          >
            <SynthPanel />
          </div>
        )}

        {activeView === 'drums' && (
          <div
            id="drums-view"
            role="tabpanel"
            aria-labelledby="drums-tab"
          >
            <DrumMachinePanel />
          </div>
        )}
      </div>
    </main>
  );
}

export default App;