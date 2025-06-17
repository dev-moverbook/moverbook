const SingleCardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-w-screen-sm flex-wrap gap-4 ">{children}</div>
  );
};

export default SingleCardContainer;
