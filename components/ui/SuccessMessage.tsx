interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div 
      className={`bg-green-900/20 border border-green-500 rounded-lg p-3 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-green-300 text-sm">{message}</p>
    </div>
  );
};