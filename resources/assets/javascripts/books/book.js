var Book = {};

Book.init = function () {
    var scope = this;
};

Book.handle = function () {

};

Book.loadMoreBook = function (data) {
    var scope = this;
    var url = data.field !== undefined ?
        API_PATH + 'books/?field=' + data.field + '&page=' + data.nextPage
        : API_PATH + 'books/category/' + data.categoryId + '/?page=' + data.nextPage;

    $.ajax({
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'GET'
    }).done(function (response) {
        if (data.field !== undefined) {
            response.item.data.forEach(function (book) {
                $('.row .ajax-book-content').append(scope.generateBookXhtml(book));
            });
        } else {
            response.item.category.data.forEach(function (book) {
                $('.row .ajax-book-content').append(scope.generateBookXhtml(book));
            });
        }

        if (response.item.next_page !== null) {
            $('.btn-loadmore-book').attr('data-next-page', response.item.next_page);
        } else {
            $('.btn-loadmore-book').remove();
        }

    }).fail(function (errors) {
        var msg = '';
        if (typeof(errors.responseJSON.message.description) !== 'undefined') {
            errors.responseJSON.message.description.forEach(function (err) {
                msg += err;
            });
        } else {
            msg = 'Can\'t load more';
        }

        showNotify('danger', msg, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
};

Book.generateBookXhtml = function (book) {
    var bookConfigs = configs.book;
    var thumbnailPath = book.image.web.thumbnail_path !== undefined
        ? book.image.web.thumbnail_path
        : '/images/book_thumb_default.jpg';
    var bookTitle = (book.title && book.title.length) > bookConfigs.title_limit_characters
        ? (book.title.substring(0, bookConfigs.title_limit_characters) + ' ...')
        : book.title;
    var bookAuthor = (book.author && book.author.length) > bookConfigs.author_limit_characters
        ? (book.author.substring(0, bookConfigs.author_limit_characters) + ' ...')
        : book.author;

    var xhtml = '';
    xhtml += '<div class="col-xs-12 col-md-6">';
    xhtml += '<div class="category-item well yellow">';
    xhtml += '<div class="media">';
    xhtml += '<div class="media-left">';
    xhtml += '<img src="'+ thumbnailPath +'" class="media-object" alt="Framgia Book">';
    xhtml += '</div>';
    xhtml += '<div class="media-body">';
    xhtml += '<h5 title="'+ bookTitle +'">' + bookTitle + '</h5>';
    xhtml += '<h6 title="'+ bookAuthor +'">' + bookAuthor + '</h6>';
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

Book.ajaxSortBook = function (data) {
    var scope = this;
    var body = JSON.stringify({
        sort : {
            by: data.sortBy,
            order_by: data.orderBy
        }
    });
    var url = (data.field !== undefined) ?
        (API_PATH + 'books/filters?field='+ data.field +'&page='+ data.currentPage)
        : (API_PATH + 'books/category/'+ data.categoryId +'/filter/?page='+ data.currentPage);

    $.ajax({
        url: url,
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'POST',
        data: body
    }).done(function (response) {
        var result = data.field !== undefined ? response.item : response.item.category;

        if (result.data.length > 0) {
            var elementBookContent = $('.row .ajax-book-content');
            var xhtml = '';

            elementBookContent.empty();
            result.data.forEach(function (book) {
                xhtml += scope.generateBookXhtml(book);
            });
            elementBookContent.html(xhtml);

            showNotify('success', 'Sort success', {icon: 'glyphicon glyphicon-ok'}, {delay: 2000});
        }
    }).fail(function (errors) {
        var msg = '';
        if (typeof(errors.responseJSON.message.description) !== 'undefined') {
            errors.responseJSON.message.description.forEach(function (err) {
                msg += err;
            });
        } else {
            msg = 'Can\'t load more';
        }

        showNotify('danger', msg, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
    });
};

