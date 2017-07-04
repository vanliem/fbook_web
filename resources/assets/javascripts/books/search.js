$('#search-book').on('keyup', function (e) {
    delay(function(){
        e.preventDefault();
        searchBooks();
    }, 700);
});

$('input[name="type-search"]').on('change', function (e) {
    e.preventDefault();
    searchBooks();
});

var delay = (function() {
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function searchBooks() {
    if ($('#search-book').val() == "") {
        $('#data-search').empty();
    } else {
        if ($('input[name="type-search"]:checked').val() === 'Others') {
            $.ajax({
                url: configs.url_search_google_books_apis + '&maxResults=20&q=' + $('#search-book').val(),
                contentType: 'application/json',
                dataType: 'json',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                type: 'GET',
            }).done(function (response) {
                $('#data-search').empty();

                if (response.totalItems) {
                    response.items.forEach(function (book) {
                        $('#data-search').append(
                            '<li><a target="_blank" href="'+ book.volumeInfo.previewLink + '">' + book.volumeInfo.title + '</a></li>'
                        );
                    });
                } else {
                    $('#data-search').append('<li><a href="#">Not found</a></li>');
                }
            }).fail(function (error) {
                $('#data-search').empty();
            });
        } else {
            $.ajax({
                url: API_PATH + 'search',
                contentType: 'application/json',
                dataType: 'json',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                type: 'POST',
                data: JSON.stringify({
                    search: {
                        keyword: $('#search-book').val(),
                        field: $('input[name="type-search"]:checked').val()
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
            }).fail(function (error) {
                $('#data-search').empty();
            });
        }
    }
}
