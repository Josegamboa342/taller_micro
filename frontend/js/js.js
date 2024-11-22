
const API_URL = "http://127.0.0.1:8000/api/pepito";
const contactoForm = document.forms['contactoForm'];
let codigoGlobal= 0;

contactoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const estudiante = {
        cod: contactoForm['codigo'].value,
        nombre: contactoForm['nombre'].value,
        email: contactoForm['email'].value,
    };
    
    crearEstudiante(estudiante);
});

const crearEstudiante = (estudiante) => {
    fetch(`${API_URL}/estudiante`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    })
        .then((response) => {
            if (response.status === 404) {
                alert("Error en el servicio");
                throw new Error("Servicio no encontrado");
            } else if (response.status === 409) {
                return response.json().then((error) => {
                    alert(`Error: ${error.message}`);
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then((body) => {
            alert(`Estudiante creado exitosamente: ${body.data.nombre}`);
            cargarEstudiantes();
        })
        .catch((error) => {
            console.error("Advertencia:", error);
            alert("Ocurrió un error al intentar crear el estudiante.");
        })
        .finally(() => console.log("Creación de estudiante finalizada"));
};

//-----------------------------------------------------------------------------------------

//editar estudiante------------------------------------------------------------------------------
const cancelarEdicion = () => {
    contactoForm.reset();

    const submitBtn = contactoForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Crear Estudiante";
    submitBtn.onclick = null; 
};

const cargarDatosParaActualizar = (codigo) => {
    fetch(`${API_URL}/estudiante/${codigo}`)
        .then(response => response.json())
        .then(data => {
            const estudiante = data.data;

            contactoForm['codigo'].value = estudiante.cod;
            contactoForm['nombre'].value = estudiante.nombres;
            contactoForm['email'].value = estudiante.email;

            const submitBtn = contactoForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Actualizar Estudiante";
            submitBtn.onclick = (e) => {
                e.preventDefault(); 
                actualizarEstudiante(estudiante.cod, {
                    cod: contactoForm['codigo'].value,
                    nombre: contactoForm['nombre'].value,
                    email: contactoForm['email'].value,
                });
            };
            if (!document.querySelector("#cancelar-btn")) {
                const cancelarBtn = document.createElement("button");
                cancelarBtn.id = "cancelar-btn";
                cancelarBtn.textContent = "Cancelar";
                cancelarBtn.type = "button";
                cancelarBtn.onclick = cancelarEdicion;
                contactoForm.appendChild(cancelarBtn);
            }
        })
        .catch(error => console.error("Error al cargar datos del estudiante:", error));
};
const actualizarEstudiante = (id, estudiante) => {
    fetch(`${API_URL}/estudiante/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    })
        .then((response) => {
            if (response.status === 404) {
                alert("Estudiante no encontrado.");
                throw new Error("Estudiante no encontrado.");
            } else if (response.status === 409) {
                return response.json().then((error) => {
                    alert(`Error: ${error.message}`);
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then((body) => {
            alert(`Estudiante actualizado exitosamente: ${body.data.nombres}`);
            cargarEstudiantes(); 
            cancelarEdicion(); 
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar actualizar el estudiante.");
        })
        .finally(() => console.log("Actualización de estudiante finalizada"));
};

//------------------------------------------------------------------------------------------
const eliminarEstudiante = (codigo) => {
    if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
        fetch(`${API_URL}/estudiante/${codigo}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirm: true }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            cargarEstudiantes();
        })
        .catch(error => console.error("Error al eliminar el estudiante:", error));
    } else {
        alert("Eliminación cancelada.");
    }
};
const eliminarEstd = (cod) => {
    eliminarEstudiante(cod);
};

//--------------------------------------------------------------------------------

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
                        <button onclick="verEstudiante(${estudiante.cod})">Ver</button>
                        <button onclick="eliminarEstd(${estudiante.cod})" class="eliminar-estudiante">Eliminar</button>
                        <button onclick="cargarDatosParaActualizar(${estudiante.cod})" class="actualizar-estudiante">Actualizar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById("resumen-aprobados").textContent = `Aprobados: ${data.resumen.aprobados}`;
            document.getElementById("resumen-reprobados").textContent = `Reprobados: ${data.resumen.reprobados}`;
            document.getElementById("resumen-sin-notas").textContent = `Sin Notas: ${data.resumen.sin_notas}`;
            document.getElementById("resumen-notas-abajo").textContent = `Notas menores a 3: ${data.resumen.notas_abajo_3}`;
            document.getElementById("resumen-notas-arriba").textContent = `Notas mayores o iguales a 3: ${data.resumen.notas_arriba_3}`;
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
//----------------------------------------------------------------------------------------------------------------

const verEstudiante = (codigo) => {
    codigoGlobal = codigo;
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
                    <td>
                        <button class="eliminar-nota" data-id="${nota.id}">Moificar</button>
                    </td>
                    <td>
                        <button class="eliminar-nota" data-id="${nota.id}">Eliminar</button>
                    </td>
                `;
                notasTbody.appendChild(tr);
            });

            document.getElementById("info-estudiante").style.display = "block";
        })
        .catch(error => console.error("Error al cargar estudiante:", error));
};

//----------------------------------------------------------------------------------------------------------------

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

//----------------------------------------------------------------------------------------------------------------


document.querySelector("#notas tbody").addEventListener("click", function (e) {
    if (e.target && e.target.matches("button.eliminar-nota")) {
        const notaId = e.target.getAttribute("data-id");

        if (confirm("¿Estás seguro de que deseas eliminar esta nota?")) {
            eliminarNota(notaId);
        }
    }
});
//----------------------------------------------------------------------------------------------------------------nota

const eliminarNota = (notaId) => {
    fetch(`${API_URL}/nota/${notaId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.msg);
            cargarEstudiantes();
        })
        .catch(error => console.error("Error al eliminar la nota:", error));
};
//----------------------------------------------------------------------------------------------------------------nota
cargarEstudiantes();
const cargarNotas = (filtros = {}) => {
    const url = new URL(`${API_URL}/notas`);
    Object.keys(filtros).forEach(key => {
        if (filtros[key]) {
            url.searchParams.append(key, filtros[key]);
        }
    });

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#resultado-notas tbody");
            tbody.innerHTML = "";
            data.data.forEach(nota => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${nota.id}</td>
                    <td>${nota.actividad}</td>
                    <td>${nota.nota}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error al cargar notas:", error));
//crear nota ---------------------------------------------------------------------------------------------------

form-nota.addEventListener('submit', (e) => {
    e.preventDefault();
    const estudiante = {
        id: form-nota['id'].value,
        nombre: form-nota['nombre'].value,
        email: form-nota['email'].value,
    };
    
    crearEstudiante(estudiante);
});

const crearNota = (nota) => {
    fetch(`${API_URL}/nota`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nota)
    })
        .then((response) => {
            if (response.status === 404) {
                alert("Error en el servicio");
                throw new Error("Servicio no encontrado");
            }
            return response.json();
        })
        .then((body) => {
            alert(`Nota creada exitosamente: ${body.data.nombre}`);
            cargarEstudiantes();
            
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar crear la nota.");
        })
        .finally(() => console.log("Creación de la nota finalizada"));
};


notasForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nota = {
        actividad: contactoForm['actividad'].value,
        nota: contactoForm['nota'].value,
        codEstudiante: codigoGlobal
    };
    
    crearNota(nota);
});
//---------------------------------------------------------------------------------------
};