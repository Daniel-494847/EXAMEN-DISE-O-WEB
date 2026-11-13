// Interfaz web que consume la API REST de tareas
const API_URL = '/api/tareas';

const formulario = document.getElementById('formulario-tarea');
const tareaIdInput = document.getElementById('tarea-id');
const tituloInput = document.getElementById('titulo');
const descripcionInput = document.getElementById('descripcion');
const estadoSelect = document.getElementById('estado');
const errorFormulario = document.getElementById('error-formulario');
const tituloFormulario = document.getElementById('titulo-formulario');
const botonGuardar = document.getElementById('boton-guardar');
const botonCancelar = document.getElementById('boton-cancelar');
const listaTareas = document.getElementById('lista-tareas');
const cargando = document.getElementById('cargando');
const sinTareas = document.getElementById('sin-tareas');
const contador = document.getElementById('contador');
const resumen = document.getElementById('resumen');
const buscador = document.getElementById('buscador');
const notificacion = document.getElementById('notificacion');

let tareas = [];
let tareaEditando = null;
let textoBusqueda = '';
let temporizadorNotificacion = null;

// ---------- Utilidades ----------

async function peticion(url, opciones = {}) {
    const respuesta = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...opciones
    });

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
        const error = new Error(datos.message || 'Ocurrió un error inesperado');
        error.datos = datos;
        throw error;
    }

    return datos;
}

function escaparHtml(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, (caracter) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

function claseEstado(estado) {
    return 'estado-' + String(estado || 'pendiente').toLowerCase().replace(/\s+/g, '-');
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function mensajeDeError(error) {
    if (error.datos && error.datos.errors) {
        return Object.values(error.datos.errors).flat().join(' ');
    }
    return error.message;
}

function mostrarNotificacion(mensaje, tipo = 'exito') {
    notificacion.textContent = mensaje;
    notificacion.className = 'notificacion ' + tipo;
    notificacion.hidden = false;

    clearTimeout(temporizadorNotificacion);
    temporizadorNotificacion = setTimeout(() => {
        notificacion.hidden = true;
    }, 3000);
}

function mostrarError(mensaje) {
    errorFormulario.textContent = mensaje;
    errorFormulario.hidden = false;
}

function ocultarError() {
    errorFormulario.hidden = true;
    errorFormulario.textContent = '';
}

// ---------- Cargar y renderizar ----------

async function cargarTareas() {
    cargando.hidden = false;
    sinTareas.hidden = true;

    try {
        tareas = await peticion(API_URL);
        renderizar();
    } catch (error) {
        mostrarNotificacion('No se pudo conectar con la API', 'error');
        sinTareas.textContent = 'No se pudieron cargar las tareas.';
        sinTareas.hidden = false;
    } finally {
        cargando.hidden = true;
    }
}

function tareasFiltradas() {
    if (!textoBusqueda) return tareas;

    const busqueda = textoBusqueda.toLowerCase();
    return tareas.filter((tarea) =>
        tarea.titulo.toLowerCase().includes(busqueda) ||
        (tarea.descripcion || '').toLowerCase().includes(busqueda)
    );
}

function opcionesEstado(estadoActual) {
    const estados = ['pendiente', 'en proceso', 'completada'];

    return estados.map((estado) => {
        const seleccionado = estado === estadoActual ? ' selected' : '';
        return `<option value="${estado}"${seleccionado}>${estado}</option>`;
    }).join('');
}

function plantillaTarea(tarea) {
    const descripcion = tarea.descripcion
        ? `<p class="tarea-descripcion">${escaparHtml(tarea.descripcion)}</p>`
        : '';

    return `
        <article class="tarea ${claseEstado(tarea.estado)}">
            <div class="tarea-cabecera">
                <h3>${escaparHtml(tarea.titulo)}</h3>
                <span class="insignia">${escaparHtml(tarea.estado)}</span>
            </div>

            ${descripcion}

            <span class="tarea-fecha">Creada: ${escaparHtml(formatearFecha(tarea.created_at))}</span>

            <div class="tarea-pie">
                <select data-accion="estado" data-id="${tarea.id}" aria-label="Cambiar estado">
                    ${opcionesEstado(tarea.estado)}
                </select>

                <div class="tarea-acciones">
                    <button type="button" class="boton-icono" data-accion="editar" data-id="${tarea.id}">
                        Editar
                    </button>
                    <button type="button" class="boton-icono peligro" data-accion="eliminar" data-id="${tarea.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderizar() {
    const visibles = tareasFiltradas();

    contador.textContent = tareas.length;

    const pendientes = tareas.filter((t) => t.estado === 'pendiente').length;
    const enProceso = tareas.filter((t) => t.estado === 'en proceso').length;
    const completadas = tareas.filter((t) => t.estado === 'completada').length;

    resumen.innerHTML = `
        <span class="chip">Total: ${tareas.length}</span>
        <span class="chip pendiente">Pendientes: ${pendientes}</span>
        <span class="chip en-proceso">En proceso: ${enProceso}</span>
        <span class="chip completada">Completadas: ${completadas}</span>
    `;

    listaTareas.innerHTML = visibles.map(plantillaTarea).join('');

    if (visibles.length === 0) {
        sinTareas.textContent = tareas.length === 0
            ? 'No hay tareas registradas. Crea la primera con el formulario.'
            : 'No se encontraron tareas con ese filtro.';
        sinTareas.hidden = false;
    } else {
        sinTareas.hidden = true;
    }
}

// ---------- Crear / actualizar ----------

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    ocultarError();

    const titulo = tituloInput.value.trim();

    if (!titulo) {
        mostrarError('El título es obligatorio.');
        tituloInput.focus();
        return;
    }

    const datos = {
        titulo,
        descripcion: descripcionInput.value.trim() || null,
        estado: estadoSelect.value
    };

    botonGuardar.disabled = true;

    try {
        if (tareaEditando) {
            await peticion(`${API_URL}/${tareaEditando}`, {
                method: 'PUT',
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Tarea actualizada correctamente');
        } else {
            await peticion(API_URL, {
                method: 'POST',
                body: JSON.stringify(datos)
            });
            mostrarNotificacion('Tarea registrada correctamente');
        }

        reiniciarFormulario();
        await cargarTareas();
    } catch (error) {
        mostrarError(mensajeDeError(error));
    } finally {
        botonGuardar.disabled = false;
    }
});

function reiniciarFormulario() {
    formulario.reset();
    tareaEditando = null;
    tareaIdInput.value = '';
    tituloFormulario.textContent = 'Nueva tarea';
    botonGuardar.textContent = 'Registrar tarea';
    botonCancelar.hidden = true;
    ocultarError();
}

function editarTarea(id) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    tareaEditando = id;

    tituloInput.value = tarea.titulo;
    descripcionInput.value = tarea.descripcion || '';
    estadoSelect.value = tarea.estado;

    tituloFormulario.textContent = 'Editar tarea #' + id;
    botonGuardar.textContent = 'Guardar cambios';
    botonCancelar.hidden = false;

    ocultarError();
    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tituloInput.focus();
}

botonCancelar.addEventListener('click', reiniciarFormulario);

// ---------- Eliminar y cambiar estado ----------

async function eliminarTarea(id) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    if (!confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;

    try {
        await peticion(`${API_URL}/${id}`, { method: 'DELETE' });
        mostrarNotificacion('Tarea eliminada correctamente');

        if (tareaEditando === id) {
            reiniciarFormulario();
        }

        await cargarTareas();
    } catch (error) {
        mostrarNotificacion(mensajeDeError(error), 'error');
    }
}

async function cambiarEstado(id, nuevoEstado) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea || tarea.estado === nuevoEstado) return;

    try {
        await peticion(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                titulo: tarea.titulo,
                descripcion: tarea.descripcion,
                estado: nuevoEstado
            })
        });

        mostrarNotificacion('Estado actualizado a "' + nuevoEstado + '"');
        await cargarTareas();
    } catch (error) {
        mostrarNotificacion(mensajeDeError(error), 'error');
        await cargarTareas();
    }
}

// Delegación de eventos para los botones y selectores de cada tarea
listaTareas.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const id = Number(boton.dataset.id);

    if (boton.dataset.accion === 'editar') {
        editarTarea(id);
    }

    if (boton.dataset.accion === 'eliminar') {
        eliminarTarea(id);
    }
});

listaTareas.addEventListener('change', (evento) => {
    if (evento.target.matches('select[data-accion="estado"]')) {
        cambiarEstado(Number(evento.target.dataset.id), evento.target.value);
    }
});

// ---------- Buscador ----------

buscador.addEventListener('input', () => {
    textoBusqueda = buscador.value.trim();
    renderizar();
});

// ---------- Inicio ----------

cargarTareas();
