"use client";

import { motion } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

interface SelectableButtonProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

const SelectableButton = ({
  options,
  selected,
  onChange,
}: SelectableButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative"
    >
      <motion.select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.15 }}
        className="
          appearance-none
          rounded-md
          border border-[#2d2d2d]
          bg-[#252526]
          px-3 py-1.5 pr-8
          text-sm text-[#d4d4d4]
          outline-none
          cursor-pointer
          transition-colors
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#252526] text-[#d4d4d4]"
          >
            {option.label}
          </option>
        ))}
      </motion.select>

      {/* Animated dropdown arrow */}
      <motion.span
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9da0a6]"
        initial={{ rotate: 0 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.15 }}
      >
        ▼
      </motion.span>
    </motion.div>
  );
};

export default SelectableButton;
