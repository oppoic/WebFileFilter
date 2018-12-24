$(function () {
    if (localStorage.url != undefined & localStorage.url != '') {
        $('#txtAreaUrls').val(localStorage.url);
    }
})

document.getElementById('btnSaveUrls').addEventListener('click', function (event) {
    if ($('#txtAreaUrls').val() != '') {
        localStorage.url = $('#txtAreaUrls').val();
    }
    else {
        localStorage.removeItem("url");
    }
    $('#spnInfo').css("color", "green").html('success').show().delay(3000).hide(0);
});