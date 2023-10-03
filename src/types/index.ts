export type ChartJson = {
    track: number;
    title: string;
    artist: string;
    bpm: number;
    incompMeasure: number;
    notes: NoteJson[];
};

export type NoteJson = {
    time: number;
    type: number;
    data: DataJson[];
};

export type DataJson = {
    diff: number;
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
    type: number;
    data: Data[];

    key: number;
};

export type Data = {
    diff: number;
    pos: number;
    size: number;

    isSelect: boolean;
};
