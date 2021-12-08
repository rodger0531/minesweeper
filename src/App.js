// import "./App.css";

function App() {
  const onClickBlock = () => {
    console.log("clicked");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="flex items-center justify-center bg-gray-100 p-12 rounded ">
        <div className="grid grid-cols-10">
          {new Array(10 * 10).fill().map((_, idx) => (
            <div
              key={idx}
              className="h-6 w-6 m-px bg-gray-400 shadow-inner"
              onClick={onClickBlock}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
