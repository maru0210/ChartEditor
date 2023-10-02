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

    const [measure, setMeasure] = useState<number>(-1);
    const [separate, setSeparate] = useState<number>(4);
    
    const divCenter = useRef<HTMLDivElement>(null);
    const [centerHeight ,setCenterHeight] = useState<number>(0);
    const [centerWidth ,setCenterWidth] = useState<number>(0);

    useEffect(() => {
        setCenterHeight((old) => {
            if(divCenter.current != null) {
                return divCenter.current.clientHeight;
            }
            else return old;
        })

        setCenterWidth((old) => {
            if(divCenter.current != null) {
                return divCenter.current.clientWidth;
            }
            else return old;
        }) 
    })

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

            <div id="center" ref={divCenter}>
                <Editor
                    height={centerHeight}
                    width={centerWidth}
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
