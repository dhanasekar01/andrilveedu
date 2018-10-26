'use strict';

app.profile = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('profile');

(function (parent) {
    var
        profileModel = kendo.observable({
           
        });

    parent.set('profileModel', profileModel);

    parent.set('onShow', function (e) {
        var $full_page = $('.full-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('min-height', '100vh');
            $full_page.fadeIn('fast');
        });

        setTimeout(function () {
            $('.card').removeClass('card-hidden');
        }, 700)
    });

    parent.set('afterShow', function (e) {

    });
})(app.profile);
