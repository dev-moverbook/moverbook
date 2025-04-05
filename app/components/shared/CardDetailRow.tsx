interface CardDetailRowProps {
  label: string;
  value: React.ReactNode;
}

const CardDetailRow: React.FC<CardDetailRowProps> = ({ label, value }) => {
  return (
    <div className="flex w-full justify-between md:justify-normal">
      <div className="md:w-[30rem] font-medium">{label}</div>
      <div>{value}</div>
    </div>
  );
};

export default CardDetailRow;
