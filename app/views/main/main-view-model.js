var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;
var parseString = require('nativescript-xml2js').parseString;
var htmlparser = require("htmlparser");


function MainViewModel(items) {

    var baseUrl = config.apiUrl;
    var viewModel = new ObservableArray(items);

    viewModel.load = function() {
        return fetch(baseUrl, {
            // headers: getCommonHeaders()
        })
        .then(handleErrors)
        .then(function(response) {
            // console.dir(response._bodyInit);
            var resp;
            // parseString(response._bodyInit, function (err, result) {
            //     console.dir(result.rss.channel[0].item);
            //     resp = result.rss.channel[0].item;
            //     // return resp.json();
            //     resp.forEach(function(item) {
                    
            //         viewModel.push({
            //             title: item.title,
            //             description: item.description[0]
            //         });
            //     });
                
            // });
            // resp = parseResponse(response);
            // // console.log(resp);
            // resp.then(function(data){
            //     console.dir(data);
            // })
            return parseResponse(response);

        

            // return response.json();
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

async function parseResponse(response) {
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
                        text = child.data;
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

// async function parseHtml(response) {
//     var result;
//     //console.dir(response);
//     await parseString(response, function (err, res) {
//         console.dir(res);
//         // resp = result.rss.channel[0].item;
//         result = {
//             text: res.p._,
//             image_src: res.p.img[0].$.src
//         };
        
//     });
//     return result;
// }

// function getMessage(counter) {
//     if (counter <= 0) {
//         return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
//     } else {
//         return counter + " taps left";
//     }
// }

// function createViewModel() {
//     var viewModel = new Observable();
//     viewModel.counter = 42;
//     viewModel.message = getMessage(viewModel.counter);
//     // viewModel.myItems = [{title: 'test1'},{title:"test2"}];
//     viewModel.onTap = function() {
//         // this.counter--;
//         // this.set("message", getMessage(this.counter));
//         http.getString("http://www.tennisnews.gr/index.php?format=feed&type=rss")
//         .catch(function (error) {
//             console.log(error);
//         })
//         .then(function (r) {
//             //// Argument (r) is string!
//             // console.log(r);
//             parseString(r, (err, result) => {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.dir(result);
//                     viewModel.items = result.rss.channel[0].item;
//                 }
//             })
//         }, function (e) {
//             //// Argument (e) is Error!
//         });
//     }

//     return viewModel;
// }

// function getData() {
//     var viewModel = new Observable();

//     http.getString("http://www.tennisnews.gr/index.php?format=feed&type=rss")
//     .catch(function (error) {
//         console.log(error);
//     })
//     .then(function (r) {
//         //// Argument (r) is string!
//         // console.log(r);
//         parseString(r, (err, result) => {
//             if(err){
//                 console.log(err);
//             }else{
//                 console.dir(result);
//                 this.set("items", result.rss.channel[0].item);
//             }
//         })
//     }, function (e) {
//         //// Argument (e) is Error!
//     });

// }

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = MainViewModel;