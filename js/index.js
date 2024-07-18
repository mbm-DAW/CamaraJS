let videoElement = document.querySelector("#camara");
let botonTomarFoto = document.querySelector("#tomar-foto");
let botonBorrarTodo = document.querySelector("#borrar-todo");
let galeriaDeFotos = document.querySelector("#galeria");

//verificar permisos, solicitar acceso a la camra

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => { videoElement.srcObject = stream }).catch(error => {
    alert("error al acceder a la cammara" + error);
});

// declaracion del contador de foto para generar el ID y poder borrar y descargar
let contadorIDfotos = getNextPhoto();


//cuando pulsa en generar foto se genera un canvas de tipo 2d, con las coordenadas x,y de la imagen que se esta transmitiendo.

botonTomarFoto.addEventListener("click", () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const contex = canvas.getContext("2d");
    // dibujacon todos estos datos anteriores
    contex.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // convertir la imagen  a base64
    //galeriaDeFotos.appendChild(canvas);
    let dataUrl = canvas.toDataURL("image/jpeg", 0.9); // le indicamos que convierta el mapa a una imagen jpeg
    let photoID = contadorIDfotos++;
    guardarFoto({ id: photoID, dataUrl }); //mapa con el id y la ruta, para guardarlo en localstorage del navegador

    setNextPhoto(contadorIDfotos); // se pasa el contador de foto a una funcion que prepara para la proxima foto el contador

})

function guardarFoto(photo, isPhotoLoad = false) {
    // crear el contenedor para la foto
    let photContainer = document.createElement("div");
    photContainer.className = "photo-container";
    photContainer.dataset.id = photo.id;

    // crear la imagen
    let img = new Image(); // esta variable es de tipo objeto de imagen
    img.src = photo.dataUrl;
    img.className = "photo";

    // crear el contenedor para los botones
    let contenedorBotones = document.createElement("div");
    contenedorBotones.className = "botones-photo";

    // creamos el boton de eliminar
    eliminarPhoto = document.createElement("button");
    eliminarPhoto.className = "boton-eliminar";
    eliminarPhoto.textContent = "Eliminar";

    //crear el evento de este boton
    eliminarPhoto.addEventListener("click", () => {
        eliminar(photo.id);

    })

    // crear el boton descargar
    let descargarPhoto = document.createElement("button");
    descargarPhoto.className = "boton-descargar";
    descargarPhoto.textContent = "Descargar";
    descargarPhoto.addEventListener("click", () => {
        descargar(photo.dataUrl, `photo-${photo.id}.jpeg`);
    })

    galeriaDeFotos.appendChild(photContainer);
    photContainer.appendChild(img);
    photContainer.appendChild(contenedorBotones);


    contenedorBotones.appendChild(eliminarPhoto);
    contenedorBotones.appendChild(descargarPhoto);


    // guardar la imagen en el almacenamiento local solo si no esta cargado desde localStore
    if (!isPhotoLoad) {
        let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
        fotos.push(photo);
        localStorage.setItem("fotos", JSON.stringify(fotos));
    }
}

// cuando carga la pagina debe recupera todas las fotos
// lee el localstorage y muestra las fotos almacenadas
let fotosGuardadas = JSON.parse(localStorage.getItem("fotos"));
fotosGuardadas.forEach(element => {
    guardarFoto(element, true); // el true hace referencia que si es leido o tiene contenido
});


function eliminar(id) {
    // primero lo elimina de la vista y despues del localstore
    let divEliminar = document.querySelector(`.photo-container[data-id="${id}"]`);
    if (divEliminar) {
        galeriaDeFotos.removeChild(divEliminar);
    }
    // eliminar del localstorage, se leen todas las fotos que estan guardadas y se filtra el id que se busca
    let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
    fotos = fotos.filter(photo => photo.id != id);
    localStorage.setItem("fotos", JSON.stringify(fotos));

}


function descargar(dataUrl, filename) {
    console.log('descar');
    let elemento = document.createElement("a"); //
    elemento.href = dataUrl;
    elemento.download = filename;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);


}






function getNextPhoto() {
    return parseInt(localStorage.getItem("contadorIDfotos")) || 0;
}

function setNextPhoto(id) {
    localStorage.setItem("contadorIDfotos", id.toString());
}

botonBorrarTodo.addEventListener("click", () => {
    localStorage.removeItem("fotos");
    while (galeriaDeFotos.firstChild) {
        galeriaDeFotos.removeChild(galeriaDeFotos.firstChild);
    }
    contadorIDfotos = 0;
    setNextPhoto(contadorIDfotos);
})





