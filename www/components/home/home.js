'use strict';

app.home = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('home');

(function (parent) {
    var
        homeModel = kendo.observable({
            username: "",
            password: "",
            validateData: function () {
                var model = homeModel;

                if (homeModel.username == '' && homeModel.password == '') {
                    app.showNotification('Missing credentials');
                    return false;
                }

                if (homeModel.username == '') {
                    app.showNotification('Missing username');
                    return false;
                }

                if (homeModel.password == '') {
                    app.showNotification('Missing password');
                    return false;
                }

                return true;
            },
            signin: function () {
                if (homeModel.validateData()) {
                    localStorage.setItem("username", homeModel.username);
                    var result = app.login(homeModel.username, $.base64.encode(homeModel.password));

                    if (result == homeModel.username) {
                        var message = [{ name: homeModel.username, pin: $.base64.encode(homeModel.password) }];
                        $("#loginuser").val("");
                        $("#login-password").val("");
                        app.saveLogin(message[0]);
                    } else {
                        app.showNotification('Login Failed');
                    }

                    

                    
                }
            }
        });

    parent.set('homeModel', homeModel);

    function queryInputKeyDown(event) {
        if (event.which !== 13) {
            return;
        }
        homeModel.set("password", $("#login-password").val());
        homeModel.set("username", $("#loginuser").val());
        
        homeModel.signin();
    }

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


        if (localStorage.getItem("name")) {
            app.mobileApp.navigate("components/lock/lock.html");
        }

    });

    parent.set('afterShow', function (e) {

    });
})(app.home);
