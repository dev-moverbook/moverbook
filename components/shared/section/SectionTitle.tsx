interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className }) => {
  return (
    <h2
      className={`text-2xl font-medium  mb-4 text-left mt-4 max-w-screen-sm px-4 md:px-0 mx-auto ${className ?? ""}`}
    >
      {children}
    </h2>
  );
};

export default SectionTitle;
