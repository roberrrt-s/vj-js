/* global $ */
/* global TweenMax */
/* global RoughEase */
/* global Power0 */
/* global Power1 */

let width;
let	height;
let	main;
let loop;
let looping;
let CONFIG;
let color;
let speed;

const util = {
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	clicks() {
		$('#start-stop').click(() => {
			if (looping) {
				stop();
			} else {
				start(util.random(1, 3));
			}
		});

		$('#update').click(() => {
			if (looping) {
				stop();
				start(util.random(1, 3));
			}
		});

		$("input[name='color-picker']").change(e => {
			color = $(e.target).val();
		});

		$('#speed').change(e => {
			speed = $(e.target).val();
			stop();
			start();
		});
	}
};

function init() {
	main = $('main');
	width = $(window).innerWidth();
	height = $(window).innerHeight();

	$.getJSON('js/config.json', cb => {
		CONFIG = cb;
		color = $("input[name='color-picker']:checked").val();
		speed = $('#speed').val();

		for (let i = 0; i < CONFIG.AMOUNT; i++) {
			//  CONFIG.TEXT.reaktor.length
			// ${CONFIG.TEXT.reaktor[i]}
			main.append(
				'<div class="block"></div>'
			);
		}

		start(speed);
		util.clicks();
	});
}

function start() {
	loop = setInterval(() => {
		animate();
	}, speed * 100);
	looping = true;
}

function stop() {
	clearInterval(loop);
	looping = false;
}

function animate() {
	$('.block').each((i, el) => {
		TweenMax.to(el, speed / 10, {
			css: {
				top            : util.random(0, height - $(el).height()),
				left           : util.random(0, width - $(el).width()),
				transformOrigin: '50% 50%',
				transform      : `rotateZ(${util.random(-150, 150)}deg) rotateX(${util.random(-150, 150)}deg) rotateY(${util.random(-150, 150)}deg)`,
				width          : util.random(parseInt(CONFIG.SIZES.small, 10), parseInt(CONFIG.SIZES.medium, 10)),
				height         : util.random(parseInt(CONFIG.SIZES.small, 10), parseInt(CONFIG.SIZES.medium, 10)),
				boxShadow      : `0px 0px ${util.random(1, 5)}px ${util.random(1, 5)}px ${CONFIG.COLORS[color][util.random(0, CONFIG.COLORS[color].length - 1)]}`,
				opacity        : util.random(5, 10) / 10,
				filter         : `grayscale(${util.random(0, 8)}%) invert(${util.random(0, 15)}%) saturate(${util.random(130, 180)}%)`
			},
			ease: RoughEase.ease.config({
				template : Power1.easeNone,
				strength : 1,
				points   : 1,
				taper    : 'none',
				randomize: true,
				clamp    : false
			})
		});
	});
}

$(document).ready(() => {
	init();
});
