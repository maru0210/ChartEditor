import { Note } from "./types";

import "./css/Config.css";
import { useState } from "react";

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
  const [isCurve, setIsCurve] = useState<boolean>(false);

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

    const note0 = selectNotes[0];
    const note1 = selectNotes[1];

    const key = selectNotes[0].key;
    props.setNotes(() =>
      props.notes.map((note) => {
        if (note.key == key) {
          note.type = isCurve ? 11 : 10;
          // note.type = 10;
          note.data[0].isSelect = false;

          note.data.push({
            diff: (note1.time - note0.time) / 2,
            pos: (note0.data[0].pos + note0.data[0].size / 2 + note1.data[0].pos + note1.data[0].size / 2) / 2,
            size: 0,
            isSelect: false,
          });

          note.data.push({
            diff: note1.time - note0.time,
            pos: note1.data[0].pos,
            size: note1.data[0].size,
            isSelect: false,
          });
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

      <div id="separate">
        {[3, 4, 6, 8, 12, 16].map((val: number) => {
          return (
            <>
              <label key={val}>
                <input
                  className="with-gap"
                  name="separate"
                  type="radio"
                  checked={props.separate == val}
                  onChange={() => props.setSeparate(val)}
                ></input>
                <span>{val}</span>
              </label>
            </>
          );
        })}
      </div>

      <div id="defaultSize">
        <p>DefaultSize : {props.defaultSize}</p>
        <input
          type="range"
          min="1"
          max="16"
          value={props.defaultSize}
          onChange={(e) => props.setDefaultSize(Number(e.target.value))}
        />
      </div>

      <button className="waves-effect waves-light btn" onClick={() => DeleteNote()}>
        Delete
      </button>

      <div id="longNoteConf">
        <div className="switch">
          <label>
            isCurve
            <input type="checkbox" checked={isCurve} onChange={() => setIsCurve((old) => !old)} />
            <span className="lever"></span>
          </label>
        </div>
        <button className="waves-effect waves-light btn" onClick={() => ConectNotes()}>
          Conect
        </button>
      </div>
    </>
  );
}

export default Config;
