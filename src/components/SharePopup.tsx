import React, { MutableRefObject } from "react"

import QRCode from "react-qr-code";
import logo from "../assets/card_logo.png"
import Constants from "../constants";

const Share: React.FC<{id: string}> = ({id}) => {
    return (
        <div style={{textAlign: "center"}}>
            <QRCode value={"https://" + Constants.HOSTNAME + "/view/" + id} size={230} fgColor="#0373fc" />
            <br></br>
            <img src={logo} style={{width: 200}} />
        </div>    
    )
}

export default Share;