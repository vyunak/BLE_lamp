// const { exec } = require('child_process');
const child_process = require('child_process');
var readline = require('readline');
var mathjs = require('mathjs');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var interval, i = 0;

rl.setPrompt('');
// rl.prompt('\b');

const spawnProcess = child_process.spawn('sudo gatttool', ['-I'], {shell: true});

spawnProcess.on('error', function (error) {
	spawnProcess.stdin.write(`exit\n`);
	rl.close();
	throw error;
});

spawnProcess.stdout.on('data', function (data) {
	var ins = data.toString();
	console.log(ins);
	if (ins.indexOf("Connection successful") != -1)
		perelivka(50)
	else if (ins.indexOf("Command Failed: Disconnected") != 1 && interval)
		clearInterval(interval);
		// switchLight(500)
});

spawnProcess.stderr.on('data', function (data) {
	console.log(data.toString());
});

spawnProcess.on('close', function (code, signal) {
	spawnProcess.stdin.write(`exit\n`);
	console.log('Child process exited with code ' + code);
	rl.close()
});

spawnProcess.on('exit', function (code, signal) {
	spawnProcess.stdin.write(`exit\n`);
	console.log('Child exited with code ' + code);
	rl.close()
});

console.log("connect FF:FF:38:59:A8:31");
spawnProcess.stdin.write('connect FF:FF:38:59:A8:31');

// var time = new Date();

// function switchLight() {
// 	if (new Date() - time > 1e3)
// 	{
// 		time = new Date();
// 	}
// }

// rl.write(null, {ctrl: true, name: 'c'}, () => {
// 	// spawnProcess.stdin.write('exit\n');
// 	rl.close();
// })
rl.on('close', () => {
	spawnProcess.stdin.write('exit\n');
})

rl.on('line', (data) => {
	if (data.indexOf('x ') != -1)
		perelivka(data.split(' ')[1]);
	else if (data.indexOf('tw ') != -1)
		CYCLE_SEC = data.split(' ')[1];
	else
		spawnProcess.stdin.write(`${data}\n`);
})

var CYCLE_SEC  = 15.0;
var hue_min = 0.0;
var hue_max = 1.0;

var hue = hue_min;
// perelivka();

function perelivka(time) {
		if (time < 50)
		time = 50;
	if (interval)
		clearInterval(interval);

	interval = setInterval(() => {
		var hue_delta = (time * 0.001)/CYCLE_SEC*(hue_max-hue_min);
		hue += hue_delta;
		if (hue > hue_max)
			hue = hue_min+mathjs.mod(hue, hue_max);
		color = HSVtoRGB(hue, 1, 0.8);
		console.log(rgb2hex(color), color, hue);
		spawnProcess.stdin.write(`char-write-cmd 0x0007 56${rgb2hex(color)}FFF0AA\n`);
	}, time)
}

function rgb2hex(rgb){
	return (("0" + parseInt(rgb.r).toString(16)).slice(-2) +
		("0" + parseInt(rgb.g).toString(16)).slice(-2) +
		("0" + parseInt(rgb.b).toString(16)).slice(-2)).toString();
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function switchLight(time) {
	if (time < 500)
		time = 500;
	if (interval)
		clearInterval(interval);

	interval = setInterval(() => {
		i = !i;
		if (i)
			spawnProcess.stdin.write('char-write-cmd 0x0007 56FFFFFFFFF0AA\n');
		else
			spawnProcess.stdin.write('char-write-cmd 0x0007 56FFFFFFFF0FAA\n');
	}, time)

}
