import { ChangeEvent } from "react";
import { SongInfo } from "./types";

import "./css/Info.css";

type Props = {
    info: SongInfo;
    SetSongInfo: React.Dispatch<React.SetStateAction<SongInfo>>;
};

function Info(props: Props) {
    const SetSongInfo = (e: ChangeEvent<HTMLInputElement>) => {
        props.SetSongInfo((old: SongInfo) => ({
            ...old,
            [e.target.id]: e.target.value,
        }));
    };

    return (
        <>
            <div className="input-field">
                <input
                    id="track"
                    value={props.info.track}
                    onChange={(e) => SetSongInfo(e)}
                    type="number"
                    className="validate"
                ></input>
                <label htmlFor="track" className="active">
                    Track Number
                </label>
            </div>
            <div className="input-field">
                <input
                    id="title"
                    value={props.info.title}
                    onChange={(e) => SetSongInfo(e)}
                    type="text"
                    className="validate"
                ></input>
                <label htmlFor="title" className="active">
                    Title
                </label>
            </div>
            <div className="input-field">
                <input
                    id="artist"
                    value={props.info.artist}
                    onChange={(e) => SetSongInfo(e)}
                    type="text"
                    className="validate"
                ></input>
                <label htmlFor="artist" className="active">
                    Artist
                </label>
            </div>
            <div className="input-field">
                <input
                    id="bpm"
                    type="number"
                    value={props.info.bpm}
                    onChange={(e) => SetSongInfo(e)}
                    className="validate"
                ></input>
                <label htmlFor="bpm" className="active">
                    BPM
                </label>
            </div>
            <div className="input-field">
                <input
                    id="incompMeasure"
                    value={props.info.incompMeasure}
                    onChange={(e) => SetSongInfo(e)}
                    type="number"
                    className="validate"
                ></input>
                <label htmlFor="incompMeasure" className="active">
                    Incomplete Measure
                </label>
            </div>
        </>
    );
}

export default Info;
