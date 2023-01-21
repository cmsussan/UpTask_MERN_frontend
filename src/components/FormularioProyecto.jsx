import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

const FormularioProyecto = () => {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState('');

    const params = useParams();
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();

    useEffect(() => {
        if (params.id) {
            setId(proyecto._id)
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0]);
            setCliente(proyecto.cliente);
        } else {

        }
    }, [params])

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg:'Todos los Campos son Obligatorios',
                error: true
            })
            return;
        }

        //pasar datos hacía el provider
        await submitProyecto({
            id,
            nombre,
            descripcion, 
            fechaEntrega,
            cliente
        });

        //Limpiar formulario
        setId(null);
        setNombre('');
        setDescripcion('');
        setFechaEntrega('');
        setCliente('');
    }

    const { msg } = alerta;

    return (
        <form 
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        >
            {msg && (<Alerta alerta={alerta} />)}
            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='nombre'
                >
                    Nombre Proyecto
                </label>

                <input 
                    type='text' 
                    id='nombre'
                    placeholder="Nombre del Proyecto"
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>
            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='descripcion'
                >
                    Descripción
                </label>

                <textarea 
                    id='descripcion'
                    placeholder="Descripción del Proyecto"
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='fecha-entrega'
                >
                    Fecha Entrega
                </label>

                <input 
                    type='date' 
                    id='fecha-entrega'
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='cliente'
                >
                    Nombre Cliente
                </label>

                <input 
                    type='text' 
                    id='cliente'
                    placeholder="Nombre del Cliente"
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                />
            </div>

            <input 
                type="submit" 
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'} 
                className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' 
            />
        </form>
    )
}

export default FormularioProyecto