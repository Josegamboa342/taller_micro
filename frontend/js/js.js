const API_URL = "http://127.0.0.1:8000/api/pepito";

const cargarEstudiantes = (filtros = {}) => {
    let url = new URL(`${API_URL}/estudiantes`);
    
   
    Object.keys(filtros).forEach(key => {
        if (filtros[key]) { 
            url.searchParams.append(key, filtros[key]);
        }
    });


    fetch(url)
        .then((response) => response.json())
        .then((body) => {
            const tbody = document.querySelector("#estudiantes tbody");
            tbody.innerHTML = "";  

            body.data.forEach((estudiante) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${estudiante.cod}</td>
                    <td>${estudiante.nombres}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.nota_definitiva}</td>
                    <td>${estudiante.estado}</td>
                    <td>
                        <button onclick="eliminarEstudiante('${estudiante.cod}')">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            const resumen = document.getElementById("resumen");
            resumen.innerHTML = `
                <p>Aprobados: ${body.resumen.aprobados}</p>
                <p>Reprobados: ${body.resumen.reprobados}</p>
                <p>Sin notas: ${body.resumen.sin_notas}</p>
            `;
        })
        .catch((error) => {
            console.error("Error al cargar los estudiantes:", error);
        });
};

const eliminarEstudiante = (codigo) => {
    if (confirm("¿Estás seguro de que deseas eliminar a este estudiante?")) {
        fetch(`${API_URL}/estudiante/${codigo}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((body) => {
                alert(body.msg);
                cargarEstudiantes();
            });
    }
};

cargarEstudiantes();

document.getElementById('filtros').addEventListener('submit', (e) => {
    e.preventDefault();

    const filtros = {
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        estado: document.getElementById('estado').value,
        rango_min: document.getElementById('rango_min').value,
        rango_max: document.getElementById('rango_max').value,
        sin_notas: document.getElementById('sin_notas').checked ? 1 : 0,  
    };

    cargarEstudiantes(filtros);
});
