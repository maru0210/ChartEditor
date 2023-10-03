import { Note } from "./types";

import "./css/Config.css";

type Props = {
    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    noteKey: number;
    setNoteKey: React.Dispatch<React.SetStateAction<number>>;

    measure: number;
    setMeasure: React.Dispatch<React.SetStateAction<number>>;
    separate: number;
    setSeparate: React.Dispatch<React.SetStateAction<number>>;
    defaultSize: number;
    setDefaultSize: React.Dispatch<React.SetStateAction<number>>;
};

function Config(props: Props) {

    const DeleteNote = () => {
        props.setNotes(() =>
            props.notes.filter((note) => {
                let isDel: boolean = false;
                note.data.map((data) => {
                    if (!isDel && data.isSelect == true) isDel = true;
                });
                return !isDel;
            }),
        );
    };

    // const ConectNotes = () => {
    //     console.log(props.notes);
    //     const selectNotes: Note[] = [];
    //     props.notes.map((note) => {
    //         if (note.isSelect == true && note.type == "TAP")
    //             selectNotes.push(note);
    //     });
    //     selectNotes.sort((a, b) => a.pos - b.pos);

    //     if (selectNotes.length == 2) {
    //         if (selectNotes[0].time == selectNotes[1].time) {
    //             NewNote(
    //                 selectNotes[0].time,
    //                 selectNotes[0].pos + selectNotes[0].size,
    //                 "CONECT",
    //                 selectNotes[1].pos -
    //                     selectNotes[0].pos -
    //                     selectNotes[0].size,
    //             );
    //             return;
    //         }
    //     }
    // };

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
                    value={props.defaultSize}
                    onChange={(e) => props.setDefaultSize(Number(e.target.value))}
                    type="number"
                    className="validate"
                ></input>
                <label htmlFor="incompletemeasure" className="active">
                    Default Size
                </label>
            </div>
            <button
                className="waves-effect waves-light btn"
                onClick={() => DeleteNote()}
            >
                Delete
            </button>
            {/* <button
                className="waves-effect waves-light btn"
                onClick={() => ConectNotes()}
            >
                Conect
            </button> */}
        </>
    );
}

export default Config;
