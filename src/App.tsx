import { useState, useEffect } from "react";

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

    const [measure, setMeasure] = useState<number>(-1);
    const [separate, setSeparate] = useState<number>(4);

    // const ChangeMeasure = (delta: number) => {
    //     if (delta > 0 && measure < 0) return;
    //     setMeasure(() => (delta > 0 ? measure - 1 : measure + 1));
    // };

    return (
        <>
            <div id="left">
                <Interface
                    info={SongInfo}
                    setInfo={setSongInfo}
                    notes={notes}
                    setNotes={setNotes}
                ></Interface>
                <Info info={SongInfo} SetSongInfo={setSongInfo}></Info>
            </div>

            <div id="center">
                <Editor
                    notes={notes}
                    setNotes={setNotes}
                    separate={separate}
                    setSeparate={setSeparate}
                    measure={measure}
                    setMeasure={setMeasure}
                ></Editor>
            </div>

            <div id="right">
                <Config
                    notes={notes}
                    setNotes={setNotes}
                    measure={measure}
                    setMeasure={setMeasure}
                    separate={separate}
                    setSeparate={setSeparate}
                ></Config>
            </div>
        </>
    );
}

export default App;
