// LabelText.tsx
interface LabelTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode; // <- đổi từ string sang React.ReactNode
  name: string;
}

export const LabelText: React.FC<LabelTextProps> = ({
  label,
  name,
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
      <input
        id={name}
        name={name}
        {...props}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          props.className || ""
        }`}
      />
    </div>
  );
};
