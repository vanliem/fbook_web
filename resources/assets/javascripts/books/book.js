var Book = {};

Book.init = function () {
    var scope = this;
    scope.popUpModal();
};

Book.configs = function () {
    return configs.book;
};

Book.checkAuthorized = function () {
    if (typeof(access_token) === 'undefined' || typeof(user) === 'undefined') {
        showNotify('danger', 'Please login before action', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});

        return false;
    }

    return true;
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
    var scope = this;
    var thumbnailPath = book.image && book.image.web.thumbnail_path !== undefined
        ? book.image.web.thumbnail_path
        : '/images/book_thumb_default.jpg';
    var bookTitle = (book.title && book.title.length) > scope.configs.title_limit_characters
        ? (book.title.substring(0, scope.configs.title_limit_characters) + ' ...')
        : book.title;
    var bookAuthor = (book.author && book.author.length) > scope.configs.author_limit_characters
        ? (book.author.substring(0, scope.configs.author_limit_characters) + ' ...')
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

Book.return = function (data) {
    var scope = this;
    if (!scope.checkAuthorized()) return false;

    var body = JSON.stringify({
        item: {
            book_id: data.book_id,
            owner_id: data.owner_id,
            status: data.status
        }
    });

    $.ajax({
        url: API_PATH + 'books/booking',
        dataType: 'json',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        data: body
    }).done(function () {
        showNotify('success', 'Return success', {icon: 'glyphicon glyphicon-ok'}, {delay: 1000});

        setTimeout(function () {
            window.location.href = '/home';
        }, 3000);
    }).fail(function () {
        showNotify('danger', 'Return errors', {icon: 'glyphicon glyphicon-remove'}, {delay: 1000});

        setTimeout(function () {
            window.location.reload();
        }, 3000);
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

$('#publish_date').datepicker({
    format: 'yyyy-mm-dd'
});

$('.loader').hide();

Book.addNew = function () {
    var scope = this;
    if (!scope.checkAuthorized()) return false;

    if (!$('#form-add-book').valid()) {
        return false;
    }

    $('.loader').show();
    var formData = new FormData();
    formData.append('title', $('#title').val().trim());
    formData.append('author', $('#author').val().trim());
    formData.append('category_id', $('#category').val().trim());
    formData.append('office_id', $('#office').val().trim());
    formData.append('publish_date', $('#publish_date').val());
    formData.append('description', $('#description').val().trim());

    //Attach file
    if ($("[name='image']")[0].files[0]) {
        for (var i = 0; i < $("[name='image']").length; i++) {
            formData.append('medias[' + i + '][file]', $("[name='image']")[i].files[0]);

            if (i === 0) {
                formData.append('medias[' + i + '][type]', 1);
            } else {
                formData.append('medias[' + i + '][type]', 0);
            }
        }
    }

    $.ajax({
        url: API_PATH + 'books',
        headers: {'Accept': 'application/json', 'Authorization': access_token},
        method: 'POST',
        contentType:false,
        cache: false,
        processData:false,
        data: formData
    }).done(function (res) {
        if (res.message.status && res.message.code === 200) {
            window.location.href = '/home';
        }
    }).fail(function (errors) {
        $('.loader').hide();
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

Book.popUpModal = function () {
    var scope = this;
    var elementBooking = $('button[name=booking]');
    var modalWantToRead = $('#modalWantToRead');

    elementBooking.on('click', function () {
        if (!scope.checkAuthorized()) return false;

        modalWantToRead.modal('show');
    });
};

$('#add-owner').on('click', function() {
    swal({
        title: "Are you sure add owner this book?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
    function() {
        if (typeof(access_token) === 'undefined' || typeof(user) === 'undefined') {
            showNotify('danger', 'Add owner fail, Please login to continue', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});

            return false;
        }

        $.ajax({
            url: API_PATH + 'books/add-owner/' + $('.hide-book').data('bookId'),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'GET',
        }).done(function (response) {
            if (response.message.status) {
                var htmlCurrentUser = "<a class='owner-image' data-toggle='tooltip' title='" + user.name +  "' href='/users/" + user.id + "'>";
                if (user.avatar) {
                    htmlCurrentUser += "<img class='img-owner-detail img-circle' src='" + user.avatar + "'";
                    htmlCurrentUser += "class='media-object author-photo img-thumbnail background--white' alt='library'>";
                } else {
                    htmlCurrentUser += "<img class='img-owner-detail img-circle' src='/images/user_default.png'";
                    htmlCurrentUser += "class='media-object author-photo img-thumbnail' alt='library'>";
                }
                htmlCurrentUser += "</a>"
                $('.list-owners').append(htmlCurrentUser);
                showNotify('success', 'Add owner success', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});
            } else {
                showNotify('danger', 'Add owner fail', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
            }
        }).fail(function (error) {
            showNotify('danger', error.responseJSON.message.description, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        });
    });
});

function approveRequestWaiting(userId)
{
    swal({
        title: "Are you sure approve this request?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
    function() {
        if (typeof(access_token) === 'undefined') {
            showNotify('danger', 'Approve request fail, Please login to continue', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});

            return false;
        }

        $.ajax({
            url: API_PATH + 'books/approve/' + $('.hide-book').data('bookId'),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'POST',
            data: JSON.stringify({
                item: {
                    user_id: userId,
                    key: 'approve'
                }
            }),
        }).done(function (response) {
            if (response.message.status) {
                $('.lbl-waiting' + userId).removeClass().addClass('label label-success').addClass('lbl-reading' + userId).html('reading');
                $('.btn-approve-waiting' + userId).attr('onClick', 'unapproveRequestWaiting(' + userId + ')');
                $('.btn-approve-waiting' + userId).removeClass('btn-approve-waiting' + userId).addClass('btn-unapprove-reading' + userId).addClass('btn-xs').html('Unapprove');

                showNotify('success', 'Request approved', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});
            } else {
                showNotify('danger', 'Approve request fail', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
            }
        }).fail(function (error) {
            showNotify('danger', error.responseJSON.message.description, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        });
    });
}

function approveRequestReturning(userId)
{
    swal({
        title: "Are you sure approve this request?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
    function() {
        if (typeof(access_token) === 'undefined') {
            showNotify('danger', 'Approve request fail, Please login to continue', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});

            return false;
        }

        $.ajax({
            url: API_PATH + 'books/approve/' + $('.hide-book').data('bookId'),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'POST',
            data: JSON.stringify({
                item: {
                    user_id: userId,
                    key: 'approve'
                }
            }),
        }).done(function (response) {
            if (response.message.status) {
                $('.lbl-returning' + userId).removeClass().addClass('label label-success').addClass('lbl-returned' + userId).html('returned');
                $('.btn-approve-returning' + userId).remove();

                showNotify('success', 'Request approved', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});
            } else {
                showNotify('danger', 'Approve request fail', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
            }
        }).fail(function (error) {
            showNotify('danger', error.responseJSON.message.description, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        });
    });
}

function unapproveRequestWaiting(userId)
{
    swal({
        title: "Are you sure unapprove this request?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    },
    function() {
        if (typeof(access_token) === 'undefined') {
            showNotify('danger', 'Approve request fail, Please login to continue', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});

            return false;
        }

        $.ajax({
            url: API_PATH + 'books/approve/' + $('.hide-book').data('bookId'),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': access_token,
            },
            type: 'POST',
            data: JSON.stringify({
                item: {
                    user_id: userId,
                    key: 'unapprove'
                }
            }),
        }).done(function (response) {
            if (response.message.status) {
                $('.lbl-reading' + userId).removeClass().addClass('label label-warning').addClass('lbl-waiting' + userId).html('waiting');
                $('.btn-unapprove-reading' + userId).attr('onClick', 'approveRequestWaiting(' + userId + ')');
                $('.btn-unapprove-reading' + userId).removeClass('btn-unapprove-reading' + userId).addClass('btn-approve-waiting' + userId).addClass('btn-xs').html('Approve');

                showNotify('success', 'Request unapproved', {icon: 'glyphicon glyphicon-ok'}, {delay: 3000});
            } else {
                showNotify('danger', 'Unapprove request fail', {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
            }
        }).fail(function (error) {
            showNotify('danger', error.responseJSON.message.description, {icon: 'glyphicon glyphicon-remove'}, {delay: 3000});
        });
    });
}
