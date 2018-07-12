const application = require("application");
const frameModule = require("ui/frame");
const observableModule = require("data/observable");
const AppRootViewModel = require("./app-root-view-model");

function onLoaded(args) {
    const drawerComponent = args.object;
    var pages$ = new AppRootViewModel();

    var pagesListData = new observableModule.fromObject({
        pagesList: pages$
    });
    
    drawerComponent.bindingContext = pagesListData;
}

function onNavigationItemTap(args) {
    const component = args.object;
    const componentRoute = component.route;
    const componentTitle = component.title;
    const componentUrl = component.url;
    const bindingContext = component.bindingContext;

    //bindingContext.set("selectedPage", componentTitle);

    frameModule.topmost().navigate({
        moduleName: componentRoute,
        context: {
            url: componentUrl
        },
        transition: {
            name: "fade"
        }
    });

    const drawerComponent = application.getRootView();
    drawerComponent.closeDrawer();
}

exports.onLoaded = onLoaded;
exports.onNavigationItemTap = onNavigationItemTap;
