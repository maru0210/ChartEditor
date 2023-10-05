import { Note } from "./types";

const noteLeft = (unitWidth: number, note: Note, dataIndex: number) => {
  return unitWidth * note.data[dataIndex].pos + 2;
};

const noteRight = (unitWidth: number, note: Note, dataIndex: number) => {
  return unitWidth * (note.data[dataIndex].pos + note.data[dataIndex].size) - 1;
};

const notePosY = (unitHeight: number, measure: number, note: Note, dataIndex: number) => {
  const measureHeight = unitHeight * 48;
  return measureHeight * (measure - 1 - (note.time + note.data[dataIndex].diff));
};

const controlLeft = (unitWidth: number, note: Note, dataIndex: number) => {
  return unitWidth * (note.data[dataIndex].pos - (note.data[dataIndex - 1].size + note.data[dataIndex + 1].size) / 4) + 1;
};

const controlRight = (unitWidth: number, note: Note, dataIndex: number) => {
  return unitWidth * (note.data[dataIndex].pos + (note.data[dataIndex - 1].size + note.data[dataIndex + 1].size) / 4);
};

const controlPosY = (unitHeight: number, measure: number, note: Note, dataIndex: number) => {
  const measureHeight = unitHeight * 48;
  return measureHeight * (measure - 1 - (note.time + note.data[dataIndex].diff));
};

export const LongStSvg = (
  width: number,
  height: number,
  unitWidth: number,
  unitHeight: number,
  note: Note,
  measure: number,
) => {
  return (
    <>
      <svg width={width} height={height} key={note.key * 100 + 10} className="longSt">
        <path
          d={`M ${noteLeft(unitWidth, note, 0)} ${notePosY(unitHeight, measure, note, 0)}
              L ${noteLeft(unitWidth, note, 2)} ${notePosY(unitHeight, measure, note, 2)}
              L ${noteRight(unitWidth, note, 2)} ${notePosY(unitHeight, measure, note, 2)}
              L ${noteRight(unitWidth, note, 0)} ${notePosY(unitHeight, measure, note, 0)}`}
          stroke="green"
        />
      </svg>
      ,
    </>
  );
};

export const LongCrvSvg = (
  width: number,
  height: number,
  unitWidth: number,
  unitHeight: number,
  note: Note,
  measure: number,
) => {
  return (
    <>
      <svg width={width} height={height} key={note.key * 100 + 10} className="longCrv">
        <path
          d={`M ${noteLeft(unitWidth, note, 0)} ${notePosY(unitHeight, measure, note, 0)} 
              Q ${controlLeft(unitWidth, note, 1)} ${controlPosY(unitHeight, measure, note, 1)} 
                ${noteLeft(unitWidth, note, 2)} ${notePosY(unitHeight, measure, note, 2)}  
              L ${noteRight(unitWidth, note, 2)} ${notePosY(unitHeight, measure, note, 2)}
              Q ${controlRight(unitWidth, note, 1)} ${controlPosY(unitHeight, measure, note, 1)} 
                ${noteRight(unitWidth, note, 0)} ${notePosY(unitHeight, measure, note, 0)}`}
          stroke="blue"
        />
      </svg>
      ,
    </>
  );
};
