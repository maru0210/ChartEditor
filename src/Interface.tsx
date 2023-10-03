import React from "react";
import { ChartJson, NoteJson, SongInfo, Note, DataJson, Data } from "./types";

import "./css/Interface.css";

type Props = {
    info: SongInfo;
    setInfo: React.Dispatch<React.SetStateAction<SongInfo>>;
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

    setNoteKey: React.Dispatch<React.SetStateAction<number>>;
};

function Interface(props: Props) {
    const fileExport = async () => {
        const notesJson: NoteJson[] = [];
        const notesData: Note[] = props.notes.slice().sort((a, b) => {
            if (a.time !== b.time) return a.time - b.time;
            else return a.data[0].pos - b.data[0].pos;
        });

        notesData.forEach((note) => {
            const dataJson: DataJson[] = [];
            note.data.map((data) => {
                dataJson.push({
                    diff: data.diff,
                    pos: data.pos,
                    size: data.size,
                });
            });

            notesJson.push({
                time: note.time,
                type: note.type,
                data: dataJson,
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
                const notes: Note[] = [];
                chartJson.notes.map((noteJson: NoteJson, i: number) => {
                    const data: Data[] = [];
                    noteJson.data.map((dataJson) => {
                        data.push({
                            diff: dataJson.diff,
                            pos: dataJson.pos,
                            size: dataJson.size,
                            isSelect: false,
                        });
                    });

                    notes.push({
                        time: noteJson.time,
                        type: noteJson.type,
                        data: data,

                        key: i,
                    });
                });
                return notes;
            });

            props.setNoteKey(() => chartJson.notes.length + 1);
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
