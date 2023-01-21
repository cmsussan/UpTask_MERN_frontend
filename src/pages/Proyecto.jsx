import { useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import useAdmin from '../hooks/useAdmin';
import ModalFormularioTarea from '../components/ModalFormularioTarea';
import ModalEliminarTarea from '../components/ModalEliminarTarea';
import ModalEliminarColaborador from '../components/ModalEliminarColaborador';
import Tarea from '../components/Tarea';
import Alerta from '../components/Alerta';
import Colaborador from '../components/Colaborador';
import io from 'socket.io-client';

let socket;

const Proyecto = () => {
    const params = useParams();

    const { obtenerProyecto, 
            proyecto, 
            cargando, 
            handleModalTarea, 
            alerta, 
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            actualizarEstadoTarea,
    } = useProyectos();

    const {nombre} = proyecto;
    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, []);

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);

        socket.emit('abrir proyecto', params.id);
    }, [])

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva);
            }            
        });

        socket.on('tarea eliminada', tareaEliminada => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada);
            }
        });

        socket.on('tarea actualizada', tareaActualizada => {
            if (tareaActualizada.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tareaActualizada);
            }
        });

        socket.on('nuevo estado', nuevoEstadoTarea => {
            if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
                actualizarEstadoTarea(nuevoEstadoTarea);
            }
        });
    });

    const { msg } = alerta;

    return (
        cargando ? (<div className="spinner"></div>) : (            <>
                <div className='flex justify-between'>
                    <h1 className="font-black text-4xl">{nombre}</h1>

                    {admin && (
                        <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                            </svg>
                            <Link
                                to={`/proyectos/editar/${params.id}`}
                                className='uppercase font-bold'
                            >
                                Editar
                            </Link> 
                        </div>
                    )}
                </div>

                {admin && (
                    <button
                    onClick={handleModalTarea}
                        type='button'
                        className='mt-5 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center flex gap-2 items-center justify-center'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                        </svg>
                        Nueva Tarea
                    </button>
                )}
                <p
                    className='font-bold text-xl mt-10'
                >
                    Tareas del Proyecto
                </p>

                <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.tareas?.length ? proyecto.tareas?.map( tarea => (
                        <Tarea tarea={tarea} key={tarea._id} />
                    )) : <p className="text-center my-5 p-10">No hay tareas en este proyecto</p> }
                </div>
                
                {admin && (<> 
                        <div className="flex items-center justify-between mt-10">
                            <p
                                className='font-bold text-xl'
                                >
                                Colaboradores
                            </p>

                            <Link 
                                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                className='text-gray-400 hover:text-black uppercase font-bold'
                                >
                                Añadir
                            </Link>
                        </div>

                        <div className="bg-white shadow mt-10 rounded-lg">
                            {proyecto.colaboradores?.length ? proyecto.colaboradores?.map( colaborador => (
                                <Colaborador colaborador={colaborador} key={colaborador._id} />
                                )) : <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p> }
                        </div>
                    </>

                )}


                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
        )
    )
}

export default Proyecto