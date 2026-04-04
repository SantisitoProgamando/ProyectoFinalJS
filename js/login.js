document.addEventListener('DOMContentLoaded', () => {
    verificarSesionActiva();
});

const modalLogin = document.getElementById('modal-login');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');
const textoBienvenida = document.getElementById('texto-bienvenida');
const btnAbrirLogin = document.getElementById('btn-abrir-login');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

btnAbrirLogin.addEventListener('click', () => {
    modalLogin.className = 'modal-activo';  
});

document.getElementById('btn-cerrar-login').addEventListener('click', () => {
    modalLogin.className = 'modal-oculto';
    limpiarFormularioLogin();
});

//Logica registro

document.getElementById('btn-registrar').addEventListener('click', () => {
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password){
        mostrarAlerta('error','Campos Vacios','Por favor ingrese su email y contraseña');
        return;
    }
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosTechMarket')) || [];
    const usuarioExiste = usuariosGuardados.find(usuario => usuario.email === email && usuario.password === password);
    if (usuarioExiste) {
        mostrarAlerta('warning','Usuario existente','Mail ya registrado. Por favor inicie sesión o use otro email para registrarse.');
        return;
    }
    usuariosGuardados.push({ email: email, password: password });
    localStorage.setItem('usuariosTechMarket', JSON.stringify(usuariosGuardados));

    mostrarAlerta('success','Registro exitoso','Usuario registrado con éxito. Ahora puedes iniciar sesión.');
    limpiarFormularioLogin();
});

//Logica login

document.getElementById('btn-login').addEventListener('click', () => {
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();
    if (!email || !password){
        mostrarAlerta('error','Campos Vacios','Por favor ingrese su email y contraseña');
        return;
    }
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosTechMarket')) || [];

    const usuarioValido = usuariosGuardados.find(usuario => usuario.email === email && usuario.password === password);
    if (usuarioValido) {
        localStorage.setItem('sesionActiva', JSON.stringify(usuarioValido.email));

        modalLogin.className = 'modal-oculto';
        mostrarAlerta('success','Bienvenido','Has iniciado sesión exitosamente.');
        verificarSesionActiva();
        limpiarFormularioLogin();
    } else {
        mostrarAlerta('error','Credenciales inválidas','El email o la contraseña son incorrectos. Por favor, inténtalo de nuevo.');
    }
});

// Cerrar sesion

btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    carrito = [];
    actualizarInterfazCarrito();

    mostrarAlerta('success','Sesión cerrada','Has cerrado sesión exitosamente.');
    verificarSesionActiva();
});


function verificarSesionActiva(){
    const usuarioActivo = JSON.parse(localStorage.getItem('sesionActiva'));
    if (usuarioActivo){
        textoBienvenida.innerText = `Bienvenido, ${usuarioActivo}`;
        textoBienvenida.style.display = 'inline';
        btnAbrirLogin.style.display = 'none';
        btnCerrarSesion.style.display = 'inline-block';
    } else {
        textoBienvenida.style.display = 'none';
        btnCerrarSesion.style.display = 'none';
        btnAbrirLogin.style.display = 'inline-block';
    }
}

function limpiarFormularioLogin() {
    inputEmail.value = '';
    inputPassword.value = '';
}

function mostrarAlerta(icono,titulo,mensaje){
    Swal.fire({
        icon: icono,
        title: titulo,
        text: mensaje,
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#900c3f'
    });
}