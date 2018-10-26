'use strict';

app.lock = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('lock');

(function (parent) {
    var
        lockModel = kendo.observable({
            username: "",
            password: "",
            autologin: function () {
                if (lockModel.password.length == 4) {
                    lockModel.signin();
                }
            },
            validateData: function () {
                var model = lockModel;

                if (lockModel.password == '') {
                    app.showNotification('Please enter the PIN');
                    return false;
                }

                if (lockModel.password.length < 4) {
                    app.showNotification('Please enter 4-digit PIN');
                    return false;
                }

                if ($.base64.encode(lockModel.password) != localStorage.getItem("pin")) {
                    app.showNotification('Incorrect PIN. Try again.');
                    return false;
                }

                return true;
            },
            signin: function () {
                console.log("Trying to sign in");
                if (lockModel.validateData()) {
                    console.log("Logged in");
                    app.mobileApp.navigate("components/dash/dash.html");
                }
            }
        });

    parent.set('lockModel', lockModel);

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


        if (localStorage.getItem("name") != null && localStorage.getItem("name") != undefined) {
            lockModel.set("username", localStorage.getItem("name"));
            $('#loginUserImg').attr("src", "img/" + localStorage.getItem("name") +".jpg");
        } else {
            app.mobileApp.navigate("components/home/view.html");
        }

    });

    parent.set('afterShow', function (e) {

    });
})(app.lock);
