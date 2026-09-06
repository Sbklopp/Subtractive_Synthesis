const SLIDER_MIN = 0;
const SLIDER_MAX = 1000;
const SLIDER_MIDPOINT = 500;

const MIN_FREQUENCY = 12;
const MID_FREQUENCY = 500;
const MAX_FREQUENCY = 12000;

interface FilterCutoffControlProps {
  frequency: number;
  onChange: (frequency: number) => void;
}

const interpolateExponentially = (
  start: number,
  end: number,
  amount: number,
): number => {
  return start * Math.pow(end / start, amount);
};

const sliderPositionToFrequency = (
  position: number,
): number => {
  if (position <= SLIDER_MIDPOINT) {
    const amount =
      position / SLIDER_MIDPOINT;

    return Math.round(
      interpolateExponentially(
        MIN_FREQUENCY,
        MID_FREQUENCY,
        amount,
      ),
    );
  }

  const amount =
    (position - SLIDER_MIDPOINT) /
    (SLIDER_MAX - SLIDER_MIDPOINT);

  return Math.round(
    interpolateExponentially(
      MID_FREQUENCY,
      MAX_FREQUENCY,
      amount,
    ),
  );
};

const frequencyToSliderPosition = (
  frequency: number,
): number => {
  const safeFrequency = Math.min(
    Math.max(frequency, MIN_FREQUENCY),
    MAX_FREQUENCY,
  );

  if (safeFrequency <= MID_FREQUENCY) {
    const amount =
      Math.log(safeFrequency / MIN_FREQUENCY) /
      Math.log(MID_FREQUENCY / MIN_FREQUENCY);

    return Math.round(
      amount * SLIDER_MIDPOINT,
    );
  }

  const amount =
    Math.log(safeFrequency / MID_FREQUENCY) /
    Math.log(MAX_FREQUENCY / MID_FREQUENCY);

  return Math.round(
    SLIDER_MIDPOINT +
      amount * (SLIDER_MAX - SLIDER_MIDPOINT),
  );
};

const formatFrequency = (frequency: number): string => {
  if (frequency < 1000) {
    return `${frequency} Hz`;
  }

  const precision = frequency < 10000 ? 2 : 1;

  return `${(frequency / 1000).toFixed(precision)} kHz`;
};

export const FilterCutoffControl = ({
  frequency,
  onChange,
}: FilterCutoffControlProps) => {
  return (
    <div>
      <label htmlFor="filter-cutoff">
        Cutoff: {formatFrequency(frequency)}
      </label>

      <input
        id="filter-cutoff"
        type="range"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step="1"
        value={frequencyToSliderPosition(frequency)}
        onChange={(event) => {
          const position = Number(event.target.value);

          onChange(sliderPositionToFrequency(position));
        }}
      />
    </div>
  );
};