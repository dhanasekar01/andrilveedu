'use strict';

(function() {
    var app = {
        data: {},
        user:{},
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        },
        showMore: {
            viewModel: kendo.observable()
        }
    };
    
    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'components/home/view.html'
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });
    };

    $(document).ready(function() {
        var navigationShowMoreView = $('#navigation-show-more-view').find('ul'),
            allItems = $('#navigation-container-more').find('a'),
            navigationShowMoreContent = '';

        allItems.each(function(index) {
            navigationShowMoreContent += '<li>' + allItems[index].outerHTML + '</li>';
        });

        navigationShowMoreView.html(navigationShowMoreContent);
        kendo.bind($('#navigation-show-more-view'), app.showMore.viewModel);

        app.notification = $("#notify");

    });

    app.listViewClick = function _listViewClick(item) {
        var tabstrip = app.mobileApp.view().footer.find('.km-tabstrip').data('kendoMobileTabStrip');
        tabstrip.clear();
    };

    app.newData = function (type, data) {
        
        var syncData = {
            type: type,
            syncData: data
        };

        var syncDatas = [];
        var nonsync = [];
        if (localStorage.getItem("nonsyncdata")) {
            var nonsyncdata = $.parseJSON(localStorage.getItem("nonsyncdata"));
            $.each(nonsyncdata, function (k, v) {
                if (v.type == type) {
                    syncDatas.push(v);
                }
            });
        }

        syncDatas.push(syncData);

        if (navigator && navigator.onLine) {
            var result = app.postData("/ajax/?req=" + type + "&user=" + localStorage.getItem("name") + "&month=" + localStorage.getItem("currentMonth") +"&year="+new Date().getFullYear(), syncDatas);
            if (result.responseText != "") {
                var message = $.parseJSON(result.responseText);
                $.each(message, function (k, v) {
                    if (v.status == -1) {
                        nonsync.push(v.data);
                    }
                });
                
                localStorage.setItem("nonsyncdata", JSON.stringify(nonsync));
            }
        }
    }

    app.sync = function () {
        if (navigator && navigator.onLine) {
            // update non-sync data
            var result = app.postData("/ajax/?req=sync&user=" + localStorage.getItem("name") + "&month=" + localStorage.getItem("currentMonth") + "&year=" + new Date().getFullYear(), {});
            if (result.responseText != "") {
                var message = $.parseJSON(result.responseText);
                $.each(message, function (k, v) {
                    if(typeof v == "object")
                        localStorage.setItem(k, JSON.stringify(v));
                    else
                        localStorage.setItem(k, v);
                });
            }
        }
    }

    app.getCategory = function () {
        
    }

    app.updateSalary = function (currentMonth) {

        var salary = 0.0;
        if (localStorage.getItem(currentMonth + "-"+ new Date().getFullYear()))
            salary = localStorage.getItem(currentMonth + "-" + new Date().getFullYear());

        swal({
            title: 'Salary for ' + currentMonth,
            html: '<div class="form-group">' +
                      '<input id="salary-field" type="text" class="form-control" value="'+salary+'" />' +
                  '</div>',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function (result) {
            localStorage.setItem(currentMonth + "-" + new Date().getFullYear(), $('#salary-field').val());
            
            app.newData("app_salary", {
                key: currentMonth + "-" + new Date().getFullYear(),
                month: currentMonth,
                year: new Date().getFullYear(),
                value: $('#salary-field').val(),
                date: new Date()
            });

            swal({
                type: 'success',
                html: 'You entered: <strong>' +
                        $('#salary-field').val() +
                      '</strong>',
                confirmButtonClass: 'btn btn-success',
                buttonsStyling: false

            })
        }).catch(swal.noop)

        return localStorage.getItem(currentMonth + "-" + new Date().getFullYear());
    }

    app.showNotification = function(message, time) {
        var autoHideAfter = time ? time : 2000;
        swal({
            title: "Message!",
            text: message,
            timer: autoHideAfter,
            showConfirmButton: false
        }).catch(swal.noop);
    };


    app.getData = function (url) {
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: "http://nanbarkal420.somee.com"+url,
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }
    
    app.postData = function (url, data) {
        var result = {};
        $.ajax({
            async: false,
            type: "POST",
            url: "http://nanbarkal420.somee.com"+ url,
            data: JSON.stringify(data),
            dataType: "application/json",
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    }

    app.saveLogin = function (data) {
        localStorage.setItem("name", data.name);
        localStorage.setItem("pin", data.pin);

        if (localStorage.getItem("name")) {
            app.mobileApp.navigate("components/dash/dash.html");
        }
    }

    app.addSpend = function (data) {
        app.mobileApp.navigate("components/spend/spend.html");
    }

    app.getEmployee = function () {
        var url = "/tool/default.aspx";
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: url + "?user=" + localStorage.getItem("mailid"),
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
            }
        });
        return result;
    };

    app.login = function (userName, pwd) {
        var url = "http://nanbarkal420.somee.com/ajax/default.aspx?req=auth";
        var result = {};
        $.ajax({
            async: false,
            type: "GET",
            url: url +"&user="+userName+"&pin="+pwd,
            complete: function (jqxhr, txt_status) {
                result = jqxhr;
				app.showNotification(txt_status);
            }
        });
		
		app.showNotification(result.responseText);
        return result.responseText;
       
    };

    app.logout = function () {
        if (localStorage) {
            localStorage.clear();
            app.mobileApp.navigate("components/home/view.html?value=logout");
        }
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    

    app.getGeoLocation = function () {
        navigator.geolocation.getCurrentPosition(
            function (position) {
               /* alert('Latitude: ' + position.coords.latitude + '\n' +
                      'Longitude: ' + position.coords.longitude + '\n' +
                      'Altitude: ' + position.coords.altitude + '\n' +
                      'Accuracy: ' + position.coords.accuracy + '\n' +
                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                      'Heading: ' + position.coords.heading + '\n' +
                      'Speed: ' + position.coords.speed + '\n' +
                      'Timestamp: ' + position.timestamp + '\n');*/
            },
            function (error) {
                /*alert('code: ' + error.code + '\n' +
                      'message: ' + error.message + '\n'); */
            });
    };


    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };




    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function (viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, culture, cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
                app.showMore.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);