var Observable = require("data/observable").Observable;
var http = require("http");
var parseString = require('nativescript-xml2js').parseString;


function getMessage(counter) {
    if (counter <= 0) {
        return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
    } else {
        return counter + " taps left";
    }
}

function createViewModel() {
    var viewModel = new Observable();
    viewModel.counter = 42;
    viewModel.message = getMessage(viewModel.counter);
    // viewModel.myItems = [{title: 'test1'},{title:"test2"}];
    viewModel.onTap = function() {
        // this.counter--;
        // this.set("message", getMessage(this.counter));
        http.getString("http://www.tennisnews.gr/index.php?format=feed&type=rss")
        .catch(function (error) {
            console.log(error);
        })
        .then(function (r) {
            //// Argument (r) is string!
            // console.log(r);
            parseString(r, (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    console.dir(result);
                    viewModel.items = result.rss.channel[0].item;
                }
            })
        }, function (e) {
            //// Argument (e) is Error!
        });
    }

    return viewModel;
}

function getData() {
    var viewModel = new Observable();

    http.getString("http://www.tennisnews.gr/index.php?format=feed&type=rss")
    .catch(function (error) {
        console.log(error);
    })
    .then(function (r) {
        //// Argument (r) is string!
        // console.log(r);
        parseString(r, (err, result) => {
            if(err){
                console.log(err);
            }else{
                console.dir(result);
                this.set("items", result.rss.channel[0].item);
            }
        })
    }, function (e) {
        //// Argument (e) is Error!
    });

}

exports.createViewModel = createViewModel;