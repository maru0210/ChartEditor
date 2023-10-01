import { Note } from "./types";
import { Props, NewRnd } from "./Editor";

export function Editor(props: Props) {
    const UpdateNotePos = (x: number, y: number, key: number) => {
        props.setNotes(
            props.notes.map((note) => {
                if (note.key === key) {
                    x = Math.round((x - 180) / 37.5);
                    note.pos = 0 <= x && x <= 15 ? x : note.pos;

                    y =
                        8 -
                        Math.round(((y - 50) / 101.2) * props.separate) /
                            props.separate;
                    note.time =
                        0 <= y && y <= 8 ? y + props.measure * 4 : note.time;
                }
                return note;
            }),
        );
    };

    const UpdateNoteSize = (width: number, key: number) => {
        props.setNotes(
            props.notes.map((note) => {
                if (note.key === key) {
                    note.size = Math.round(width / 37);
                }
                return note;
            }),
        );
    };

    const SelectNote = (e: MouseEvent, key: number) => {
        let tmp: Note[];
        if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
            // metaKey: (Mac)CommandKey, (Win)WindowsKey
            tmp = props.notes.map((note) => {
                if (note.key === key) note.isSelect = !note.isSelect;
                return note;
            });
        } else {
            tmp = UnSelectAllNotes(props.notes).map((note) => {
                if (note.key === key) note.isSelect = true;
                return note;
            });
        }
        props.setNotes(tmp);
    };

    const UnSelectAllNotes = (_notes: Note[]) => {
        return _notes.map((note) => {
            note.isSelect = false;
            return note;
        });
    };

    return (
        <div id="editor">
            <div className="notes">
                {props.notes.map((note: Note) =>
                    NewRnd(
                        note,
                        props.measure,
                        UpdateNotePos,
                        UpdateNoteSize,
                        SelectNote,
                    ),
                )}
            </div>

            <div className="measure">
                <p>{props.measure + 2}</p>
                <p>{props.measure + 1}</p>
                <p>{props.measure}</p>
            </div>

            <div className="background">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
