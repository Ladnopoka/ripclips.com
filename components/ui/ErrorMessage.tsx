interface ErrorMessageProps {
  errors: string[];
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, className = "" }) => {
  if (errors.length === 0) return null;

  return (
    <div 
      className={`bg-red-900/20 border border-red-500 rounded-lg p-3 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {errors.length === 1 ? (
        <p className="text-red-300 text-sm">{errors[0]}</p>
      ) : (
        <ul className="text-red-300 text-sm space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};