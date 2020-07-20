var noble = require('noble');
var mathjs = require('mathjs');

var state = {
	color: null,
	code: null,
	id: 'ff:ff:38:59:a8:31'
}

noble.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		noble.startScanning([], false);
	} else {
		console.log('stopScan');
		noble.stopScanning();
	}
});

noble.on('scanStart', (date) => {
	console.log('scanStart', date);
});

noble.on('warning', (message) => {
	console.log('warning', message);
});

noble.on('discover', (peripheral) => {

	if (peripheral.address == state.id || peripheral.id == state.id) {

		peripheral.on('disconnect', function() {
			process.exit(0);
		});

		peripheral.connect((error) => {

			var serviceUUIDs = ["ffd5", "ffd0"];
			var characteristicUUIDs = ["ffd9", "ffd4"];
			peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (error, services, characteristics) => {

				characteristic = characteristics[0];

				characteristics[0].read((error, data) => {

					if (HTS(data[0]) == '56' || HTS(data[0]) == '0')
					{
						state.color = {
							r: data[1] == 0 ? 255 : data[1],
							g: data[2] == 0 ? 255 : data[2],
							b: data[3] == 0 ? 255 : data[3]
						}
						switchColor(characteristics[0], state.color, 250, 0xF0);
						console.log(state.color);
					}
				})

				// characteristic.on('write', () => {
					
				// })

				function HTS(num) {
					return Number(num).toString(16);
				}

				function calcMinus(a, b) {
					return a - b;
				}

				function switchColor(characteristic, color, time, brightness) {

					(time < 100) ? time = 100 : null;

					prevColor = state.color;
					console.log(prevColor, color);

					animationSpeed = 10;
					timeInterval = time / animationSpeed;

					perColorR = calcMinus(prevColor.r, color.r) / timeInterval;
					perColorG = calcMinus(prevColor.g, color.g) / timeInterval;
					perColorB = calcMinus(prevColor.b, color.b) / timeInterval;

					v = 0;
					interval = setInterval(() => {
						v += animationSpeed;

						prevColor.r = prevColor.r - perColorR;
						prevColor.g = prevColor.g - perColorG;
						prevColor.b = prevColor.b - perColorB;


						var red = prevColor.r;
						var green = prevColor.g;
						var blue = prevColor.b;

						var buf = new Buffer([0x56, red, green, blue, brightness, 0xF0 ,0xAA]);

						characteristic.write(buf);

						if (v >= time)
							clearInterval(interval);

					}, animationSpeed)

					state.color = color;

				}

				setInterval(() => {

					color = {
						r: mathjs.randomInt(0, 179),
						g: mathjs.randomInt(0, 179),
						b: mathjs.randomInt(0, 179)
					};

					switchColor(characteristics[0], color, 250, 0xF0);
				}, 333)

			});

		});

	}
});