const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

const config = require("../shared/config");
const fetchModule = require("fetch");
const ObservableArray = require("data/observable-array").ObservableArray;
const parseString = require('nativescript-xml2js').parseString;
const htmlparser = require("htmlparser");

function HomeViewModel(items) {
    SelectedPageService.getInstance().updateSelectedPage("Home");

    var viewModel = new ObservableArray(items);

    viewModel.load = function(navUrl) {
        var baseUrl = config.baseApiUrl + navUrl + config.format;
        
        return fetch(baseUrl, {
            // headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function(response) {

            return parseRss(response);
            
        })
        .then(function(data) {

            data.forEach(function(item) {
                viewModel.push(item);
                // console.dir(grocery);
            });

        });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    return viewModel;
}

async function parseRss(response) {
    var result = new Array;

    await parseString(response._bodyInit, function (err, res) {

        resp = res.rss.channel[0].item;
        
        resp.forEach(function(item){

            parseHtml(item.description[0]).then(function(res){

                result.push({
                    title: item.title[0],
                    description: res.text,
                    image_src: res.image_src
                });

            })

        });
        
    });

    return result;
}

async function parseHtml(response) {

    var result;
    var handler = new htmlparser.DefaultHandler(function () {});
    var parser = new htmlparser.Parser(handler);

    parser.parseComplete(response);

    var image_src = '';
    var text = '';

    handler.dom.forEach(function(item){

        if(item.type == 'tag'){

            if(item.children){

                item.children.forEach(function(child){

                    if(child.type == 'tag' && child.name == 'img'){
                        image_src = child.attribs.src;
                    }

                    if(child.type == 'text'){
                        text += child.data
                        text = text.replace(/&nbsp;/g,' ');
                    }

                    if(child.type == 'tag' && child.name == 'a'){
                        text += child.children[0].data;
                        text = text.replace(/&nbsp;/g,' ');
                    }

                })

            }

        }

    });

    result = {
        text: text,
        image_src: image_src
    }

    return result;
}

function handleErrors(response) {

    if (!response.ok) {

        console.log(JSON.stringify(response));
        throw Error(response.statusText);

    }

    return response;
}

module.exports = HomeViewModel;
