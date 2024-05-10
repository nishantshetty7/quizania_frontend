import { useState } from "react";
import Heading from "./Heading";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JoinRoom } from "./LiveQuiz";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="livequiz" element={<JoinRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

const RootPage = () => {
  let rootText = "Hello World";
  const [count, setCount] = useState(0);

  const updateCount = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setCount(count + 1);
  };
  return (
    <>
      {count}
      <Heading title={rootText} updateCount={updateCount} />
    </>
  );
};

export default App;
