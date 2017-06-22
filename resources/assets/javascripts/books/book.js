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
        xhtml += '<img src="/image/book/thumb-default" class="media-object" alt="">';
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

Book.booking = function (bookId, status) {
    if (typeof(access_token) === 'undefined' || typeof(user) === 'undefined') {
        showNotify('danger', 'Please login before booking', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        return false;
    }
    var data = JSON.stringify({
        item : {
            book_id: bookId,
            status: status
        }
    });

    $.ajax({
        url: API_PATH + 'books/booking/' + bookId,
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        data: data
    }).done(function () {
        $('#booking-book').addClass('disabled');

        var xhtml = '';
        xhtml += '<div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-9">';
        xhtml += '<div class="event-item wow fadeInRight">';
        xhtml += '<div class="well">';
        xhtml += '<div class="media">';
        xhtml += '<div class="media-left">';

        if (user.avatar !== null) {
            xhtml += '<img src="'+ user.avatar +'" class="media-object" alt="library">';
        } else {
            xhtml += '<img src="/images/user/icon_user_default.png" class="media-object" alt="library">';
        }
        xhtml += '</div>';
        xhtml += '<div class="media-body">';
        xhtml += '<div class="space-10"></div>';
        xhtml += '<a href="books.html"><h4 class="media-heading">'+ user.name +'</h4></a>';
        xhtml += '<div class="space-10"></div>';
        xhtml += '<p>'+ user.name +'</p>';
        xhtml += '</div>';
        xhtml += '</div>';
        xhtml += '</div>';
        xhtml += '</div>';
        xhtml += '<div class="space-20"></div>';
        xhtml += '</div>';

        if (status == 1) {
            $('#user_waiting').find('.event-list').append(xhtml);
        } else if (status == 2) {
            $('#user_reading').find('.event-list').append(xhtml);
        } else {
            location.reload();
        }

        showNotify('success', 'Booking success', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});

    }).fail(function (error) {
        var msg = '';
        if (typeof(error.responseJSON.message.description) !== 'undefined') {
            error.responseJSON.message.description.forEach(function (err) {
                msg += err;
            });
        } else {
            msg = 'Don\'t allow booking this book';
        }

        showNotify('dangder', msg, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
};

