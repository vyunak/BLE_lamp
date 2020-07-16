var noble = require('noble');

noble.startScanning();

noble.on('stateChange', (state) => {
	console.log(state);
});

noble.on('scanStart', (date) => {
	console.log(date);
});

noble.once('warning', (date) => {
	console.log('warning', date);
});


noble.on('discover', (peripheral) => {
	if (peripheral.address == 'ff:ff:38:59:a8:31') {
		console.log('======================');

		noble.stopScanning();
		peripheral.connect();

		peripheral.once('connect', (date) => {
			console.log('connect to: ff:ff:38:59:a8:31');
			// console.log(peripheral);

			peripheral.discoverServices();

		});

		peripheral.once('disconnect', () => {
			console.log('disconnect');
			process.exit();
		});


		peripheral.once('servicesDiscover', (services) => {
			// console.log('services', services);
			service = services[1];
			service.discoverCharacteristics('ffd9');

			service.once('characteristicsDiscover', (chars) => {
				// console.log('char', chars);
				characteristic = chars[0];
				characteristic.subscribe();

				var buf = new Buffer([0x56,0xFF,0xFF,0xFF,0xFF,0x0F,0xAA]);
				characteristic.write(buf);

				characteristic.on('data', (data, isNotification) => {
					console.log(data, isNotification);
				});
				
				characteristic.on('write', (date) => {
					console.log('done');
					process.exit();
				} )

			})

		});
	}
});