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


Book.listBooksByCondition = function () {
    $.ajax({
        url: API_PATH + 'books/?field=' + field + '&page=' + page,
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'POST'
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
    xhtml += '<h5>' + book.title.length > 20 ? book.title.substring(0, 20) + ' ...' : book.title + '</h5>';
    xhtml += '<h6>' + book.author + '</h6>';
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
