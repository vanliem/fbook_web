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
        showNotify('danger', "Don't allow load more books", {icon: "glyphicon glyphicon-remove"}, {delay: 1000});
    });
};

Book.loadMoreAtListBooksByCategoryPage = function (categoryId, page) {
    var scope = this;
    $.ajax({
        url: API_PATH + 'books/category/' + categoryId + '/?page=' + page,
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
        showNotify('danger', msg, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
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

    var bookTitle = (book.title.length) > configs.book.title_limit_characters
     ? (book.title.substring(0, configs.book.title_limit_characters) + ' ...') : book.title;
    xhtml += '<h5 title="'+ book.title +'">' + bookTitle + '</h5>';

    var bookAuthor = (book.author.length) > configs.book.author_limit_characters ? (book.author.substring(0, configs.book.author_limit_characters) + ' ...') : book.author;
    xhtml += '<h6 title="'+ book.title +'">' + bookAuthor + '</h6>';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<input id="rating-book" name="star" class="rating" disabled="true" value="' + book.avg_star + '"data-size="xs">';
    xhtml += '</ul>';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<p>'+ book.overview +'</p>';
    xhtml += '<a href="/books/'+ book.id +'" class="text-primary">View detail</a>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '<script src="/bower/bootstrap-star-rating/js/star-rating.js"></script>';
    xhtml += '<link href="/bower/bootstrap-star-rating/css/star-rating.css" rel="stylesheet" type="text/css">';
    xhtml += '<link href="/bower/bootstrap-star-rating/css/theme-krajee-fa.css" rel="stylesheet" type="text/css">';

    return xhtml;
};

Book.booking = function (bookId, status) {
    if (typeof(access_token) === 'undefined' || typeof(user) === 'undefined') {
        showNotify('danger', 'Please login before booking', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        return false;
    }
    var scope = this;
    var data = JSON.stringify({
        item : {
            book_id: bookId,
            status: status
        }
    });

    $.ajax({
        url: API_PATH + 'books/booking',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        data: data
    }).done(function () {
        var buttonBooking = $('#booking-book');
        var userWaitings = $('#user_waiting .event-list');
        var userReading = $('#user_reading .event-list');
        var bookUserStatus = configs.book_user.status;
        var xhtml = scope.generateUserXhtml(user);
        var action = buttonBooking.text();

        $('section:eq(1)').find('#user-'+ user.id).remove();

        switch (parseInt(status)) {
            case bookUserStatus.waiting:
                userWaitings.append(xhtml);
                buttonBooking.attr('data-status', bookUserStatus.cancel_waiting).html('Cancel Waiting');
                break;

            case bookUserStatus.reading:
                userReading.append(xhtml);
                buttonBooking.attr('data-status', bookUserStatus.done).html('Return Book');
                break;

            case bookUserStatus.done:
                if (userReading.children().length > 0) {
                    buttonBooking.attr('data-status', bookUserStatus.waiting).html('Add to Waiting');
                } else if (userWaitings.children().length > 0) {
                    buttonBooking.attr('data-status', bookUserStatus.reading).html('Add to Reading');
                } else {
                    buttonBooking.attr('data-status', bookUserStatus.reading).html('Add to Reading');
                }
                break;

            case bookUserStatus.cancel_waiting:
                if (userReading.children().length > 0) {
                    buttonBooking.attr('data-status', bookUserStatus.waiting).html('Add to Waiting');
                } else if (userWaitings.children().length > 0) {
                    buttonBooking.attr('data-status', bookUserStatus.reading).html('Add to Reading');
                } else {
                    buttonBooking.attr('data-status', bookUserStatus.reading).html('Add to Reading');
                }
                break;
        }

        showNotify('success', action +' success', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});

    }).fail(function (error) {
        var msg = '';
        if (typeof(error.responseJSON.message.description) !== 'undefined') {
            error.responseJSON.message.description.forEach(function (err) {
                msg += err;
            });
        } else {
            msg = 'Don\'t allow booking this book';
        }

        showNotify('danger', msg, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
};

Book.generateUserXhtml = function (user) {
    var xhtml = '';
    xhtml += '<div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-9" id="user-'+ user.id +'">';
    xhtml += '<div class="event-item wow fadeInRight">';
    xhtml += '<div class="well">';
    xhtml += '<div class="media">';
    xhtml += '<div class="media-left">';

    if (user.avatar !== null) {
        xhtml += '<img src="'+ user.avatar +'" class="media-object w-70-h-70" alt="library">';
    } else {
        xhtml += '<img src="/images/user/icon_user_default.png" class="media-object w-70-h-70" alt="library">';
    }
    xhtml += '</div>';
    xhtml += '<div class="media-body">';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<a href="#"><h4 class="media-heading">'+ user.name +'</h4></a>';
    xhtml += '<div class="space-10"></div>';
    xhtml += '<p>'+ user.name +'</p>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '</div>';
    xhtml += '<div class="space-20"></div>';
    xhtml += '</div>';

    return xhtml;
};

Book.sortBooksBy = function (data) {
    var scope = this;
    var body = JSON.stringify({
        sort : {
            field: data.sortBy,
            order_by: data.orderBy
        }
    });

    $.ajax({
        url: API_PATH + 'books/filters?field='+ data.field +'&page='+ data.currentPage,
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'POST',
        data: body
    }).done(function (results) {
        if (results.item.data.length > 0) {
            var elementBookContent = $('.row .ajax-book-content');
            var xhtml = '';
            elementBookContent.empty();

            results.item.data.forEach(function (book) {
                xhtml += scope.generateBookXhtml(book);
            });
            elementBookContent.html(xhtml);

            showNotify('success', 'Sort success', {icon: 'glyphicon glyphicon-ok'}, {delay: 2000});
        }
    }).fail(function (error) {
        showNotify('danger', 'Sort error', {icon: 'glyphicon glyphicon-remove'}, {delay: 2000});
    });
};
