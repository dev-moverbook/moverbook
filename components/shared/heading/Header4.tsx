import clsx from "clsx";

interface Header4Props {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  button?: React.ReactNode;
}

const Header4: React.FC<Header4Props> = ({
  children,
  className,
  wrapperClassName,
  button,
}) => {
  return (
    <div
      className={clsx("flex justify-between items-center", wrapperClassName)}
    >
      <h4 className={clsx("text-white text-2xl font-medium", className)}>
        {children}
      </h4>
      {button}
    </div>
  );
};

export default Header4;
