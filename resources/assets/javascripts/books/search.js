$(document).on( 'keyup', '#search-book', function (e) {
    e.preventDefault();
    $.ajax({
        url: API_PATH + 'search',
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        type: 'POST',
        data: JSON.stringify({
            search: {
            keyword: $('#search-book').val(),
            field: "title"
          }
        }),
    }).done(function (response) {
        $('#data-search').empty();
        if (response.items.total) {
            response.items.data.forEach(function (book) {
                $('#data-search').append('<li><a href="/books/'+ book.id +'">' + book.title + '</a></li>');
            });
        } else {
            $('#data-search').append('<li><a href="#">Not found</a></li>');
        }
    });
});
