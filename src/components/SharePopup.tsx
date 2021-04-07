import React, { MutableRefObject } from "react"

import QRCode from "react-qr-code";
import logo from "../assets/card_logo.png"
import Constants from "../constants";

interface ShareProps {
    id: string
}

const Share = React.forwardRef<HTMLDivElement, ShareProps>((props, ref) => {
    const { id } = props;

    return (
        <div ref={ref} style={{textAlign: "center"}}>
            <QRCode value={"https://" + Constants.HOSTNAME + "/view/" + id} size={400} fgColor="#0373fc" />
            <br></br>
            <img src={logo} style={{width: 370}} />
        </div>    
    )
});

export default Share;