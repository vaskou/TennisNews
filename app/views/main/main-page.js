var observableModule = require("data/observable")
var ObservableArray = require("data/observable-array").ObservableArray;
var MainViewModel = require("./main-view-model");

var mainList = new MainViewModel([]);

var pageData = new observableModule.fromObject({
    mainList: mainList
});

exports.loaded = function (args) {
    var page = args.object;
    var mainListView = page.getViewById("mainListView");
    page.bindingContext = pageData;

    mainList.empty();
    mainList.load();
};