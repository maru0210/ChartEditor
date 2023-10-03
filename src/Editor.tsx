import { Rnd } from "react-rnd";

import "./EditorBK";
import { Note } from "./types";

import "./css/Editor.css";
import { measureLine, noteLine, posLine, posLine2 } from "./EditorBK";
import { useEffect } from "react";

type Props = {
    height: number;
    width: number;

    notes: Note[];
    setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
    separate: number;
    setSeparate: React.Dispatch<React.SetStateAction<number>>;
    measure: number;
    setMeasure: React.Dispatch<React.SetStateAction<number>>;
};

function Editor(props: Props) {
    const measure = 20 + 2;

    const unitWidth: number = Math.round((props.width - 80 - 17) / 16);
    const width: number = unitWidth * 16 + 1;
    const unitHeight: number = Math.round((props.height - 1) / 120);
    const height: number = unitHeight * 48 * measure + 1;

    useEffect(() => {
        const target = document.getElementById("editor");
        if (target) {
            target.scrollIntoView({ behavior: "instant", block: "end" });
        }
    }, [props.height]);

    const NoteDOM = (note: Note) => {
        const className = "tap";

        return (
            <Rnd
                key={note.key}
                className={note.isSelect ? className + " selected" : className}
                position={{
                    x: note.pos * unitWidth + 1,
                    y: (measure - 1 - note.time) * unitHeight * 48 - 5,
                }}
                size={{ width: unitWidth * note.size - 1, height: 11 }}
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
                    UpdateNotePos(d.x, d.y, note.key);
                }}
                onResize={(_e, _direction, ref) => {
                    UpdateNoteSize(ref.offsetWidth, note.key);
                }}
                onMouseDown={(e: MouseEvent) => SelectNote(e, note.key)}
            ></Rnd>
        );
    };

    const UpdateNotePos = (x: number, y: number, key: number) => {
        props.setNotes(
            props.notes.map((note) => {
                if (note.key === key) {
                    const newPos = Math.round(x / unitWidth);
                    note.pos = 0 <= newPos && newPos <= 15 ? newPos : note.pos;

                    const interval = 1 / props.separate;
                    const newTime =
                        Math.round(y / (unitHeight * 48) / interval) * interval;
                    note.time =
                        0 <= newTime && newTime <= measure
                            ? measure - 1 - newTime
                            : note.time;
                }
                return note;
            }),
        );
    };

    const UpdateNoteSize = (width: number, key: number) => {
        props.setNotes(
            props.notes.map((note) => {
                if (note.key === key) {
                    note.size = Math.round(width / unitWidth);
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
        <div id="editor" style={{ height: height }}>
            <div className="notes" style={{ width: width }}>
                {props.notes.map((note: Note) => NoteDOM(note))}
            </div>

            <div className="measure">
                {Array(measure)
                    .fill(0)
                    .map((_, i) => {
                        return (
                            <p
                                style={{ bottom: unitHeight * 48 * i + 28 }}
                                key={i}
                            >
                                {i - 1}
                            </p>
                        );
                    })}
            </div>

            <div className="background">
                <div css={posLine(width)}></div>
                <div css={posLine2(width)}></div>
                <div css={noteLine(width, unitHeight, props.separate)}></div>
                <div
                    css={measureLine(width, unitHeight)}
                    style={{ top: 1 }}
                ></div>
            </div>
        </div>
    );
}

export default Editor;
