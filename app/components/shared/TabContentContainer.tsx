interface TabContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const TabContentContainer: React.FC<TabContentContainerProps> = ({
  children,
  className,
}) => {
  return <div className={`mt-4 ${className ?? ""}`}>{children}</div>;
};

export default TabContentContainer;
