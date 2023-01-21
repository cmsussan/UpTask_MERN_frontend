import FormularioProyecto from '../components/FormularioProyecto';

const NuevoProyecto = () => {
  return (
    <>
        <h4 className='text-4xl font-black'>
            Crear Proyecto
        </h4>

        <div className='mt-10 flex justify-center'>
            <FormularioProyecto />
        </div>
    </>
  )
}

export default NuevoProyecto
