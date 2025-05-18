interface ErrorComponentProps {
  message?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "An unexpected error occurred. Please try again later.",
}) => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 text-center px-6">
      <h1 className="text-3xl font-bold text-red-500 ">Something went wrong</h1>
      <p className="text-lg text-gray-300">{message}</p>
    </div>
  );
};

export default ErrorComponent;
