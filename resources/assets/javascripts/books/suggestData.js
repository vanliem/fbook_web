$('#fillSuggestData').on('click', function (e) {
    suggestTitleBooks();
});

$(document).on('change', '.suggestedTitle', function (e) {
    suggestDataBooks();
});

function suggestDataBooks() {
    $.ajax({
        url: API_PATH + 'search-books-detail/' + $('.suggestedTitle option:selected' ).val(),
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        type: 'GET',
    }).done(function (response) {
        if (response.item) {
            if (typeof response.item.volumeInfo.title != 'undefined') {
                $('#title').val(response.item.volumeInfo.title);
            }

            if (typeof response.item.id != 'undefined') {
                $('#code').val(response.item.id);
            }

            if (typeof response.item.volumeInfo.authors != 'undefined') {
                $('#author').val(response.item.volumeInfo.authors);
            }

            if (typeof response.item.volumeInfo.publishedDate != 'undefined') {
                $('#publish_date').val(response.item.volumeInfo.publishedDate);
            }

            if (typeof response.item.volumeInfo.description != 'undefined') {
                $('#description').val(response.item.volumeInfo.description);
            }

            showNotify('success', 'Suggest data filled', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});
        } else {
            showNotify('danger', 'Don \'t have suggest data books', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        }
    }).fail(function (error) {
        showNotify('danger', 'Don \'t have suggest data books', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
}

function suggestTitleBooks() {
    $.ajax({
        url: API_PATH + 'search-books?q=' + $('#title').val(),
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        type: 'GET',
    }).done(function (response) {
        var htmlModel;

        if (response.items.length) {
            htmlModel = "<div data-toggle='modal' data-target='#myModal'></div>";
            htmlModel += "<div id='myModal' class='modal fade' role='dialog'>";
            htmlModel += "<div class='modal-dialog'>";
            htmlModel += "<div class='modal-content'>";
            htmlModel += "<div class='modal-header'>";
            htmlModel += "<button type='button' class='close' data-dismiss='modal'>&times;</button>";
            htmlModel += "<h4 class='modal-title'>Please choose a book</h4></div>";
            htmlModel += "<div class='modal-body'>";
            htmlModel += "<select class='form-control suggestedTitle'>";
            response.items.forEach(function (book) {
                htmlModel += "<option value='" + book.id + "'>" + book.volumeInfo.title.substring(0, 100) + '</option>';
            });
            htmlModel += "</select></div>";
            htmlModel += "<div class='modal-footer'>";
            htmlModel += "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>";
            htmlModel += "</div></div></div></div>";
            $('#modelSpace').html(htmlModel);
            $('#myModal').modal('toggle');
        } else {
            showNotify('danger', 'Don \'t have suggest data books', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        }
    }).fail(function (error) {
        showNotify('danger', 'Don \'t have suggest data books', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
}
