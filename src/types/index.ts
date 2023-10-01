export type ChartJson = {
    track: number;
    title: string;
    artist: string;
    bpm: number;
    notes: NoteJson[];
};

export type NoteJson = {
    time: number;
    pos: number;
    data: DataJson[];
};

export type DataJson = {
    pos: number;
    size: number;
}

export type SongInfo = {
    track: number;
    title: string;
    artist: string;
    bpm: number;
    incompMeasure: number;
};

export type Note = {
    time: number;
    type: string;
    size: number;
    pos: number;

    key: number;
    isSelect: boolean;
};

// export type Note = {
//     time: number;
//     type: number;
//     data: Data[];

//     key: number;
// };

// export type Data = {
//     diff: number;
//     pos: number;
//     size: number;

//     isSelect: boolean;
// };
