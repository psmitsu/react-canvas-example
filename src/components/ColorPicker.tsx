import { useId } from "react";

type ColorPickerProps = {
  color: string,
  handleColorChange: (color: string) => void,
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, handleColorChange }) => {
  const id = useId();

  const rgbTuple = hexToRgb(color);
  if (rgbTuple === null) {
    throw new Error('Wrong color value');
  }
  const { r, g, b } = rgbTuple;

  return (
  <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
      }}
  >
      <label htmlFor={`R-${id}`}>R</label>
      <input
        type="range"
        id={`R-${id}`}
        min={0}
        max={255}
        value={r}
        onChange={(e) => handleColorChange(rgbToHex(parseInt(e.target.value), g, b))}
      />
      <label htmlFor={`G-${id}`}>G</label>
      <input
        type="range"
        id={`G-${id}`}
        min={0}
        max={255}
        value={g}
        onChange={(e) => handleColorChange(rgbToHex(r, parseInt(e.target.value),b))}
      />
      <label htmlFor={`B-${id}`}>B</label>
      <input
        type="range"
        id={`B-${id}`}
        min={0}
        max={255}
        value={b}
        onChange={(e) => handleColorChange(rgbToHex(r, g, parseInt(e.target.value)))}
      />
  </div>
  );
}

export { ColorPicker }

// stolen from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
