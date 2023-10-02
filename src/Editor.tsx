import { Rnd } from "react-rnd";
import { css } from "@emotion/react";
import { Note } from "./types";

import "./css/Editor.css";

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

function NewRnd(
    note: Note,
    measure: number,
    UpdateNotePos: (x: number, y: number, key: number) => void,
    UpdateNoteSize: (width: number, key: number) => void,
    SelectNote: (e: MouseEvent, key: number) => void,
) {
    let height: number = 1;
    let className: string = "";
    if (note.type == "TAP") {
        className = "tap";
        height = 13;
    } else if (note.type == "CONECT") {
        className = "conect";
        height = 1;
    }

    return (
        <Rnd
            key={note.key}
            className={note.isSelect ? className + " selected" : className}
            position={{
                x: note.pos * 37.5 + 180,
                y:
                    ((measure + 2) * 4 - note.time) * 101.2 +
                    (56.5 - height / 2),
            }}
            size={{ width: note.size * 37.5 - 1.5, height: height }}
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
}

function Editor(props: Props) {
    const measure = 20 + 2;

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

    const width: number = Math.round((props.width - 80 - 17) / 16) * 16 + 1;
    const unit: number = Math.round((props.height - 1) / 120);
    const height: number = unit * 48 * measure + 1;

    const posLine = css`
        width: ${width}px;
        background-image: repeating-linear-gradient(
            90deg,
            gray,
            gray 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) calc((${width}px - 1px) / 16)
        );
    `;

    const noteLine = css`
        width: ${width + 20}px;
        background-image: repeating-linear-gradient(
            0deg,
            lightgray,
            lightgray 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) ${(unit * 48) / 4}px
        );
    `;

    const measureLine = css`
        width: ${width + 20}px;
        background-image: repeating-linear-gradient(
            0deg,
            gray,
            gray 3px,
            rgba(0, 0, 0, 0) 3px,
            rgba(0, 0, 0, 0) ${unit * 48}px
        );
    `;

    return (
        <div id="editor" style={{ height: height }}>
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
                {Array(measure)
                    .fill(0)
                    .map((_, i) => {
                        return (
                            <p
                                style={{ top: unit * 48 * (measure - i) - 25 }}
                                key={i}
                            >
                                {i - 1}
                            </p>
                        );
                    })}
            </div>

            <div className="background">
                <div css={posLine}></div>
                <div css={noteLine}></div>
                <div css={measureLine} style={{ top: 1 }}></div>
            </div>
        </div>
    );
}

export default Editor;
