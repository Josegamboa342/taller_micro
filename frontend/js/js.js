const DOMAIN_URL = "http://127.0.0.1:8000/api/pepito";

const cargarEstudiantes = () => {
    fetch(`${DOMAIN_URL}/estudiantes`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#estudiantes tbody");
            const resumenDiv = document.getElementById("resumen");
            tbody.innerHTML = "";

            data.data.forEach(estudiante => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${estudiante.cod}</td>
                    <td>${estudiante.nombres}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.nota_definitiva}</td>
                    <td>${estudiante.estado}</td>
                `;

                tbody.appendChild(tr);
            });

            resumenDiv.innerHTML = `
                <p>Aprobados: ${data.resumen.aprobados}</p>
                <p>Perdidos: ${data.resumen.perdidos}</p>
                <p>Sin Notas: ${data.resumen.sin_notas}</p>
            `;
        });
};

document.addEventListener("DOMContentLoaded", cargarEstudiantes);
