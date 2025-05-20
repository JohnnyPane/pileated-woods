import { useFlash } from "../../context/FlashContext.jsx";
import './NumberPlusMinusInput.scss'

const NumberPlusMinusInput = ({ value, onChange, min, max, upperLimitMessage }) => {
  const { showNotification } = useFlash();
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    } else {
      showNotification({
        title: "Max quantity reached",
        message: upperLimitMessage || "You have reached the maximum quantity.",
        color: "yellow",
      });
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="number-plus-minus-input">
      <button type="button" onClick={handleDecrement} disabled={value <= min}>
        -
      </button>
      <input
        type="number"
        className="no-spinner"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
      />
      <button type="button" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}

export default NumberPlusMinusInput;