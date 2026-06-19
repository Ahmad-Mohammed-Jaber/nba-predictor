interface ErrorMessageProps {
  message: string;
  variant?: 'alert' | 'compact';
}

const ErrorMessage = ({ message, variant = 'alert' }: ErrorMessageProps) => {
  if (variant === 'compact') {
    return (
      <div className="text-red-500 text-sm p-2 bg-red-100 rounded border border-red-200">
        {message}
      </div>
    );
  }

  return (
    <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
      {message}
    </div>
  );
};

export default ErrorMessage;
