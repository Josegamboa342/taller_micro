const DOMAIN_URL = "http://127.0.0.1:8000/api";
const notasForm = document.forms["notasForm"];
const tabla = document.getElementById("notas");
let notas = [];
const cargarNotas = () => {
    fetch(`${DOMAIN_URL}/pepito/notas`)
      .then((response) =>
        response.status == 404 ? alert("Error en el servicio") : response.json()
      )
      .then((body) => {
        notas = body.data;
        const tbody = tabla.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";
        notas.forEach(nota => {
          const tr = document.createElement('tr');
  
          const tdActividad = document.createElement('td');
          tdActividad.textContent = nota.actividad;
          const tdNota = document.createElement('td');
          tdNota.textContent = nota.nota;
          const tdcodEstudiante= document.createElement('td');
          tdcodEstudiante.textContent = nota.codEstudiante;
  
          tr.appendChild(tdActividad);
          tr.appendChild(tdNota);
          tr.appendChild(tdcodEstudiante);
          tbody.appendChild(tr);
        });
      })
      .finally(() => console.log("Respuesta del servicio fin"));
  };
  
  cargarNotas();
  
  console.log(notas);
