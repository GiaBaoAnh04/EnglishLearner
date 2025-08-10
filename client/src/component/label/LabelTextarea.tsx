interface LabelTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

export const LabelTextArea: React.FC<LabelTextAreaProps> = ({
  label,
  name,
  rows = 3,
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
      <textarea
        id={name}
        name={name}
        rows={rows}
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
          props.className || ""
        }`}
      />
    </div>
  );
};
