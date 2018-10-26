'use strict';

app.dash = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('dash');

(function (parent) {
    var
        dashModel = kendo.observable({
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            username: "Hi " + localStorage.getItem("username") + "".toUpperCase(),
            currentMonth: "Loading...",
            salary: 0.0,
            datetime: "As of now " + new Date().toLocaleTimeString(),
            totalSpends: 0.0,
            task: "",
            newTask: "",
            completedTasks:[],
            tasks:[],
            updateSalary: function () {
                app.updateSalary(dashModel.currentMonth);
                dashModel.set("salary", localStorage.getItem(dashModel.currentMonth + "-" + new Date().getFullYear()));
            },
            showSpends: function () {
                var template = kendo.template($("#spendTemplate").html());
                if (localStorage.getItem(dashModel.currentMonth + "-spend-" + new Date().getFullYear())) {
                    var data = $.parseJSON(localStorage.getItem(dashModel.currentMonth + "-spend-" + new Date().getFullYear()));

                    var tempData = {
                        data: data
                    }
                    var result = template(tempData);
                    $("#spends").html(result);
                    dashModel.showCategory();

                    dashModel.set('totalSpends', localStorage.getItem(dashModel.currentMonth + "-util-" + new Date().getFullYear()));
                } else {
                    $("#spends").html("<tr><td>No Spend for this Month.</td></tr>");
                }
            },
            showMoreSpends: function(){
                app.mobileApp.navigate("components/spendlist/spendlist.html");
            },
            addspend: function(){
                app.addSpend();
            },
            showTasks: function(){
                if (localStorage.getItem("tasks")) {
                    dashModel.set("tasks", $.parseJSON(localStorage.getItem("tasks")));
                }
                if (localStorage.getItem("completedTasks")) {
                    dashModel.set("completedTasks", $.parseJSON(localStorage.getItem("completedTasks")));
                }
            },
            addTask: function () {
                dashModel.get("tasks").push({
                    task: dashModel.get("newTask"),
                    date: new Date(),
                    status: "new",
                    user: localStorage.getItem("name")
                });
                
                app.newData("app_task", {
                    task: dashModel.get("newTask"),
                    date: new Date(),
                    status: "new",
                    user: localStorage.getItem("name")
                });

                dashModel.set("newTask", "");
                localStorage.setItem("tasks", JSON.stringify(dashModel.get("tasks")));
            },
            completeTask: function (e) {
                var task = e.data;
                var tasks = dashModel.get("tasks");
                var index = tasks.indexOf(task);
                tasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(dashModel.get("tasks")));
                
                dashModel.get("completedTasks").push({
                    task: task.task,
                    date: new Date(),
                    status: "completed",
                    user: localStorage.getItem("name")
                });
                localStorage.setItem("completedTasks", JSON.stringify(dashModel.get("completedTasks")));

                app.newData("app_task", {
                    task: task.task,
                    date: new Date(),
                    status: "completed",
                    user: localStorage.getItem("name")
                });

            },
            deleteCompletedTask: function (e) {
                var task = e.data;
                var tasks = dashModel.get("completedTasks");
                var index = tasks.indexOf(task);
                tasks.splice(index, 1);
                localStorage.setItem("completedTasks", JSON.stringify(dashModel.get("completedTasks")));

                app.newData("app_task", {
                    task: task.task,
                    date: new Date(),
                    status: "deleted",
                    user: localStorage.getItem("name")
                });
            },
            deleteTask: function (e) {
                var task = e.data;
                var tasks = dashModel.get("tasks");
                var index = tasks.indexOf(task);
                tasks.splice(index, 1);
                localStorage.setItem("tasks", JSON.stringify(dashModel.get("tasks")));
                app.newData("app_task", {
                    task: task.task,
                    date: new Date(),
                    status: "deleted",
                    user: localStorage.getItem("name")
                });
            },
            showCategory: function () {
                var template = kendo.template($("#categoryTemplate").html());

                var data = [
                    {
                        "category": "Shopping",
                        "img": "img/category/shopping.png"
                    },
                    {
                        "category": "Bills",
                        "img": "img/category/bills.png"
                    },
                    {
                        "category": "Dog",
                        "img": "img/category/dog.png"
                    },
                    {
                        "category": "EMI",
                        "img": "img/category/emi.png"
                    },
                    {
                        "category": "Food",
                        "img": "img/category/food.png"
                    },
                    {
                        "category": "Fuel",
                        "img": "img/category/fuel.png"
                    },
                    {
                        "category": "Transfer",
                        "img": "img/category/transfer.png"
                    },
                    {
                        "category": "Groceries",
                        "img": "img/category/groceries.png"
                    },
                    {
                        "category": "Health",
                        "img": "img/category/health.png"
                    },
                    {
                        "category": "Milk",
                        "img": "img/category/milk.png"
                    },
                    {
                        "category": "Movies",
                        "img": "img/category/movies.png"
                    },
                    {
                        "category": "Snacks",
                        "img": "img/category/snacks.png"
                    },
                    {
                        "category": "Tickets",
                        "img": "img/category/tickets.png"
                    }
                ];

                var tempData = {
                    data: data
                }
                var result = template(tempData);
                $("#category").html(result);

                var template1 = kendo.template($("#todoTemplate").html());
                var result1 = template1(tempData);
                $("#todo").html(result1);


                var swiper = new Swiper('#categorySwiper', {
                    slidesPerView: 6,
                    spaceBetween: 3,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });

                var swiper = new Swiper('#todoSwiper', {
                    slidesPerView: 2,
                    spaceBetween: 3,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }

        });

    parent.set('dashModel', dashModel);

    function queryInputKeyDown(event) {
        if (event.which !== 13) {
            return;
        }
        dashModel.set("newTask", document.getElementById("newTask").value)
        dashModel.addTask();
    }

    parent.set('onShow', function (e) {
        dashModel.set("currentMonth", dashModel.monthNames[new Date().getMonth()]);
        localStorage.setItem("currentMonth", dashModel.monthNames[new Date().getMonth()]);

        app.sync();

        var newTask = document.getElementById("newTask");
        newTask.addEventListener("keydown", queryInputKeyDown);

        dashModel.set("Welcome", localStorage.getItem("name"));

        if (localStorage.getItem(dashModel.currentMonth + "-" + new Date().getFullYear())) {
            dashModel.set("salary", localStorage.getItem(dashModel.currentMonth + "-" + new Date().getFullYear()));
        } else {
            dashModel.updateSalary();
        }

        var util = localStorage.getItem(dashModel.currentMonth + "-utilpercent-" + new Date().getFullYear()) ? parseInt(localStorage.getItem(dashModel.currentMonth + "-utilpercent-" + new Date().getFullYear())) : 0;
        var pertext = util;
        if (util > 100) {
            util = 100;
        }

        $('#jq').LineProgressbar({
            percentage: util,
            percentageText:pertext,
            fillBackgroundColor: '#3498db',
            backgroundColor: '#EEEEEE',
            radius: '0px',
            height: '5px',
            width: '100%'
        });


        var links = [
            {
                "bgcolor": "#03A9F4",
                "icon": "+"
            },
            {
                "url": "http://plus.google.com",
                "bgcolor": "#DB4A39",
                "color": "#fffff",
                "icon": "<i class='fa fa-google-plus'></i>",
                "target": "_blank"
            }
        ];

        $('.kc_fab_wrapper').kc_fab(links);
        
        dashModel.showSpends();
        dashModel.showTasks();

    });


    parent.set('afterShow', function (e) {
        

    });
})(app.dash);
