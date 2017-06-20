var Book = {};

Book.init = function () {
    var scope = this;
};

Book.handle = function () {

};

Book.loadMoreAtSectionPage = function (field, page) {
    var scope = this;
    $.ajax({
        url: API_PATH + 'books/?field=' + field + '&page=' + page,
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'GET'
    }).done(function (response) {
        response.item.data.forEach(function (book) {
            $('.row .ajax-book-content').append(scope.generateBookXhtml(book));
        });

        if (response.item.next_page !== null) {
            $('.btn-loadmore-book').attr('data-next-page', response.item.next_page);
        } else {
            $('.btn-loadmore-book').addClass('hidden');
        }

    }).fail(function (error) {
        alert('error');
    });
};

Book.generateBookXhtml = function (book) {
    var xhtml = '';
    xhtml += '<div class="col-xs-12 col-md-6">';
    xhtml += '<div class="category-item well yellow">';
    xhtml += '<div class="media">';
    xhtml += '<div class="media-left">';

    if (typeof(book.image.web.thumbnail_path) !== 'undefined') {
        xhtml += '<img src="'+ book.image.web.thumbnail_path +'" class="media-object" alt="">';
    } else {
        xhtml += '<img src="/images/book_thumb_default.jpg" class="media-object" alt="">';
    }
    xhtml += '</div>';
    xhtml += '<div class="media-body">';

    var bookTitle = (book.title.length) > 15 ? (book.title.substring(0, 15) + ' ...') : book.title;
    xhtml += '<h5 title="'+ book.title +'">' + bookTitle + '</h5>';

    var bookAuthor = (book.author.length) > 10 ? (book.author.substring(0, 10) + ' ...') : book.author;
    xhtml += '<h6 title="'+ book.title +'">' + bookAuthor + '</h6>';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<ul class="list-inline list-unstyled rating-star">';
    xhtml += '<li class="active"><i class="icofont icofont-star"></i></li>';
    xhtml += '<strong>'+ book.avg_star +' / 10</strong>';
    xhtml += '</ul>';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<p>'+ book.overview +'</p>';
    xhtml += '<a href="/books/'+ book.id +'" class="text-primary">Xem chi tiết</a>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';

    return xhtml;
};
