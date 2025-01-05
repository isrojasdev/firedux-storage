import { useEffect } from "react";
import { executeQueries } from "firedux-storage";

import { useSelector } from "react-redux";

const App = () => {
  const { subCategorias } = useSelector((state) => state.firestore.collection);

  // executeQueries([
  //   {
  //     queryType: "obtainRealTime",
  //     collectionName: "subCategorias",
  //   },
  // ]);

  const buscar = () => {
    executeQueries([
      {
        queryType: "obtainRealTime",
        collectionName: "subCategorias",
      },
    ]);
  };

  useEffect(() => {
    console.log({ subCategorias });
  }, [subCategorias]);

  return (
    <div className="App">
      <h1>Firedux</h1>

      <button onClick={buscar}>Buscar</button>
    </div>
  );
};

export default App;
