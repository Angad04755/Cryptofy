"use client";

import { motion } from "framer-motion";

const SelectableButton = ({
  options,
  selected,
  onChange,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative inline-block"
    >
      <motion.select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        whileHover={{ scale: 1.03 }}
        whileFocus={{ scale: 1.03 }}
        transition={{ duration: 0.15 }}
        className="
        appearance-none
        rounded-lg
        border border-[#3c3c3c]
        bg-gradient-to-b from-[#2b2b2b] to-[#1f1f1f]
        px-4 py-2 pr-10
        text-sm font-medium text-[#e5e5e5]
        shadow-md
        outline-none
        cursor-pointer
        transition-all duration-200
        hover:border-[#6b7280]
        focus:ring-2 focus:ring-indigo-500
        "
      >
        {options.map((option: any) => {
          return (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#1f1f1f] text-[#e5e5e5]"
            >
              {option.label}
            </option>
          );
        })}
      </motion.select>

      {/* Animated Arrow */}
      <motion.span
        className="
        pointer-events-none
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-gray-400
        text-xs
        "
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        ▼
      </motion.span>
    </motion.div>
  );
};

export default SelectableButton;