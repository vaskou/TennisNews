const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

const config = require("../shared/config");
const ObservableArray = require("data/observable-array").ObservableArray;

function AppRootViewModel() {
    // const viewModel = observableModule.fromObject({
    //     selectedPage: ""
    // });

    const pages = config.pages;
    const viewModel = new ObservableArray(pages);

    SelectedPageService.getInstance().selectedPage$
    .subscribe((selectedPage) => { viewModel.selectedPage = selectedPage; });

    return viewModel;
}

module.exports = AppRootViewModel;
