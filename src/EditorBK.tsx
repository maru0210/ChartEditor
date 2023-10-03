import { css } from "@emotion/react";

export const posLine = (width: number) => {
    return css`
        width: ${width}px;
        background-image: repeating-linear-gradient(
            90deg,
            gray,
            gray 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) calc((${width}px - 1px) / 16)
        );
    `;
};

export const posLine2 = (width: number) => {
    return css`
        width: ${width + 2}px;
        background-image: repeating-linear-gradient(
            90deg,
            gray,
            gray 3px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) calc((${width}px - 1px) / 4)
        );
    `;
};

export const measureLine = (width: number, unit: number) => {
    return css`
        width: ${width + 20}px;
        background-image: repeating-linear-gradient(
            0deg,
            gray,
            gray 3px,
            rgba(0, 0, 0, 0) 3px,
            rgba(0, 0, 0, 0) ${unit * 48}px
        );
    `;
};

export const noteLine = (width: number, unit: number, separate: number) => {
    return css`
        width: ${width + 20}px;
        background-image: repeating-linear-gradient(
            0deg,
            lightgray,
            lightgray 1px,
            rgba(0, 0, 0, 0) 1px,
            rgba(0, 0, 0, 0) ${(unit * 48) / separate}px
        );
    `;
};
