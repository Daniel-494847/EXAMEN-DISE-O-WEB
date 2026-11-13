import { useState } from 'react';

export default function RegistroEstudiantes() {
  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [correo, setCorreo] = useState('');
  const [estudiantes, setEstudiantes] = useState([]);

  const agregarEstudiante = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !carrera.trim() || !correo.trim()) return;
    setEstudiantes([...estudiantes, { id: Date.now(), nombre, carrera, correo }]);
    setNombre('');
    setCarrera('');
    setCorreo('');
  };

  const eliminarEstudiante = (id) => {
    setEstudiantes(estudiantes.filter(est => est.id !== id));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Sistema de Registro de Estudiantes</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={agregarEstudiante}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="nombre" className="form-label">Nombre completo</label>
                <input id="nombre" type="text" className="form-control" value={nombre}
                  onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label htmlFor="carrera" className="form-label">Carrera</label>
                <input id="carrera" type="text" className="form-control" value={carrera}
                  onChange={(e) => setCarrera(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label htmlFor="correo" className="form-label">Correo electrónico</label>
                <input id="correo" type="email" className="form-control" value={correo}
                  onChange={(e) => setCorreo(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Registrar</button>
          </form>
        </div>
      </div>

      <h3 className="mb-3">Lista de Estudiantes Registrados</h3>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>Carrera</th>
              <th>Correo Electrónico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No hay estudiantes registrados.</td>
              </tr>
            ) : (
              estudiantes.map((est, i) => (
                <tr key={est.id}>
                  <td>{i + 1}</td>
                  <td>{est.nombre}</td>
                  <td>{est.carrera}</td>
                  <td>{est.correo}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarEstudiante(est.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
