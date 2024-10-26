import { obtenerCollecion } from "./Database";
import { obtenerRealTime } from "./RealtTime";

export const consultas = (listaConsulta, consultaActual = 0) => {
  let numeroConsultas = listaConsulta.length;

  if (numeroConsultas > consultaActual) {
    selectorConsulta(listaConsulta[consultaActual]);

    let nuevaConsulta = consultaActual + 1;
    consultas(listaConsulta, nuevaConsulta);
  }
};

const selectorConsulta = ({ consulta, collectionName }) => {
  switch (consulta) {
    case "obtenerRealTime":
      obtenerRealTime(collectionName);
      break;

    default:
      break;
  }
};
