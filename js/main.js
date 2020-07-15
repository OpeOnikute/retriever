$("#input-form").submit(function(e) {
    e.preventDefault();
    if (!uploaded) {
        displayError("Please upload a file first.");
        return;
    }
    run();
});

$('input[type=file]').on('change', prepareUpload);

const sampleItems = [
    {
        amount: 30000,
        duration: 8, // months
        interest: 35
    },
    {
        amount: 5000,
        duration: 4, // months
        interest: 45
    },
    {
        amount: 5000,
        duration: 4, // months
        interest: 35
    },
    {
        amount: 5000,
        duration: 3, // months
        interest: 45
    },
];

// var sampleItem = 

const config = {
    // 10 seconds
    errorDuration: 5 * 1000
}

let uploaded = false;
let uploadedFile;

function prepareUpload (event) {
    uploaded = true;
    $("#submit-btn").removeAttr("disabled");
    uploadedFile = event.target.files[0];
}

function run () {
    parseInput(function(err, items) {
        
        if (err) {
            return displayError(err);
        }

        const result = calculateResult(items);
        showResult(result);
    });
}

function parseInput (callback) {
    Papa.parse(uploadedFile, {
        header: true,
        error: function(err, file, inputElem, reason)
        {
            // executed if an error occurs while loading the file,
            // or if before callback aborted for some reason
            callback(err, null);
        },
        complete: function(results)
        {
            // executed after all files are complete
            callback(null, results.data);
        }
    });
}

function calculateResult(items) {
    let result = 0;

    for (let item of items) {
        result += (item.amount * item.interest * 100) / item.duration;
    }

    return result;
}


function clearResult() {
    const resultDiv = $("#results");
    const resultText = $("#results-text");

    if (!resultDiv || !resultText) {
        return console.error("Result div/text not found! IDs are 'results' and 'results-text'.")
    }

    resultDiv.hide();
    resultText.html("").hide();
}

function showResult (result) {

    // format result (commas)
    
    const formatted = Math.ceil(result).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    const resultDiv = $("#results");
    const resultText = $("#results-text");
    const form = $("#form");
    
    if (!resultDiv || !resultText) {
        return console.error("Result div/text not found! IDs are 'results' and 'results-text'.")
    }

    form.hide();
    resultDiv.show();
    resultText.html(formatted).show();
}



function displayError (err) {
    // fetch error div by ID
    const div = $("#error")
    
    if (!div) return console.error(`Error div not found! Error to be displayed: ${err}`);

    div.html(err).show();

    // remove the error after set duration
    setTimeout(removeError, config.errorDuration)
}

function removeError () {
    const div = $("#error")
    
    if (!div) return console.error(`Error div not found! Could not 'remove' it`);

    div.html("").hide();
}