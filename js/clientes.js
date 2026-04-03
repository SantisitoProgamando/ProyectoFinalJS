const clientesVIP = [
    { id: 101, nombre: 'Santiago', membresia: 'GOLD'},
    { id: 102, nombre: 'Valentina', membresia: 'SILVER'},
];

function renderizarClientes(){
    const contenedorClientes = document.getElementById('contenedor-clientes');
    contenedorClientes.innerHTML = '';

    clientesVIP.forEach(cliente => {
        const li = document.createElement('li');
        li.className = "cliente-item";
        li.innerHTML = `
            <strong>${cliente.nombre}</strong> - <small>${cliente.membresia}</small>
        `;
        contenedorClientes.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', renderizarClientes);