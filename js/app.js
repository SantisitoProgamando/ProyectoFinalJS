let carrito = [];
const Swal = 0;
document.addEventListener('DOMContentLoaded', obtenerProductos);

async function obtenerProductos(){
    try {
        const respuesta = await fetch('data/productos.json');
        if (!respuesta.ok){throw new error('No se pudo conectar a la base de datos');}

        const productos = await respuesta.json();
        renderizarProductos(productos);
    } catch(error)
    {
        Swal.fire({
            icon: 'Error',
            tittle: 'Error critico',
            text: error.message,
            background: '#1f2937',
            color: '#fff'
        });
    }
}

function renderizarProductos(productos){
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.innerHTML = `
            <div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <span class="categoria">${producto.categoria}</span>
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toLocaleString()}</p>
            </div>
            <button 
                class="btn-agregar"
                data-id="${producto.id}" 
                data-nombre="${producto.nombre}"
            >
                Añadir al carrito
            </button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

document.getElementById('contenedor-productos').addEventListener('click', (evento) => {
    if (evento.target.classlist.contains('btn-agregar')){
        const idProducto = evento.target.getAtribbute('data-id');
        const nombreProducto = evento.target.getAtribbute('data-nombre');   

        agregarAlCarrito(idProducto, nombreProducto);
    }
});

function agregarAlCarrito(id, nombre){
    carrito.push(id);

    document.getElementById('contenedor-carrito').innerText = carrito.length;

    Swal.fire({
        icon: 'success',
        title: '¡Componente asegurado!',
        text: `Agregaste ${nombre} a tu setup.`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2500,
        background: '#1f2937',
        color: '#fff'
    });
}
