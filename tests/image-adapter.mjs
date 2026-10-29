import React from "react";
export default function Image({ src, alt, width, height, sizes, className }) {
  return React.createElement("img", { src, alt, width, height, sizes, className });
}
