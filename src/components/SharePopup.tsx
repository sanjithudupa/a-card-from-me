import React, { MutableRefObject } from "react"

import QRCode from "react-qr-code";
// import logo from "../assets/images/card_logo.png";
import Constants from "../constants";

interface ShareProps {
    id: string,
    logo: string
}

const Share = React.forwardRef<HTMLDivElement, ShareProps>((props, ref) => {
    const { id, logo } = props;

    return (
        <div ref={ref} style={{textAlign: "center"}}>
            <QRCode value={"https://" + Constants.HOSTNAME + "/redirect?to=" + id} size={400} fgColor="#0373fc" />
            <br></br>
            <img src={logo} style={{width: 370}} />
        </div>    
    )
});

export default Share;