interface Option {
  value: string;
  label: string;
}

interface LabelSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  name: string;
  options: Option[];
}

export const LabelSelect: React.FC<LabelSelectProps> = ({
  label,
  name,
  options,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          props.className || ""
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
