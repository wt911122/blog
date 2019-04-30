import React from "react"
import "./blinkfont.less"

export default ({content, fontStyle}) => {
    return content.split(' ').map((txt, idx) => {
        return (
            <>
            {
                txt.split('').map((word) =>
                <div className={`letter delay-${idx*2+1}`} style={fontStyle}>{word}</div>)
            }
            <br />
            </>
        )
    });
}