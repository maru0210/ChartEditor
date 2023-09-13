import { ChangeEvent, useState, useEffect } from "react";
import { Rnd } from "react-rnd";

import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";

import "./App.css";
import "./Editor.css";

type Note = {
    x: number;
    y: number;
    size: number;
    key: number;
    isSelect: boolean;
};

type _NoteData = {
    type: string;
    time: number;
    size: number;
    pos: number;
};

type _Data = {
    track: number;
    title: string;
    artist: string;
    bpm: number;
    incompMeasure: number;
    noteData?: Array<_NoteData>;
};

function NewRnd(
    note: Note,
    measure: number,
    UpdateNodePos: (x: number, y: number, key: number) => void,
    UpdateNodeSize: (width: number, key: number) => void,
    SelectNote: (key: number) => void,
) {
    return (
        <Rnd
            key={note.key}
            className={note.isSelect ? "selected" : ""}
            position={{
                x: note.x * 37.5 + 180,
                y: (8 - note.y + measure * 4) * 101.2 + 50,
            }}
            size={{ width: note.size * 37.5 - 1.5, height: 13 }}
            enableResizing={{
                top: false,
                right: true,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                topLeft: false,
                bottomLeft: false,
            }}
            onDragStop={(_e, d) => {
                UpdateNodePos(d.x, d.y, note.key);
            }}
            onResize={(_e, _direction, ref) => {
                UpdateNodeSize(ref.offsetWidth, note.key);
            }}
            onMouseDown={() => SelectNote(note.key)}
        ></Rnd>
    );
}

function App() {
    useEffect(() => {
        M.AutoInit();
    }, []);

    const [data, setData] = useState<_Data>({
        track: 0,
        title: "",
        artist: "",
        bpm: 0,
        incompMeasure: 0,
    });

    const [notes, setNotes] = useState<Note[]>([]);
    const [countNotes, setCountNotes] = useState<number>(0);
    const [measure, setMeasure] = useState<number>(-1);
    const [separate, setSeparate] = useState<number>(4);
    const [defaultSize, setDefaultSize] = useState<number>(4);

    const UnSelectAll = (_notes: Note[]) => {
        return _notes.map((note) => {
            note.isSelect = false;
            return note;
        });
    };

    const NewNote = () => {
        const _note: Note = {
            x: 17,
            y: 4 + measure * 4,
            size: defaultSize,
            key: countNotes,
            isSelect: true,
        };
        setNotes((old) => [...UnSelectAll(old), _note]);
        setCountNotes((old) => old + 1);
    };

    const DeleteNote = () => {
        setNotes(notes.filter((note) => note.isSelect !== true));
    };

    const UpdateNodePos = (x: number, y: number, key: number) => {
        setNotes(
            notes.map((note) => {
                if (note.key === key) {
                    x = Math.round((x - 180) / 37.5);
                    note.x = 0 <= x && x <= 15 ? x : note.x;
                    y = 8 - Math.round(((y - 50) / 101.2) * separate) / separate;
                    note.y = 0 <= y && y <= 8 ? y + measure * 4 : note.y;
                }
                return note;
            }),
        );
    };

    const UpdateNodeSize = (width: number, key: number) => {
        setNotes(
            notes.map((note) => {
                if (note.key === key) {
                    note.size = Math.round(width / 37);
                }
                return note;
            }),
        );
    };

    const SelectNote = (key: number) => {
        setNotes(
            UnSelectAll(notes).map((note) => {
                if (note.key === key) note.isSelect = true;
                return note;
            }),
        );
    };

    const ChangeMeasure = (delta: number) => {
        if (delta > 0 && measure < 0) return;
        setMeasure(() => (delta > 0 ? measure - 1 : measure + 1));
    };

    const handleData = (e: ChangeEvent<HTMLInputElement>) => {
        setData((old) => ({ ...old, [e.target.id]: e.target.value }));
    };

    const fileExport = async () => {
        const _noteData: _NoteData[] = [];
        notes.forEach((note) => {
            _noteData.push({
                type: "TAP",
                time: note.y,
                size: note.size,
                pos: note.x,
            });
        });
        const _noteDataSorted = _noteData.sort((a, b) => a.time - b.time);
        const _data: _Data = data;
        _data.noteData = _noteDataSorted;

        const fh = await window.showSaveFilePicker({
            suggestedName: data.track.toString().padStart(3, "0") + ".json",
        });
        const stream = await fh.createWritable();
        const blob = new Blob([JSON.stringify(_data)]);
        await stream.write(blob);
        await stream.close();
    };

    const fileImport = async () => {
        const fh: FileSystemFileHandle[] = await window.showOpenFilePicker({
            types: [{ accept: { "data/JSON": [".json"] } }],
        });
        console.log(await fh[0].getFile());
        const file: File = await fh[0].getFile();

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result != "string") return;
            const _data: _Data = JSON.parse(reader.result);
            setData(() => _data);

            if (_data.noteData === undefined) return;
            const _notes: Note[] = [];
            _data.noteData.map((_noteData: _NoteData, i: number) => {
                _notes.push({
                    x: _noteData.pos,
                    y: _noteData.time,
                    size: _noteData.size,
                    key: i,
                    isSelect: false,
                });
            });
            setNotes(() => _notes);
            setCountNotes(() => _notes.length);
        };
        reader.readAsText(file);
    };

    return (
        <>
            <div id="config">
                <div className="interFace">
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

                <div className="input-field">
                    <input
                        id="track"
                        value={data.track}
                        onChange={(e) => handleData(e)}
                        type="number"
                        className="validate"
                    ></input>
                    <label htmlFor="track" className="active">
                        Track Number
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="title"
                        value={data.title}
                        onChange={(e) => handleData(e)}
                        type="text"
                        className="validate"
                    ></input>
                    <label htmlFor="title" className="active">
                        Title
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="artist"
                        value={data.artist}
                        onChange={(e) => handleData(e)}
                        type="text"
                        className="validate"
                    ></input>
                    <label htmlFor="artist" className="active">
                        Artist
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="bpm"
                        type="number"
                        value={data.bpm}
                        onChange={(e) => handleData(e)}
                        className="validate"
                    ></input>
                    <label htmlFor="bpm" className="active">
                        BPM
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="incompMeasure"
                        value={data.incompMeasure}
                        onChange={(e) => handleData(e)}
                        type="number"
                        className="validate"
                    ></input>
                    <label htmlFor="incompMeasure" className="active">
                        Incomplete Measure
                    </label>
                </div>
                <div>
                    <p>Notes : {notes.length}</p>
                </div>
            </div>

            <div id="editor" onWheel={(e) => ChangeMeasure(e.deltaY)}>
                <div className="notes">
                    {notes
                        .filter((note) => {
                            if (
                                measure * 4 <= note.y &&
                                note.y <= (measure + 2) * 4
                            )
                                return true;
                            else return false;
                        })
                        .map((note: Note) =>
                            NewRnd(
                                note,
                                measure,
                                UpdateNodePos,
                                UpdateNodeSize,
                                SelectNote,
                            ),
                        )}
                </div>

                <div className="measure">
                    <p>{measure + 2}</p>
                    <p>{measure + 1}</p>
                    <p>{measure}</p>
                </div>

                <div className="background">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <div id="control">
                <div className="input-field">
                    <input
                        id="incompletemeasure"
                        value={measure}
                        onChange={(e) => setMeasure(Number(e.target.value))}
                        type="number"
                        className="validate"
                    ></input>
                    <label htmlFor="incompletemeasure" className="active">
                        Measure
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="separate"
                        value={separate}
                        onChange={(e) => setSeparate(Number(e.target.value))}
                        type="number"
                        className="validate"
                    ></input>
                    <label htmlFor="incompletemeasure" className="active">
                        Separate
                    </label>
                </div>
                <div className="input-field">
                    <input
                        id="separate"
                        value={defaultSize}
                        onChange={(e) => setDefaultSize(Number(e.target.value))}
                        type="number"
                        className="validate"
                    ></input>
                    <label htmlFor="incompletemeasure" className="active">
                        Default Size
                    </label>
                </div>
                <button
                    className="waves-effect waves-light btn"
                    onClick={() => NewNote()}
                >
                    New Note
                </button>
                <button
                    className="waves-effect waves-light btn"
                    onClick={() => DeleteNote()}
                >
                    Delete
                </button>
            </div>
        </>
    );
}

export default App;
