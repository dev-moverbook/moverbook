const CenteredContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col max-w-2xl mx-auto px-4 md:px-2">
      {children}
    </div>
  );
};

export default CenteredContainer;
