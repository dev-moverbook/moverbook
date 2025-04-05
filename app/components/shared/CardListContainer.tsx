import { ReactNode } from "react";

interface CardListContainerProps {
  children: ReactNode;
  className?: string;
}

const CardListContainer: React.FC<CardListContainerProps> = ({
  children,
  className = "",
}) => {
  return <ul className={`space-y-4 ${className}`}>{children}</ul>;
};

export default CardListContainer;
