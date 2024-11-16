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


  function guardarTarea() {
    // Obtener el formulario
    const form = document.forms['notasForm'];

    // Obtener los valores del formulario
    const cod = form['cod'].value;
    const nombres = form['nombres'].value;
    const email = form['email'].value;

    // Crear un objeto con los datos del formulario
    const formData = {
        cod: cod,
        nombre: nombres,
        email: email
    };
    // Enviar los datos usando fetch
    fetch("http://127.0.0.1:8000/api/pepito/estudiante", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convertir el objeto a JSON
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Estudiante guardado con éxito:", data);
            alert("Estudiante guardado correctamente");
            form.reset(); // Opcional: reiniciar el formulario
        })
        .catch((error) => {
            console.error("Es este:", error);
            alert("Hubo un problema al guardar el estudiante");
        });

}

     

    // // Imprimir los datos del formulario en la consola
    // console.log('Formulario guardado:', formData);
    // fetch(`${DOMAIN_URL}/pepito/notas`)


    // // Si deseas imprimir el HTML del formulario completo:
    // console.log('Formulario completo HTML:', form.outerHTML);

