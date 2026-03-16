import React from "react";
import { ArrowBigRight } from "lucide-react";


const Button = ({ text, classname }: any) => {
    return (
        <div className={classname}>
            {text}
            <ArrowBigRight className="w-5 h-5"/>
        </div>
    )
}
export default Button;