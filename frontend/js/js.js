const API_URL = "http://127.0.0.1:8000/api/pepito"; 

const cargarEstudiantes = (filtros = {}) => {
    const url = new URL(`${API_URL}/estudiantes`);
    Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
            url.searchParams.append(key, filtros[key]);
        }
    });

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#estudiantes tbody");
            tbody.innerHTML = ""; 
            data.data.forEach(estudiante => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${estudiante.cod}</td>
                    <td>${estudiante.nombres}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.nota_definitiva}</td>
                    <td class="${getEstadoClass(estudiante.nota_definitiva)}">${estudiante.estado}</td>
                    <td>
                        <button data-codigo="${estudiante.cod}">Ver</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById("resumen-aprobados").textContent = `Aprobados: ${data.resumen.aprobados}`;
            document.getElementById("resumen-reprobados").textContent = `Reprobados: ${data.resumen.reprobados}`;
            document.getElementById("resumen-sin-notas").textContent = `Sin Notas: ${data.resumen.sin_notas}`;
        })
        .catch(error => console.error("Error al cargar estudiantes:", error));
};

const getEstadoClass = (notaDefinitiva) => {
    if (notaDefinitiva >= 0 && notaDefinitiva <= 2) return 'baja';
    if (notaDefinitiva > 2 && notaDefinitiva < 3) return 'media-baja';
    if (notaDefinitiva >= 3 && notaDefinitiva < 4) return 'media-alta';
    if (notaDefinitiva >= 4) return 'alta';
    return '';
};

const verEstudiante = (codigo) => {
    fetch(`${API_URL}/estudiante/${codigo}`)
        .then(response => response.json())
        .then(data => {
            const estudiante = data.data;

            const notasValidas = estudiante.notas.filter(nota => !isNaN(nota.nota));
            
            const promedio = notasValidas.length > 0
                ? notasValidas.reduce((sum, nota) => sum + parseFloat(nota.nota), 0) / notasValidas.length
                : NaN;
            const estado = isNaN(promedio)
                ? "Sin notas"
                : promedio >= 3 ? "Aprobado" : "Reprobado";

            document.getElementById("info-codigo").textContent = `Código: ${estudiante.cod}`;
            document.getElementById("info-nombre").textContent = `Nombre: ${estudiante.nombres}`;
            document.getElementById("info-email").textContent = `Email: ${estudiante.email}`;
            document.getElementById("info-promedio").textContent = `Promedio: ${isNaN(promedio) ? "No hay nota" : promedio.toFixed(2)}`;
            document.getElementById("info-estado").textContent = `Estado: ${estado}`;

            const notasTbody = document.querySelector("#notas tbody");
            notasTbody.innerHTML = ""; 

            estudiante.notas.forEach(nota => {
                const tr = document.createElement("tr");
                tr.classList.add(getNotaClass(nota.nota));
                tr.innerHTML = `
                    <td>${nota.id}</td>
                    <td>${nota.actividad}</td>
                    <td>${nota.nota}</td>
                `;
                notasTbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error al cargar estudiante:", error));
};

const getNotaClass = (nota) => {
    if (nota >= 0 && nota <= 2) return 'baja';
    if (nota > 2 && nota < 3) return 'media-baja';
    if (nota >= 3 && nota < 4) return 'media-alta';
    if (nota >= 4) return 'alta';
    return '';
};

document.querySelector("#filtros").addEventListener("submit", (e) => {
    e.preventDefault();
    const filtros = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        estado: document.getElementById("estado").value,
        rango_min: document.getElementById("rango_min").value,
        rango_max: document.getElementById("rango_max").value,
        sin_notas: document.getElementById("sin_notas").checked ? 1 : 0,
    };
    cargarEstudiantes(filtros);
});

document.querySelector("#estudiantes tbody").addEventListener("click", function (e) {
    if (e.target && e.target.matches("button")) {
        const codigo = e.target.getAttribute("data-codigo");
        verEstudiante(codigo);
    }
});

cargarEstudiantes();
