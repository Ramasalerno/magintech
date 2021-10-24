$("#enviarFormulario").click(function (e) {
    if ($('#name_form').val() != "" &&
    $('#email_form').val() != "" &&
    $('#text_form').val() != "") {
    e.preventDefault()
    $.get("api2.json", function (dato) {
        console.log(dato)
        $("#envioFormulario").html(`
            ${dato.alert}
            `).css({"display":"inline-block"}).fadeOut(1500)
            $("#form").trigger('reset');
    })}
    else {
        e.preventDefault()
        Swal.fire({
            icon: "warning",
            title: "Uyyyy...",
            text: "¡Primero tenes que completar tus datos!",
        });}
})