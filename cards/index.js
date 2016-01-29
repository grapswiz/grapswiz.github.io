"use strict";

let parse = (require("csv-parse"));

((global) => {
    const DOM_CONTENT_LOADED = "DOMContentLoaded";
    const GENERATE_BUTTON = "#generateButton";
    const CSV_INPUT = "#csv";
    const CLICK = "click";

    const NUM_OF_CARDS = 10;

    let display = (people) => {
        let link = global.document.querySelector("link[rel='import']");
        let content = link.import;
        let source = content.querySelector("section");
        //TODO section1つに10件入れる。

        let section = source.cloneNode(true);
        let images = section.querySelectorAll("img");
        let accounts = section.querySelectorAll(".account");
        let id;
        for (let i = 1; i < people.length; i++) {
            id = people[i][1];
            images[(i-1)%NUM_OF_CARDS].src = "https://twitter.com/" + id + "/profile_image?size=original";
            accounts[(i-1)%NUM_OF_CARDS].innerHTML = "@" + id;

            if (i % NUM_OF_CARDS == 0 || i == people.length-1) {
                global.document.body.appendChild(section);
                section = source.cloneNode(true);
                images = section.querySelectorAll("img");
                accounts = section.querySelectorAll(".account");
            }
        }
    };

    let processCsv = (csv) => {
        parse(csv, {}, (err, output) => {
            console.log(err, output);
            display(output);
        });
    };


    let loadHandler = (e) => {
        let csv = e.target.result;
        processCsv(csv);
    };

    let errorHandler = (e) => {
        if (e.target.error.name == "NotReadableError") {
            global.alert("cannot read file.");
        }
    };

    let generate = () => {
        let csv = global.document.querySelector(CSV_INPUT);
        let files = csv.files;

        let reader = new FileReader();

        for (let i = 0, f; f = files[i]; i++) {
            if (!f.type.match(".*csv")) {
                return;
            }
            reader.readAsText(f, "sjis");
            reader.onload = loadHandler;
            reader.onerror = errorHandler;
        }
    };

    global.document.addEventListener(DOM_CONTENT_LOADED, () => {
        let button = global.document.querySelector(GENERATE_BUTTON);
        button.addEventListener(CLICK, () => {
            generate();
        });
    });
})(window);