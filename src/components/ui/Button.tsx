import React from "react";
import { ArrowBigRight } from "lucide-react";
interface ButtonProps {
    text: string;
}

const Button = ({text}: ButtonProps) => {
    return (
        <div className="flex items-center gap-1 bg-white text-black px-2 py-1 text-lg w-fit rounded-xl cursor-pointer
hover:scale-110 hover:bg-black hover:text-white
transition-all duration-300 active:scale-100">
  {text}
  <ArrowBigRight className="w-5 h-5" />
</div>
    )
}
export default Button;