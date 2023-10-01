import React from "react";
import { ChartJson, NoteJson, SongInfo, Note } from "./types";

import "./css/Interface.css";

type Props = {
    info: SongInfo;
    notes: Note[];

    setInfo: React.Dispatch<React.SetStateAction<SongInfo>>;
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

function Interface(props: Props) {
    const fileExport = async () => {
        const notesJson: NoteJson[] = [];
        const notesData: Note[] = props.notes.slice().sort((a, b) => {
            if (a.time !== b.time) return a.time - b.time;
            if (a.pos !== b.pos) return a.pos - b.pos;
            return 0;
        });

        notesData.forEach((note) => {
            notesJson.push({
                time: note.time,
                pos: note.pos,
                type: note.type,
                size: note.size,
            });
        });

        const chartJson: ChartJson = {
            track: props.info.track,
            title: props.info.title,
            artist: props.info.artist,
            bpm: props.info.bpm,
            incompMeasure: props.info.incompMeasure,
            notes: notesJson,
        };

        const fh = await window.showSaveFilePicker({
            suggestedName:
                props.info.track.toString().padStart(3, "0") + ".json",
        });
        const stream = await fh.createWritable();
        const blob = new Blob([JSON.stringify(chartJson)]);
        await stream.write(blob);
        await stream.close();
    };

    const fileImport = async () => {
        const fh: FileSystemFileHandle[] = await window.showOpenFilePicker({
            types: [{ accept: { "data/JSON": [".json"] } }],
        });
        const file: File = await fh[0].getFile();

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result != "string") return;
            const chartJson: ChartJson = JSON.parse(reader.result);

            props.setInfo(() => ({
                track: chartJson.track,
                title: chartJson.title,
                artist: chartJson.artist,
                bpm: chartJson.bpm,
                incompMeasure: chartJson.incompMeasure,
            }));

            props.setNotes(() => {
                const tmp: Note[] = [];
                chartJson.notes.map((note: NoteJson, i: number) => {
                    tmp.push({
                        time: note.time,
                        pos: note.pos,
                        type: note.type,
                        size: note.size,

                        key: i,
                        isSelect: false,
                    });
                });
                return tmp;
            });
        };
        reader.readAsText(file);
    };

    return (
        <>
            <div className="interface">
                <button
                    className="waves-effect waves-light btn"
                    onClick={() => fileExport()}
                >
                    EXPORT
                </button>
                <button
                    onClick={() => fileImport()}
                    className="waves-effect waves-light btn"
                >
                    IMPORT
                </button>
            </div>
        </>
    );
}

export default Interface;
