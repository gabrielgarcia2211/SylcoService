function addFile() {
    event.preventDefault();
    var file = $("#archivo").val();
    var nombre = $("#nombre").val();
    var descripcion = $("#nombre").val();
    if (file == "" || nombre == "" || descripcion == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Por favor llene todos los campos!'
        });
        return;
    }
    var url = $("#form-file-contratista").attr("action");
    var parametros = new FormData($("#form-file-contratista")[0]);
    $.ajax({
        type: "POST",
        url: url,
        data: parametros,
        contentType: false,
        processData: false,
        beforeSend: function () {
            Swal.fire({
                title: "Cargando",
                text: "Subiendo archvio...",
                imageUrl: "https://img.webme.com/pic/a/andwas/cargando5.gif",
                imageWidth: 200,
                imageHeight: 180,
                imageAlt: "Subiendo archvio",
                showCancelButton: false,
                showConfirmButton: false,
            });
        },
        success: function (response) {
            if (response["response"]) {
                Swal.fire({
                    icon: "success",
                    title: "Hecho!",
                    text: response["message"],
                });
                location.reload();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response["message"],
                });
            }
        },
        error: function (r) {
            alert(r);
            swal.close();
        }
    });
}


function deleteFile(id){
    event.preventDefault();
    Swal.fire({
        title: "Desea eliminar el archivo?",
        text: "Esta operacion es irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {
            var url = $("#form-file-delete").attr("action");
            var dataSalida = { id: id };
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                method: "POST",
                url: url,
                data: dataSalida,
                beforeSend: function () {
                    Swal.fire({
                        title: "Cargando",
                        text: "Eliminando Archivo...",
                        imageUrl:
                            "https://img.webme.com/pic/a/andwas/cargando5.gif",
                        imageWidth: 200,
                        imageHeight: 180,
                        imageAlt: "Eliminando Archivo",
                        showCancelButton: false,
                        showConfirmButton: false,
                    });
                },
                success: function (response) {
                    if (response["response"]) {
                        Swal.fire({
                            icon: "success",
                            title: "Hecho!",
                            text: response["message"],
                        });
                        location.reload();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response["message"],
                        });
                    }
                },
            });
        }
    });
}