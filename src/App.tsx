import { useState, useEffect, useRef } from "react";

import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

import { SongInfo, Note } from "./types";

import Interface from "./Interface";
import Info from "./Info";
import Config from "./Config";
import Editor from "./Editor";

import "./css/App.css";

function App() {
  useEffect(() => {
    M.AutoInit();
  }, []);

  const [SongInfo, setSongInfo] = useState<SongInfo>({
    track: 0,
    title: "",
    artist: "",
    bpm: 0,
    incompMeasure: 0,
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteKey, setNoteKey] = useState<number>(0);

  const [measure, setMeasure] = useState<number>(20);
  const [separate, setSeparate] = useState<number>(4);
  const [defaultSize, setDefaultSize] = useState<number>(4);

  const divCenter = useRef<HTMLDivElement>(null);
  const [centerHeight, setCenterHeight] = useState<number>(0);
  const [centerWidth, setCenterWidth] = useState<number>(0);

  const resizeHandle = () => {
    setCenterHeight((old) => {
      if (divCenter.current != null) {
        return divCenter.current.clientHeight;
      } else return old;
    });

    setCenterWidth((old) => {
      if (divCenter.current != null) {
        return divCenter.current.clientWidth;
      } else return old;
    });
  };

  useEffect(() => resizeHandle(), []);
  addEventListener("resize", () => resizeHandle());

  return (
    <>
      <div id="left">
        <Interface
          info={SongInfo}
          setInfo={setSongInfo}
          notes={notes}
          setNotes={setNotes}
          setNoteKey={setNoteKey}
        ></Interface>
        <Info info={SongInfo} SetSongInfo={setSongInfo}></Info>
      </div>

      <div id="center" ref={divCenter}>
        <Editor
          height={centerHeight}
          width={centerWidth}
          notes={notes}
          setNotes={setNotes}
          noteKey={noteKey}
          setNoteKey={setNoteKey}
          separate={separate}
          measure={measure}
          defaultSize={defaultSize}
        ></Editor>
      </div>

      <div id="right">
        <Config
          notes={notes}
          setNotes={setNotes}
          noteKey={noteKey}
          setNoteKey={setNoteKey}
          measure={measure}
          setMeasure={setMeasure}
          separate={separate}
          setSeparate={setSeparate}
          defaultSize={defaultSize}
          setDefaultSize={setDefaultSize}
        ></Config>
      </div>
    </>
  );
}

export default App;
