'use strict';

app.chart = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('chart');

(function (parent) {
    var
        chartModel = kendo.observable({
           
        });

    parent.set('chartModel', chartModel);

    parent.set('onShow', function (e) {
        var $full_page = $('.full-page');

        $full_page.fadeOut('fast', function () {
            $full_page.css('background-image', 'url("' + $full_page.attr('data-image') + '")');
            $full_page.css('min-height', '100vh');
            $full_page.fadeIn('fast');
        });

    });

    parent.set('afterShow', function (e) {

    });
})(app.chart);
