import { Data, Note } from "./types";

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

    const ConectNotes = () => {
        const selectNotes: Note[] = [];
        props.notes.map((note) => {
            for (let i = 0; i < note.data.length; i++) {
                if (note.type == 0 && note.data[i].isSelect) {
                    selectNotes.push(note);
                    break;
                }
            }
        });

        if (selectNotes.length != 2) return;
        if (selectNotes[0].time == selectNotes[1].time) return;

        selectNotes.sort((a, b) => a.time - b.time);

        const key = selectNotes[0].key;
        props.setNotes(() =>
            props.notes.map((note) => {
                if (note.key == key) {
                    note.type = 10;
                    note.data[0].isSelect = false;

                    // 参照代入を防ぐ
                    const newData: Data = JSON.parse(JSON.stringify(selectNotes[1].data[0]));
                    newData.diff = selectNotes[1].time - selectNotes[0].time;
                    newData.isSelect = false;

                    note.data.push(newData);
                }
                return note;
            }),
        );

        DeleteNote();
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
                    value={props.defaultSize}
                    onChange={(e) =>
                        props.setDefaultSize(Number(e.target.value))
                    }
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
            <button
                className="waves-effect waves-light btn"
                onClick={() => ConectNotes()}
            >
                Conect
            </button>
            <button
                className="waves-effect waves-light btn"
                onClick={() => console.log(props.notes)}
            >
                Debug
            </button>
        </>
    );
}

export default Config;
