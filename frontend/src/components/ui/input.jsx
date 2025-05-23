import React from "react";

export function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
}
