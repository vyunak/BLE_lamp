var noble = require('noble');
var mathjs = require('mathjs');

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


function decimalToHexString(number)
{
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toUpperCase();
}

noble.on('discover', (peripheral) => {
	// console.log(peripheral);
	if (peripheral.address == 'ff:ff:38:59:a8:31' || peripheral.id == 'ff:ff:38:59:a8:31') {
		console.log('======================');
		console.log(peripheral);
		// peripheral.disconnect();
		// noble.stopScanning();
		peripheral.on('disconnect', function() {
			process.exit(0);
		});
		peripheral.connect((error) => {
			console.log('connect', error);
			var i = 0;

			var serviceUUIDs = ["ffd5", "ffd0"];
			var characteristicUUIDs = ["ffd9", "ffd4"];
			peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (error, services, characteristics) => {
				console.log('====================================');
				console.log(error);
				console.log('====================================');
				console.log(services);
				// console.log(services.read)
				console.log('====================================');
				console.log(characteristics);
				console.log('====================================');
				characteristics[0].read((error, data) => {
					console.log(data.toString('hex'));
					console.log(data[0]);
				})
				characteristics[1].read((error, data) => {
					console.log(data.toString('hex'));
				})
				characteristics[1].once('notify', (data) => {
					console.log('====================================');
					console.log(data, 1);
					console.log('====================================');
				})
				characteristics[0].once('notify', (data) => {
					console.log('====================================');
					console.log(data, 0);
					console.log('====================================');
				})
				console.log('====================================');

				function calcMinus(a, b) {
					return a - b;
				}

				prevColor = [mathjs.randomInt(0, 255), mathjs.randomInt(0, 255), mathjs.randomInt(0, 255)];

				setInterval(() => {

					time = 2e3;
					timeInterval = time / 50;

					color1 = [prevColor[0], prevColor[1], prevColor[2]];
					color2 = [mathjs.randomInt(0, 255), mathjs.randomInt(0, 255), mathjs.randomInt(0, 255)];

					col1 = calcMinus(color1[0], color2[0]) / timeInterval;
					col2 = calcMinus(color1[1], color2[1]) / timeInterval;
					col3 = calcMinus(color1[2], color2[2]) / timeInterval;
					
					v = 0;
					interval = setInterval(() => {
						v += 50;

						color1[0] = color1[0] - col1;
						color1[1] = color1[1] - col2;
						color1[2] = color1[2] - col3;


						var num1 = parseInt(color1[0], 10);
						var num2 = parseInt(color1[1], 10);
						var num3 = parseInt(color1[2], 10);
						var buf = new Buffer([0x56, num1, num2, num3, 0xFF, 0xF0 ,0xAA]);
						characteristics[0].write(buf);
						console.log(buf);

						if (v >= time)
							clearInterval(interval);
					}, 50)

					prevColor = color2;
				}, 1e4)

				// characteristics[0].on('write', () => {
				// 	characteristics[0].read((error, data) => {
				// 		console.log(data.toString('hex'));
				// 		console.log(data[0]);
				// 	})
				// })

			});

			// peripheral.discoverServices([], function(error, services) {
			// 	var serviceIndex = 0;
			// 	console.log(services);
			// });
		});

		// peripheral.once('connect', (date) => {
		// 	console.log('connect to: ff:ff:38:59:a8:31');
		// 	// peripheral.discoverServices([], function(error, services) {
		// 	// 	console.log(error, services);
		// 	// });
		// 	// console.log(peripheral);

		// 	// peripheral.discoverAllServicesAndCharacteristics();
		// 	// var serviceUUIDs = ["ffd5"];
		// 	// var characteristicUUIDs = ["ffd9"];
		// 	// peripheral.discoverServices();

		// });

		// process.beforeExit = () => {
		// 	peripheral.disconnect();
		// }

		// peripheral.once('disconnect', (date) => {
		// 	peripheral.disconnect();
		// 	console.log('disconnect');
		// 	// noble.stopScanning();
		// 	// setTimeout(() => {
		// 	// 	noble.startScanning();
		// 	// }, 5e3)
		// 	// process.exit();
		// });


		// peripheral.once('servicesDiscover', (services) => {
		// 	console.log(services);
			// console.log('services', services);
			// service = services[1];
			// service.discoverCharacteristics('ffd9');

			// service.once('characteristicsDiscover', (chars) => {
			// 	console.log('char', chars);
			// 	characteristic = chars[0];
			// 	characteristic.subscribe();

		// 		var buf = new Buffer([0x56,0xFF,0xFF,0xFF,0x20,0x0F,0xAA]);
		// 		characteristic.write(buf);

		// 		characteristic.on('data', (data, isNotification) => {
		// 			console.log(data, isNotification);
		// 		});

		// 		characteristic.on('write', (date) => {
		// 			console.log('done');
		// 			process.exit();
		// 		} )

		// 	})

		// });

	}
});