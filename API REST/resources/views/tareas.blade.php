<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestor de Tareas | API REST Laravel</title>
    <link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
</head>
<body>

    <header class="cabecera">
        <div class="contenedor cabecera-contenido">
            <div class="marca">
                <div class="logo">✓</div>
                <div>
                    <h1>Gestor de Tareas</h1>
                    <p>Laravel 12 &middot; MySQL &middot; API REST</p>
                </div>
            </div>
            <a class="boton boton-fantasma" href="{{ url('/api/tareas') }}" target="_blank" rel="noopener">
                Ver JSON de la API
            </a>
        </div>
    </header>

    <main class="contenedor contenido">

        <section class="panel">
            <h2 id="titulo-formulario">Nueva tarea</h2>

            <form id="formulario-tarea" novalidate>
                <input type="hidden" id="tarea-id">

                <div class="campos">
                    <div class="campo">
                        <label for="titulo">Título *</label>
                        <input id="titulo" name="titulo" type="text" maxlength="255"
                               placeholder="Ej. Estudiar Laravel" required>
                    </div>

                    <div class="campo">
                        <label for="estado">Estado</label>
                        <select id="estado" name="estado">
                            <option value="pendiente">Pendiente</option>
                            <option value="en proceso">En proceso</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>

                    <div class="campo campo-completo">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" name="descripcion" rows="3"
                                  placeholder="Detalles de la tarea (opcional)"></textarea>
                    </div>
                </div>

                <p id="error-formulario" class="error" hidden></p>

                <div class="acciones-formulario">
                    <button type="submit" class="boton boton-primario" id="boton-guardar">
                        Registrar tarea
                    </button>
                    <button type="button" class="boton boton-secundario" id="boton-cancelar" hidden>
                        Cancelar edición
                    </button>
                </div>
            </form>
        </section>

        <section class="panel">
            <div class="barra-lista">
                <h2>Tareas <span id="contador" class="contador">0</span></h2>
                <input id="buscador" type="search" placeholder="Buscar por título o descripción...">
            </div>

            <div id="resumen" class="resumen"></div>

            <div id="lista-tareas" class="lista-tareas"></div>

            <p id="cargando" class="mensaje">Cargando tareas...</p>
            <p id="sin-tareas" class="mensaje" hidden>No hay tareas para mostrar.</p>
        </section>

    </main>

    <div id="notificacion" class="notificacion" hidden></div>

    <script src="{{ asset('js/tareas.js') }}" defer></script>
</body>
</html>
