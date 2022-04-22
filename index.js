var Service, Characteristic;
var request = require('sync-request');
var DigestFetch = require("digest-fetch");

var url 

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-axis-lock-switch", "SimpleHttpSwitch", SimpleHttpSwitch);
}


function SimpleHttpSwitch(log, config) {
    this.log = log;

    // url info
    this.url = config["url"];
    this.http_method = config["http_method"];
    this.sendimmediately = config["sendimmediately"];
    this.default_state_off = config["default_state_off"];
    this.name = config["name"];
    this.username = config["username"];
    this.password = config["password"];
}

SimpleHttpSwitch.prototype = {

/*	
    httpRequest: function (url, body, method, username, password, sendimmediately, callback) {

        var client = new DigestFetch(username, password);
//	 	            var url = 'http://192.168.1.68/axis-cgi/io/port.cgi?action=4:/7000%5C';
        var options = {}
        client.fetch(url, options)
	                  .then(resp=>resp.json())
	                  .then(data=>console.log(data))
	                  .catch(e=>console.error(e))


    },
*/
    getPowerState: function (callback) {
        callback(null, !this.default_state_off);
    },

    setPowerState: function(powerOn, callback) {
        var client = new DigestFetch(this.username, this.password);
//	 	            var url = 'http://192.168.1.68/axis-cgi/io/port.cgi?action=4:/7000%5C';
        var options = {}
        client.fetch(this.url, options)
	                  .then(resp=>resp.json())
	                  .then(data=>console.log(data))
	                  .catch(e=>console.error(e))
	callback();
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Axis")
                .setCharacteristic(Characteristic.Model, "Video doorbell ")
                .setCharacteristic(Characteristic.SerialNumber, "1234");

        switchService = new Service.Switch(this.name);
        switchService
                .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

    
        return [switchService];
    }
};
