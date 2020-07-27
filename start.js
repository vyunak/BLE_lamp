let noble = require('noble');
let mathjs = require('mathjs');
let express = require('express');
const app = express();
var interval = null;
app.use(express.static(__dirname+'/public'));

let state = {
	color: {
		r: 255,
		g: 255,
		b: 255
	},
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

	if (peripheral.address === state.id || peripheral.id === state.id) {

		peripheral.on('disconnect', function() {
			process.exit(0);
		});

		peripheral.connect((error) => {

			const serviceUUIDs = ["ffd5", "ffd0"];
			const characteristicUUIDs = ["ffd9", "ffd4"];
			peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (error, services, characteristics) => {

				console.log('connected');
				let characteristic = characteristics[0];

				app.get('/api/switchColor/:r/:g/:b/:brightness/:time', function (req, res) {
					let time = parseInt(req.params.time);
					(isNaN(time) || time < 100) ? time = 100 : null;
					console.log(`/api/switchColor/${req.params.r}/${req.params.g}/${req.params.b}/${req.params.brightness}/${req.params.time}`, new Date());
					if (req.params.r != null && req.params.g != null && req.params.b != null && req.params.brightness != null)
					{
						let brightness = parseInt(req.params.brightness) % 101 * 0.01;
						let RColor = parseInt(req.params.r) % 256 * brightness;
						let GColor = parseInt(req.params.g) % 256 * brightness;
						let BColor = parseInt(req.params.b) % 256 * brightness;
						let colors = {
							r: mathjs.round(RColor),
							b: mathjs.round(BColor),
							g: mathjs.round(GColor)
						};
						if (!isNaN(RColor) && !isNaN(GColor) && !isNaN(BColor) && !isNaN(brightness)) {
							console.log(colors);
							switchColor(characteristic, colors, time, brightness);
							res.send(colors)
						} else {
							res.send({error: 'color error'})
						}
					} else {
						res.send({error: 'not all params'})
					}
				})

				app.get('/', (req, res) => {
					res.sendFile(__dirname+'/index.html');
				})

				app.get('/api/toggle', (req, res) => {
					console.log(`/api/toggle`, new Date());
					let state = {
						power: false,
						all: null
					}
					characteristic.read((err, date) => {
						state.all = date.toString('hex');
						let cmd = HTS(date[0]);
						if (cmd === '56') {
							state.power = true;
						} else if (cmd === 'cc') {
							state.power = HTS(date[1]) === '23';
						} else if (cmd === '0') {
							state.power = true;
						}
						let buf = new Buffer([0xCC, state.power === false ? 0x23 : 0x24, 0x33]);
						state.power = !state.power;
						characteristic.write(buf);
						return res.send(state);
					})
				})

				app.get('/api/whiteWorm/:brightness', function (req, res) {
					console.log(`/api/whiteWorm/${req.params.brightness}`, new Date());
					if (req.params.brightness != null)
					{
						let brightness = parseInt(req.params.brightness) % 256;
						// let brightness = (parseInt(req.params.brightness) % 101) / 100 * 255;
						if (!isNaN(brightness))
						{
							let buf = new Buffer([0x56, 0xFF, 0xFF, 0xFF, brightness, 0x0F, 0xAA]);
							characteristic.write(buf);
							res.send({})
						} else {
							res.send({error: 'brightness error'})
						}
					} else {
						res.send({error: 'not all params'})
					}
				})

				app.get('/api/white/:brightness', function (req, res) {
					console.log(`/api/whiteWorm/${req.params.brightness}`, new Date());
					if (req.params.brightness != null)
					{
						let brightness = parseInt(req.params.brightness) % 101 * 0.01;
						// let brightness = (parseInt(req.params.brightness) % 101) / 100 * 255;
						if (!isNaN(brightness))
						{
							let buf = new Buffer([0x56, 255 * brightness , 255 * brightness, 255 * brightness, 0xFF, 0xF0, 0xAA]);
							characteristic.write(buf);
							res.send({})
						} else {
							res.send({error: 'brightness error'})
						}
					} else {
						res.send({error: 'not all params'})
					}
				})

				app.get('/api/toggle/:state', function (req, res) {
					console.log(`/api/toggle/${req.params.state}`, new Date());
					if (req.params.state != null)
					{
						let state = parseInt(req.params.state) % 2;
						if (!isNaN(state))
						{
							let buf = new Buffer([0xCC, state === 1 ? 0x23 : 0x24, 0x33]);
							characteristic.write(buf);
							res.send({})
						} else {
							res.send({error: 'state error'})
						}
					} else {
						res.send({error: 'not all params'})
					}
				})

				app.get('/api/getState', (req, res) => {
					console.log('/api/getState', new Date());
					let state = {
						power: false,
						all: null
					}
					characteristic.read((err, date) => {
						state.all = date.toString('hex');
						let cmd = HTS(date[0]);
						if (cmd === '56') {
							state.power = true;
						} else if (cmd === 'cc') {
							state.power = HTS(date[1]) === '23';
						} else if (cmd === '0') {
							state.power = true;
						}
						return res.send(state);
					})
				})

				// characteristics[0].read((error, data) => {

				// 	if (HTS(data[0]) == '56' || HTS(data[0]) == '0')
				// 	{
				// 		state.color = {
				// 			r: data[1] == 0 ? 255 : data[1],
				// 			g: data[2] == 0 ? 255 : data[2],
				// 			b: data[3] == 0 ? 255 : data[3]
				// 		}
				// 		switchColor(characteristics[0], state.color, 250, 0xF0);
				// 		console.log(state.color);
				// 	}

				// 	console.log('=================================');
				// })

				// characteristic.on('write', () => {
					
				// })

				// setInterval(() => {
				//
				// 	let color = {
				// 		r: mathjs.randomInt(0, 255),
				// 		g: mathjs.randomInt(0, 255),
				// 		b: mathjs.randomInt(0, 255)
				// 	};
				//
				// 	switchColor(characteristic, color, 1500, 0xFF);
				// }, 2000)

				function HTS(num) {
					return Number(num).toString(16);
				}

				function calcMinus(a, b) {
					return a - b;
				}

				function switchColor(characteristic, color, time, brightness) {

					(time < 100) ? time = 100 : null;

					let prevColor = {
						r: state.color.r,
						g: state.color.g,
						b: state.color.b,
					};
					state.color = color;
					// console.log(prevColor, 'prev', color, 'next');

					let animationSpeed = 10;
					let timeInterval = time / animationSpeed;

					let perColorR = calcMinus(prevColor.r, color.r) / timeInterval;
					let perColorG = calcMinus(prevColor.g, color.g) / timeInterval;
					let perColorB = calcMinus(prevColor.b, color.b) / timeInterval;

					let v = 0;
					if (interval != null)
						clearInterval(interval);
					interval = setInterval(() => {
						v += animationSpeed;

						prevColor.r -= perColorR;
						prevColor.g -= perColorG;
						prevColor.b -= perColorB;


						let red = prevColor.r;
						let green = prevColor.g;
						let blue = prevColor.b;

						let buf = new Buffer([0x56, red, green, blue, 0x00, 0xF0 ,0xAA]);

						characteristic.write(buf);

						if (v >= time)
							clearInterval(interval);
						
					}, animationSpeed)

				}



			});

		});

	}
});

app.listen(2020)
