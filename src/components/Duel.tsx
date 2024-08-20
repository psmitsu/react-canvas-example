import { useEffect, useState, useRef } from "react";
import { DuelEngine, 
  DEFAULT_HERO_SPEED, MAX_SPEED, MIN_SPEED, 
  DEFAULT_SHOT_RATE, MIN_SHOT_RATE, MAX_SHOT_RATE, 
  DEFAULT_A_COLOR,
  DEFAULT_B_COLOR
} from "../lib/engine";
import { Score } from "./Score";
import { SpeedOptions } from "./SpeedOptions";
import { Modal } from "./Modal";
import { ColorPicker } from "./ColorPicker";

const Duel = () => {
  const [ scoreA, setScoreA ] = useState(0);
  const [ scoreB, setScoreB ] = useState(0);

  const [ aSpeed, setASpeed ] = useState(DEFAULT_HERO_SPEED);
  const [ aShotRate, setAShotRate ] = useState(DEFAULT_SHOT_RATE);
  const [ aColor, setAColor ] = useState(DEFAULT_A_COLOR);
  const [ aModalOpen, setAModalOpen ] = useState(false);

  const [ bSpeed, setBSpeed ] = useState(DEFAULT_HERO_SPEED);
  const [ bShotRate, setBShotRate ] = useState(DEFAULT_SHOT_RATE);
  const [ bColor, setBColor ] = useState(DEFAULT_B_COLOR);
  const [ bModalOpen, setBModalOpen ] = useState(false);

  const cRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<DuelEngine | null>(null);

  useEffect(() => {
    console.log('useEffect fired');

    if (cRef.current !== null) {
      const ctx = cRef.current.getContext("2d");

      if (ctx === null) {
        throw new Error("Could not get canvas context");
      }

      const game = new DuelEngine(
        ctx,
        (heroId: number) => {
          if (heroId  === 0) {
            setScoreA((prev) => prev+1);
          } else {
            setScoreB((prev) => prev+1);
          }
        },
        () => { setAModalOpen(true) },
        () => { setBModalOpen(true) },
      );
      game.run()

      gRef.current = game;

      return(() => {
        game.cleanup();
      });
    }
  }, []);

  // player A event handlers
  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setASpeed(aSpeed);
  }, [aSpeed]);

  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setAShotRate(aShotRate);
  }, [aShotRate]);

  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setAColor(aColor);
  }, [aColor]);

  // player B event handlers
  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setBSpeed(bSpeed);
  }, [bSpeed]);

  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setBShotRate(bShotRate);
  }, [bShotRate]);

  useEffect(() => {
    if (gRef.current === null) {
      throw new Error('game ref empty');
    }

    gRef.current.setBColor(bColor);
  }, [bColor]);


  return (
    <>
      <Score
        scoreA={scoreA}
        scoreB={scoreB}
      />
      <canvas
        style={{ border: '3px solid aqua', borderRadius: '15px' }}
        ref={cRef}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <SpeedOptions
          minSpeed={MIN_SPEED}
          maxSpeed={MAX_SPEED}
          heroSpeed={aSpeed}
          onHeroSpeedChange={(spd) => {setASpeed(spd)}}
          minShotRate={MIN_SHOT_RATE}
          maxShotRate={MAX_SHOT_RATE}
          shotRate={aShotRate}
          onShotRateChange={(rate) => {setAShotRate(rate)}}
        />
        <SpeedOptions
          minSpeed={MIN_SPEED}
          maxSpeed={MAX_SPEED}
          heroSpeed={bSpeed}
          onHeroSpeedChange={(spd) => {setBSpeed(spd)}}
          minShotRate={MIN_SHOT_RATE}
          maxShotRate={MAX_SHOT_RATE}
          shotRate={bShotRate}
          onShotRateChange={(rate) => {setBShotRate(rate)}}
        />
      </div>
      <Modal 
        isOpen={aModalOpen}
        handleClose={() => setAModalOpen(false)}
      >
        <span style={{ color: 'blue' }}>Left Hero Color</span>
        <ColorPicker color={aColor} handleColorChange={(c) => setAColor(c)} />
      </Modal>
      <Modal 
        isOpen={bModalOpen}
        handleClose={() => setBModalOpen(false)}
      >
        <span style={{ color: 'blue' }}>Right Hero Color</span>
        <ColorPicker color={bColor} handleColorChange={(c) => setBColor(c)} />
      </Modal>
    </>
  );
}

export { Duel }
