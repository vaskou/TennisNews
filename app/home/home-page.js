const app = require("application");
const observableModule = require("data/observable");
const HomeViewModel = require("./home-view-model");
var utilityModule = require("utils/utils");

function onNavigatingTo(args) {
    const page = args.object;
    // page.bindingContext = new HomeViewModel();

    var mainList$ = new HomeViewModel([]);

    var pageData = new observableModule.fromObject({
        mainList: mainList$
    });
    
    page.bindingContext = pageData;

    var navigationUrl = '';
    if(typeof page.navigationContext !== "undefined") {
        navigationUrl = page.navigationContext.url;
    }

    mainList$.empty();
    mainList$.load(navigationUrl);
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onTap(args) {
    const button = args.object;
    utilityModule.openUrl(button.data_link);
}


exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onTap = onTap;
