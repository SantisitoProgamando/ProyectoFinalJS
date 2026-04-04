let carrito = [];
let stockProductos = [];

document.addEventListener('DOMContentLoaded', obtenerProductos);

async function obtenerProductos(){
    try {
        const respuesta = await fetch('data/productos.json');
        if (!respuesta.ok) { throw new Error('No se pudo conectar a la base de datos'); }

        const productos = await respuesta.json();
        stockProductos = productos; 
        renderizarProductos(productos);
    } catch(error) {
        Swal.fire({
            icon: 'error',
            title: 'Error crítico',
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
            >
                Añadir al carrito
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

document.getElementById('contenedor-productos').addEventListener('click', (evento) => {
    if (evento.target.classList.contains('btn-agregar')){
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        agregarAlCarrito(idProducto);
    }
});
function agregarAlCarrito(id){
    const productoExistente = carrito.find(item => item.id === id); 
    let nombreProductoParaAlerta = "";

    if (productoExistente) {
        productoExistente.cantidad++;
        nombreProductoParaAlerta = productoExistente.nombre;
    } else { 
        const productoData = stockProductos.find(item => item.id === id);
        carrito.push({
            id: productoData.id,
            nombre: productoData.nombre,
            precio: productoData.precio,
            cantidad: 1
        });
        nombreProductoParaAlerta = productoData.nombre;
    }

    actualizarInterfazCarrito();


    Swal.fire({
        icon: 'success',
        title: "¡Componente asegurado!",
        text: `Agregaste ${nombreProductoParaAlerta} a tu carrito.`,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#1f2937',
        color: '#fff'
    });
}

document.getElementById('btn-abrir-carrito').addEventListener('click', () => {
    document.getElementById('modal-carrito').className = 'modal-activo';
});

document.getElementById('btn-cerrar-carrito').addEventListener('click', () => {
    document.getElementById('modal-carrito').className = 'modal-oculto';
});

function actualizarInterfazCarrito() {
    const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
    document.getElementById('contador-carrito').innerText = totalItems;

    const precioTotal = carrito.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);
    document.getElementById('precio-total').innerText = precioTotal.toLocaleString();

    renderizarModalCarrito();
}

function renderizarModalCarrito() {
    const contenedor = document.getElementById('contenedor-items-carrito');
    contenedor.innerHTML = ''; 

    if(carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:gray;">Tu carrito está vacío.</p>';
        return;
    }

    carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-carrito';
        div.innerHTML = `
            <div>
                <h4>${item.nombre}</h4>
                <p>$${(item.precio * item.cantidad).toLocaleString()}</p>
            </div>
            <div class="controles-cantidad">
                <button class="btn-cantidad restar" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad sumar" data-id="${item.id}">+</button>
                <button class="btn-eliminar" data-id="${item.id}">🗑️</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

document.getElementById('contenedor-items-carrito').addEventListener('click', (evento) => {
    if(evento.target.classList.contains('sumar')) {
        const id = parseInt(evento.target.getAttribute('data-id'));
        const producto = carrito.find(item => item.id === id);
        producto.cantidad++;
        actualizarInterfazCarrito();
    }

    if(evento.target.classList.contains('restar')) {
        const id = parseInt(evento.target.getAttribute('data-id'));
        const producto = carrito.find(item => item.id === id);
        
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            carrito = carrito.filter(item => item.id !== id);
        }
        actualizarInterfazCarrito();
    }

    if(evento.target.classList.contains('btn-eliminar')) {
        const id = parseInt(evento.target.getAttribute('data-id'));
        carrito = carrito.filter(item => item.id !== id);
        actualizarInterfazCarrito();
    }
});