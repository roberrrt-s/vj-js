/* global $ */
/* global TweenMax */
/* global RoughEase */
/* global Power0 */
/* global Power1 */

const util = {
	random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getScreenDimensions() {
		const data = {
			width : $(window).innerWidth(),
			height: $(window).innerWidth()
		};

		return data;
	}

};

const harmoniousBlocks = {

	// INACTIVE LAYERS: 1
	// QUEUED LAYERS: 2
	// ACTIVE LAYERS: 3

	init() {
		const elements = $('.harmonious-block');
		elements.each((i, el) => {
			TweenMax.set(el, {
				css: {
					width          : '200px',
					height         : '200px',
					backgroundColor: '#F00',
					top            : 'auto',
					right          : 'auto',
					bottom         : 'auto',
					left           : 'auto',
					transformOrigin: '50% 50%',
					transform      : 'rotateY(0deg) rotateX(0deg) rotateZ(0deg)',
					zIndex         : 5,
					opacity        : 1
				}
			});
		});
	},

	data: {},
	screen: {},

	changeAmount(amount) {
		const target = $('.harmonious-block');
		target.each((i, el) => {
			if (i < amount) {
				$(el).show();
			} else {
				$(el).hide();
			}
		});
	},

	synchronousPattern(duration) {
		const target = $('.harmonious-block');
		const originY = util.random(-200, -250);
		let originX = util.random(0, 50);
		const z = util.random(0, 180);
		const y = util.random(0, 180);
		const x = util.random(0, 180);

		target.each((i, el) => {
			TweenMax.set($(el), {
				css: {
					top : originY - 200,
					left: `${originX}px`
				}
			});
			originX += 250;
		});

		TweenMax.to(target, duration, {
			css: {
				transform: `rotateY(${y}deg) rotateX(${x}deg) rotateZ(${z}deg)`,
				top      : `+=${harmoniousBlocks.screen.height + 200}`
			},
			repeat: -1
		});
	},

	aSynchronousPattern(duration, delay) {
		const target = $('.harmonious-block');
		const originY = util.random(-200, -250);
		let originX = util.random(0, 50);
		const z = util.random(0, 180);
		const y = util.random(0, 180);
		const x = util.random(0, 180);

		target.each((i, el) => {
			TweenMax.set($(el), {
				css: {
					top : originY - 200,
					left: `${originX}px`
				}
			});
			originX += 250;
		});

		TweenMax.staggerTo(target, duration, {
			css: {
				transform: `rotateY(${y}deg) rotateX(${x}deg) rotateZ(${z}deg)`,
				top      : `+=${harmoniousBlocks.screen.height + 200}`
			},
			repeat: -1
		}, delay);
	}

};

const controls = {
	init() {
		controls.harmoniousBlocks();
	},

	harmoniousBlocks() {
		console.log('init');
	}

};

function init() {
	$.getJSON('js/user.json', cb => {
		harmoniousBlocks.data = cb.harmoniousBlocks;
		harmoniousBlocks.screen = util.getScreenDimensions();
		harmoniousBlocks.init();
		controls.init();
	});
}

$(document).ready(() => {
	init();
});