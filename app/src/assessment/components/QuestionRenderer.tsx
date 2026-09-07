import type {
  Answer,
  Question,
} from "../types";

interface QuestionRendererProps {
  question: Question;
  value?: Answer;
  onChange: (value: Answer) => void;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  switch (question.type) {
    case "text":
      return (
        <textarea
          className="question-textarea"
          value={
            typeof value === "string"
              ? value
              : ""
          }
          placeholder={question.placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={6}
        />
      );

    case "single_choice":
      return (
        <div className="option-list">
          {question.options?.map((option) => {
            const selected =
              value === option.value;

            return (
              <label
                key={option.value}
                className={`option ${
                  selected
                    ? "option-selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={selected}
                  onChange={() =>
                    onChange(option.value)
                  }
                />

                <span className="option-indicator">
                  {selected ? "◆" : "◇"}
                </span>

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );

    case "multiple_choice": {
      const selected = Array.isArray(value)
        ? value
        : [];

      return (
        <div className="option-list">
          {question.options?.map((option) => {
            const checked =
              selected.includes(option.value);

            return (
              <label
                key={option.value}
                className={`option ${
                  checked
                    ? "option-selected"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    if (checked) {
                      onChange(
                        selected.filter(
                          (item) =>
                            item !==
                            option.value,
                        ),
                      );
                    } else {
                      onChange([
                        ...selected,
                        option.value,
                      ]);
                    }
                  }}
                />

                <span className="option-indicator">
                  {checked ? "◆" : "◇"}
                </span>

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      );
    }

    case "scale": {
      const min = question.min ?? 1;
      const max = question.max ?? 10;

      const currentValue =
        typeof value === "number"
          ? value
          : min;

      return (
        <div className="scale-wrapper">
          <input
            className="scale-input"
            type="range"
            min={min}
            max={max}
            step={question.step ?? 1}
            value={currentValue}
            onChange={(event) =>
              onChange(
                Number(event.target.value),
              )
            }
          />

          <div className="scale-labels">
            <span>{min}</span>

            <strong>
              {currentValue}
            </strong>

            <span>{max}</span>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
