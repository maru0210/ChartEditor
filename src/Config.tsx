import { useState } from "react";
import { Note } from "./types";

import "./css/Config.css";

type Props = {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    measure: number;
    setMeasure: React.Dispatch<React.SetStateAction<number>>;
    separate: number;
    setSeparate: React.Dispatch<React.SetStateAction<number>>;
};

function Config(props: Props) {
    const [defaultSize, setDefaultSize] = useState<number>(4);

    const UnSelectAllNotes = (_notes: Note[]) => {
        return _notes.map((note) => {
            note.isSelect = false;
            return note;
        });
    };

    const NewNote = (
        time: number = (props.measure + 1) * 4,
        pos: number = 17,
        type: string = "TAP",
        size: number = defaultSize,
    ) => {
        const _note: Note = {
            time: time,
            pos: pos,
            type: type,
            size: size,
            key: props.notes.length + 1,
            isSelect: true,
        };
        props.setNotes((old) => [...UnSelectAllNotes(old), _note]);
    };

    const DeleteNote = () => {
        props.setNotes(() =>
            props.notes.filter((note) => note.isSelect !== true),
        );
    };

    const ConectNotes = () => {
        const selectNotes: Note[] = [];
        props.notes.map((note) => {
            if (note.isSelect == true && note.type == "TAP")
                selectNotes.push(note);
        });
        selectNotes.sort((a, b) => a.pos - b.pos);

        if (selectNotes.length == 2) {
            if (selectNotes[0].time == selectNotes[1].time) {
                NewNote(
                    selectNotes[0].time,
                    selectNotes[0].pos + selectNotes[0].size,
                    "CONECT",
                    selectNotes[1].pos -
                        selectNotes[0].pos -
                        selectNotes[0].size,
                );
                return;
            }
        }
    };

    return (
        <>
            <div className="input-field">
                <input
                    id="incompletemeasure"
                    value={props.measure}
                    onChange={(e) => props.setMeasure(Number(e.target.value))}
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
                    value={props.separate}
                    onChange={(e) => props.setSeparate(Number(e.target.value))}
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
            <button
                className="waves-effect waves-light btn"
                onClick={() => ConectNotes()}
            >
                Conect
            </button>
        </>
    );
}

export default Config;
