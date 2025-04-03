const SectionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b border-grayCustom shadow-sm space-y-4 pb-8">
      {children}
    </div>
  );
};

export default SectionContainer;
