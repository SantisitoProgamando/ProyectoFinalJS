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

function renderizarProductos(productosParaRenderizar){
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return; 
    
    contenedor.innerHTML = '';
    const categorias = [
        { id: 'Placas de Video', titulo: 'Placas de Video Recomendadas' },
        { id: 'Procesadores', titulo: 'Procesadores Recomendados' },
        { id: 'Perifericos', titulo: 'Periféricos Destacados' },
        { id: 'Monitores', titulo: 'Monitores Recomendados' },
        { id: 'Memorias', titulo: 'Memorias RAM' }
    ];

    categorias.forEach(categoriaObj => {
        const productosDeCategoria = productosParaRenderizar.filter(
            prod => prod.categoria.toLowerCase() === categoriaObj.id.toLowerCase()
        );

        if (productosDeCategoria.length === 0) return;

        const seccionFila = document.createElement('div');
        seccionFila.className = 'fila-categoria';

        const titulo = document.createElement('h2');
        titulo.className = 'titulo-categoria';
        titulo.innerText = categoriaObj.titulo;
        seccionFila.appendChild(titulo);

        const carrusel = document.createElement('div');
        carrusel.className = 'carrusel-productos';

        productosDeCategoria.forEach(producto => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'tarjeta-producto';

            
            tarjeta.innerHTML = `
                <div class="tarjeta-header">
                    <i class="far fa-heart btn-favorito" title="Agregar a favoritos"></i>
                </div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                
                <div class="tags-info">
                    <span class="tag-envio">Llega HOY</span>
                    <span class="tag-stock">EN STOCK</span>
                </div>
                
                <h3 title="${producto.nombre}">${producto.nombre}</h3>
                
                <div class="precios">
                    <span class="precio-nuevo">$${producto.precio.toLocaleString()}</span>
                </div>
                
                <button class="btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
            `;
            carrusel.appendChild(tarjeta);
        });
        seccionFila.appendChild(carrusel);
        contenedor.appendChild(seccionFila);
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

document.getElementById('btn-comprar').addEventListener('click', () => {
    if(carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega productos a tu carrito antes de finalizar la compra.',
            background: '#1f2937',
            color: '#fff'
        });
        return;
    }
    else {
        Swal.fire({
            icon: 'success',
            title: '¡Compra exitosa!',
            text: 'Gracias por tu compra. ¡Vuelve pronto!',
            background: '#1f2937',
            color: '#fff'
        });
        carrito = [];
        actualizarInterfazCarrito();
    }
});

const inputBusqueda = document.getElementById('input-busqueda');
const contenedorResultados = document.getElementById('resultados-busqueda');

inputBusqueda.addEventListener('input', filtrarProductos);

document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.busqueda-area')) {
        contenedorResultados.classList.add('dropdown-oculto');
    }
});

function filtrarProductos() {
    const terminoBusqueda = inputBusqueda.value.toLowerCase().trim();
    if (terminoBusqueda === "") {
        contenedorResultados.classList.add('dropdown-oculto');
        renderizarProductos(stockProductos); 
        return;
    }
    const productosFiltrados = stockProductos.filter(producto => {
        return producto.nombre.toLowerCase().includes(terminoBusqueda);
    });
    renderizarDropdown(productosFiltrados);
}

function renderizarDropdown(productos) {
    contenedorResultados.innerHTML = ''; 

    if (productos.length === 0) {
        contenedorResultados.classList.remove('dropdown-oculto');
        contenedorResultados.innerHTML = `
            <div style="padding: 1.5rem; text-align: center; color: var(--texto-secundario);">
                <i class="fas fa-search-minus" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--acento-bordo-brillante);"></i>
                <p>No encontramos componentes para "<strong>${inputBusqueda.value}</strong>"</p>
            </div>
        `;
        return;
    }
    contenedorResultados.classList.remove('dropdown-oculto');

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'item-resultado';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <span>${producto.nombre}</span>
        `;
        
        div.addEventListener('click', () => {
            inputBusqueda.value = producto.nombre; 
            renderizarProductos([producto]); 
            contenedorResultados.classList.add('dropdown-oculto'); 
        });

        contenedorResultados.appendChild(div);
    });
}