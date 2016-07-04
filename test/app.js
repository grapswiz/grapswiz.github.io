document.querySelector("#requestSM1Button").addEventListener("click", () => {
    navigator.bluetooth.requestDevice({
    filters: [{
        namePrefix: "SM1"
    }]
})
    .then(found, error);
}, false);
document.querySelector("#requestBlueButton").addEventListener("click", () => {
    navigator.bluetooth.requestDevice({
        filters: [{
            namePrefix: "Blue"
        }]
    })
        .then(found, error);
}, false);

function gatt(server) {
    console.log(server);
}

function found(device) {
    console.log(device);
    device.gatt.connect().then(gatt, error);
}

function error(e) {
    console.error(e);
}