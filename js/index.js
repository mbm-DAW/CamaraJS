let videoElement = document.querySelector("#camara");
let botonTomarFoto = document.querySelector("#tomar-foto");
let botonBorrarFoto = document.querySelector("#borrar-foto");
let galeriaDeFotos = document.querySelector("#galeria");

//verificar permisos, solicitar acceso a la camra

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => { videoElement.srcObject = stream }).catch(error => {
    alert("error al acceder a la cammara" + error);
});

// declaracion del contador de foto para generar el ID y poder borrar y descargar
let contadorIDfotos = tomarIdproximaFoto();


//cuando pulsa en generar foto se genera un canvas de tipo 2d, con las coordenadas x,y de la imagen que se esta transmitiendo.

botonTomarFoto.addEventListener("click", () => {
    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const contex = canvas.getContext("2d");
    // dibujacon todos estos datos anteriores
    contex.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // convertir la imagen 
    galeriaDeFotos.appendChild(canvas);

    

})

function tomarIdproximaFoto() {

}