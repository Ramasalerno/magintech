$.getScript("form.js", function () {});

const footer = $("#footer").get(0)
const plantillaCard = $("#template-card").get(0).content
const plantillaFooter = $("#template-footer").get(0).content
const plantillaCarrito = $("#template-carrito").get(0).content
const fragment = document.createDocumentFragment()
let carrito = {}
const URLGET = "api.json"

$(document).ready(function () {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        crearCarrito()
    }
    
    $("#cards").click(function (e) {
        addCarrito(e)
    })
    
    $("#items").click(function (e) {
        agregaQuita(e)
    })
    
})


$.get(URLGET, function (respuesta, estado) {
    if (estado === "success") {
        let misDatos = respuesta;
        crearCards(misDatos)
    }
})

const crearCards = (data) => {
    data.forEach(producto => {
        plantillaCard.querySelector('h5').textContent = producto.title
        plantillaCard.querySelector('p').textContent = producto.precio
        plantillaCard.querySelector('h4').textContent = producto.desc
        plantillaCard.querySelector('img').setAttribute('src', producto.direccion)
        plantillaCard.querySelector('.btn-dark').dataset.id = producto.id

        const clon = plantillaCard.cloneNode(true)
        fragment.appendChild(clon)
    })
    cards.appendChild(fragment)
} 

const addCarrito = e => {
    /* si contiene el elemento con la clase btn-dark da true y agrega la info al carrito */
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Agregado al carrito',
            showConfirmButton: false,
            timer: 1000
        })
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    /* captura los elementos */
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    /* Aumentar la cantidad del producto sin duplicarlo*/
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {
        ...producto
    }
    crearCarrito()
}

const crearCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        plantillaCarrito.querySelector('th').textContent = producto.id
        plantillaCarrito.querySelectorAll('td')[0].textContent = producto.title
        plantillaCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        plantillaCarrito.querySelector('.btn-success').dataset.id = producto.id
        plantillaCarrito.querySelector('.btn-danger').dataset.id = producto.id
        plantillaCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clonar = plantillaCarrito.cloneNode(true)
        fragment.appendChild(clonar)
    })
    items.appendChild(fragment)
    generarFooterCarrito()
    /* almacenar en localstorage */
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const generarFooterCarrito = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5" class="carR ">Carrito vacío - Comience a comprar!</th>
        `
        return
    }

    const sumarItems = Object.values(carrito).reduce((contador, {
        cantidad
    }) => contador + cantidad, 0)

    const valorTotal = Object.values(carrito).reduce((contador, {
        cantidad,
        precio
    }) => contador + cantidad * precio, 0)

    plantillaFooter.querySelectorAll('td')[0].textContent = sumarItems
    plantillaFooter.querySelector('span').textContent = valorTotal

    const clon = plantillaFooter.cloneNode(true)

    fragment.appendChild(clon)

    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById('vaciar-carrito')
    vaciarCarrito.addEventListener('click', () => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Se borrarán todos tus productos del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar todo'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '¡Eliminado!',
                    'Tu carrito se encuentra vacio',
                    'info'
                )
                carrito = {}
                crearCarrito()
            }
        })
    })
}

/* sumar o restar items del carrito */
const agregaQuita = e => {
    if (e.target.classList.contains('btn-success')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }
        crearCarrito()
    }
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        crearCarrito()
    }
    e.stopPropagation()
}

/* Agregdo dinamico boton finalizar compra */
$("h6").prepend(
    '<div class="btnCenter"><button id="btn1" class="btn btn-success w-50">Finalizar compra</button></div>'
);

/* Modal con sweetalert para confirmación compra*/
$("#btn1").on("click", function () {
    if ($.isEmptyObject(carrito)) {
        Swal.fire({
            imageUrl: 'imagenes/meme.jpg',
            title: "Uyyyy...",
            imageHeight: 300,

            text: "¡Primero tenes que seleccionar un producto!",
        });
    } else Swal.fire({
        title: 'Gracias por comprar en MaginTech',
        icon: "success",
        text: "¡Su pedido se realizó con exito!",
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
    carrito = {}
    crearCarrito()
});
