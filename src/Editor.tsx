import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

import { Data, Note } from "./types";
import { measureLine, noteLine, posLine, posLine2 } from "./EditorBK";

import "./css/Editor.css";
import { LongCrvSvg, LongStSvg } from "./SVG";

type Props = {
  height: number;
  width: number;

  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  noteKey: number;
  setNoteKey: React.Dispatch<React.SetStateAction<number>>;

  separate: number;
  measure: number;
  defaultSize: number;
};

function Editor(props: Props) {
  const measure = props.measure + 2;

  const unitWidth: number = Math.round((props.width - 80 - 17) / 16);
  const width: number = unitWidth * 16 + 1;
  const unitHeight: number = Math.round((props.height - 1) / 120);
  const height: number = unitHeight * 48 * measure + 1;

  const divNotes = useRef<HTMLDivElement>(null);

  const [canNewNote, setCanNewNote] = useState<boolean>(true);

  // 一番下までスクロール
  useEffect(() => {
    const target = document.getElementById("editor");
    if (target) {
      target.scrollIntoView({ behavior: "instant", block: "end" });
    }
  }, [props.height]);

  const NewNote = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (canNewNote == false) {
      setCanNewNote(() => true);
      return;
    }

    const clientRect = divNotes.current?.getBoundingClientRect();
    if (clientRect == undefined) return;

    const x = e.clientX - clientRect.left;
    const y = clientRect.top * -1 + e.clientY;

    let pos = Math.round(x / unitWidth - props.defaultSize / 2);
    if (pos < 0) pos = 0;
    if (15 < pos + props.defaultSize) pos = 16 - props.defaultSize;

    const iv = 1 / props.separate;
    const time = measure - 1 - Math.round(y / (unitHeight * 48) / iv) * iv;

    const _note: Note = {
      time: time,
      type: 0,
      data: [
        {
          diff: 0,
          pos: pos,
          size: props.defaultSize,
          isSelect: true,
        },
      ],

      key: props.noteKey,
    };
    props.setNotes((old) => [...UnSelectAllNotes(old), _note]);
    props.setNoteKey((old) => old + 1);
  };

  const NoteDOM = (note: Note) => {
    const resizeSetting = {
      top: false,
      right: true,
      bottom: false,
      left: false,
      topRight: false,
      bottomRight: false,
      topLeft: false,
      bottomLeft: false,
    };

    const className: string = `type${note.type}`;
    const noteData: Data[] = note.data;

    const object: ReactElement[] = [];

    noteData.forEach((data, i) => {
      if (note.type != 11 && i % 2) return;

      if (i % 2 == 0) {
        object.push(
          <Rnd
            key={note.key * 100 + 1 + i}
            className={data.isSelect ? className + " selected" : className}
            position={{
              x: data.pos * unitWidth + 1,
              y: (measure - 1 - note.time - data.diff) * unitHeight * 48 - 6,
            }}
            size={{ width: unitWidth * data.size - 1, height: 13 }}
            enableResizing={resizeSetting}
            onDragStop={(_e, d) => UpdateNotePos(d.x, d.y, note.key, i)}
            onResizeStart={() => setCanNewNote(() => false)}
            onResizeStop={(_e, _d, ref) => UpdateNoteSize(ref.offsetWidth, note.key, i)}
            onMouseDown={(e) => {
              setCanNewNote(() => false);
              SelectNote(e, note.key, i);
            }}
          ></Rnd>,
        );
      } else {
        object.push(
          <Rnd
            key={note.key * 100 + 1 + i}
            className={data.isSelect ? className + " selected" : className}
            position={{
              x: data.pos * unitWidth - 6,
              y: (measure - 1 - note.time - data.diff) * unitHeight * 48 - 6,
            }}
            size={{ width: 13, height: 13 }}
            enableResizing={false}
            onDragStop={(_e, d) => UpdateNotePos(d.x, d.y, note.key, i)}
            onMouseDown={() => setCanNewNote(() => false)}
          ></Rnd>,
        );
      }
    });

    if (note.type == 10) {
      object.unshift(LongStSvg(width, height, unitWidth, unitHeight, note, measure));
    } else if (note.type == 11) {
      object.unshift(LongCrvSvg(width, height, unitWidth, unitHeight, note, measure));
    }

    return (
      <div className="note" key={note.key * 100}>
        {object}
      </div>
    );
  };

  const UpdateNotePos = (x: number, y: number, key: number, dataIndex: number) => {
    props.setNotes(
      props.notes.map((note) => {
        if (note.key == key) {
          const newPos = Math.round(x / unitWidth);
          if (0 <= newPos && newPos + note.data[dataIndex].size <= 16) {
            note.data[dataIndex].pos = newPos;
          }

          const interval = 1 / props.separate;
          const newTime = measure - 1 - Math.round(y / (unitHeight * 48) / interval) * interval;
          if (-1 <= newTime && newTime <= measure - 1) {
            if (note.type == 0) {
              note.time = newTime;
            } else if (note.type == 10 || note.type == 11) {
              if (dataIndex == 0) {
                if (note.time + note.data[2].diff > newTime) {
                  note.data.forEach((data, i) => {
                    if (i != 0 && i % 2 == 0) data.diff += note.time - newTime;
                  });
                  note.time = newTime;
                }
              } else if (dataIndex == note.data.length - 1) {
                if (note.time + note.data[dataIndex - 2].diff < newTime) {
                  note.data[dataIndex].diff = newTime - note.time;
                }
              } else if (dataIndex % 2 == 1) {
                if (
                  note.time + note.data[dataIndex - 1].diff <= newTime &&
                  newTime <= note.time + note.data[dataIndex + 1].diff
                ) {
                  note.data[dataIndex].diff = newTime - note.time;
                }
              }
            }
          }
        }
        return note;
      }),
    );
  };

  const UpdateNoteSize = (width: number, key: number, dataIndex: number) => {
    props.setNotes(
      props.notes.map((note) => {
        if (note.key === key) {
          note.data[dataIndex].size = Math.round(width / unitWidth);
        }
        return note;
      }),
    );
  };

  const SelectNote = (e: MouseEvent, key: number, dataIndex: number) => {
    // metaKey: (Mac)CommandKey, (Win)WindowsKey
    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      props.setNotes(
        props.notes.map((note) => {
          if (note.key == key) {
            note.data[dataIndex].isSelect = !note.data[dataIndex].isSelect;
          }
          return note;
        }),
      );
    } else {
      props.setNotes(
        UnSelectAllNotes(props.notes).map((note) => {
          if (note.key == key) {
            note.data[dataIndex].isSelect = true;
          }
          return note;
        }),
      );
    }
  };

  const UnSelectAllNotes = (_notes: Note[]) => {
    return _notes.map((note) => {
      note.data.map((data) => {
        data.isSelect = false;
        return data;
      });
      return note;
    });
  };

  return (
    <div id="editor" style={{ height: height }}>
      <div className="notes" style={{ width: width }} onMouseUp={(e) => NewNote(e)} ref={divNotes}>
        {props.notes.map((note: Note) => NoteDOM(note))}
      </div>

      <div className="measure">
        {Array(measure)
          .fill(0)
          .map((_, i) => {
            return (
              <p style={{ bottom: unitHeight * 48 * i + 28 }} key={i}>
                {i - 1}
              </p>
            );
          })}
      </div>

      <div className="background">
        <div css={posLine(width)}></div>
        <div css={posLine2(width)}></div>
        <div css={noteLine(width, unitHeight, props.separate)}></div>
        <div css={measureLine(width, unitHeight)} style={{ top: 1 }}></div>
      </div>
    </div>
  );
}

export default Editor;
