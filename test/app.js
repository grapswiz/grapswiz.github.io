let printCharacteristic;

sendTextData = () => {
    let encoder = new TextEncoder('utf-8');
};

document.querySelector("#requestButton").addEventListener("click", () => {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: ['000018f0-0000-1000-8000-00805f9b34fb']
        }]
    })
        .then(device => {
            console.log('> Found ' + device.name);
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"))
        .then(service => service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"))
        .then(characteristic => {
            printCharacteristic = characteristic;
            console.log(printCharacteristic);
        })
        .catch(error => console.log(error));
}, false);
