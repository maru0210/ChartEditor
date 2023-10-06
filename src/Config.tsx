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
  defaultType: number;
  setDefaultType: React.Dispatch<React.SetStateAction<number>>;
};

function Config(props: Props) {
  const types0: [string, number][] = [
    ["TAP", 0],
    ["ExTAP", 1],
    ["FLICK", 2],
  ];

  const types1: [string, number][] = [
    ["STRAIGHT", 10],
    ["CURVE", 11],
  ];

  const [isCurve, setIsCurve] = useState<boolean>(false);

  const getSelectNotes = (): Note[] => {
    const selectNotes: Note[] = [];
    props.notes.map((note) => {
      for (let i = 0; i < note.data.length; i++) {
        if (note.data[i].isSelect) {
          selectNotes.push(note);
          break;
        }
      }
    });

    return selectNotes;
  };

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

  const ChangeNoteType = (key: number, type: number) => {
    props.setNotes(() =>
      props.notes.map((note) => {
        if (note.key == key) {
          note.type = type;
        }
        return note;
      }),
    );
  };

  return (
    <div id="config">
      <div className="top">
        <div id="noteSetting">
          <button className="waves-effect waves-light btn btn-del" onClick={() => DeleteNote()}>
            Delete
          </button>

          <div id="longNoteConf">
            <button className="waves-effect waves-light btn" onClick={() => ConectNotes()}>
              Conect
            </button>
            <div className="switch">
              <label>
                Curve
                <input type="checkbox" checked={isCurve} onChange={() => setIsCurve((old) => !old)} />
                <span className="lever"></span>
              </label>
            </div>
          </div>
        </div>

        <div id="selectedNoteSetting">
          <div id="type">
            {(() => {
              const SelectNote: Note[] = getSelectNotes();
              if (SelectNote.length != 1) {
                return (
                  <>
                    <p className="not-found">Please select 1 Notes.</p>
                  </>
                );
              } else if (SelectNote.length == 1) {
                if ([0, 1, 2].includes(SelectNote[0].type)) {
                  return (
                    <>
                      {types0.map((type: [string, number]) => {
                        return (
                          <>
                            <label>
                              <input
                                className="with-gap"
                                name="type"
                                type="radio"
                                checked={SelectNote[0].type == type[1]}
                                onChange={() => ChangeNoteType(SelectNote[0].key, type[1])}
                              ></input>
                              <span>{type[0]}</span>
                            </label>
                          </>
                        );
                      })}
                    </>
                  );
                } else if ([10, 11].includes(SelectNote[0].type)) {
                  return (
                    <>
                      {types1.map((type: [string, number]) => {
                        return (
                          <>
                            <label>
                              <input
                                className="with-gap"
                                name="type"
                                type="radio"
                                checked={SelectNote[0].type == type[1]}
                                onChange={() => ChangeNoteType(SelectNote[0].key, type[1])}
                              ></input>
                              <span>{type[0]}</span>
                            </label>
                          </>
                        );
                      })}
                    </>
                  );
                }
              }
            })()}
          </div>
        </div>
      </div>

      <div className="bottom">
        <div id="defaultNote">
          <div id="defaultType">
            <p>DefaultType : {types0[props.defaultType][0]}</p>
            {types0.map((type: [string, number]) => {
              return (
                <>
                  <label>
                    <input
                      className="with-gap"
                      name="defaultType"
                      type="radio"
                      checked={props.defaultType == type[1]}
                      onChange={() => props.setDefaultType(type[1])}
                    ></input>
                    <span>{type[0]}</span>
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
        </div>

        <div id="editorSetting">
          <div id="separate">
            <p>Separate : {props.separate}</p>
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
        </div>
      </div>
    </div>
  );
}

export default Config;
