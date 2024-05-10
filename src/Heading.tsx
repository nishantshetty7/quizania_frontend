type HeadingProps = {
  title: string;
  updateCount: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Heading = ({ title, updateCount }: HeadingProps) => {
  return (
    <>
      <div>{title}</div>
      <button onClick={updateCount}>Increment</button>
    </>
  );
};

export default Heading;
