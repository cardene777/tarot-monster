import "./App.css";
import { useRef, useState, useMemo } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';
import { Provider } from './lib/Provider';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');

    }

    return (
      <div id="app">
        <Provider>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </Provider>
      </div>
    );
}

export default App
