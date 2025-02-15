/* global $ */
/* global TweenMax */
/* global RoughEase */
/* global Power0 */
/* global Power1 */

const util = {
	randomRange(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	randomDoubleRange(min1, max1, min2, max2) {
		if(Math.random() < 0.5 ? value1 : value2) {

		}
	}

};

const backgroundImage = {

	// INACTIVE LAYERS: 1
	// QUEUED LAYERS: 2
	// ACTIVE LAYERS: 3

	init() {
		const elements = $('.background.image-container');
		elements.each((i, el) => {
			TweenMax.set(el, {
				css: {
					filter : `blur(${backgroundImage.data.reset.blur}px) brightness(${backgroundImage.data.reset.brightness}%) contrast(${backgroundImage.data.reset.contrast}%) grayscale(${backgroundImage.data.reset.grayscale}%) hue-rotate(${backgroundImage.data.reset.hue}deg) invert(${backgroundImage.data.reset.invert}%) saturate(${backgroundImage.data.reset.saturate}%) sepia(${backgroundImage.data.reset.sepia}%)`,
					zIndex : 1,
					opacity: 1
				}
			});
		});

		$('.background.image-container.active-bg-image')
			.css('z-index', 3).show();
	},

	data: {},

	changeBackgroundImage(target, src) {
		const $target = $(`#layer-${target} > img`);
		const string = `img/background-${src}.gif`;

		if (!$target.parent().hasClass('active-bg-image')) {
			$target.attr('src', string);

			return;
		}

		console.error('Target layer is currently being viewed, change to another layer before changing images');
	},

	changeFrontLayer(target, duration, transition, reset) {
		const $target = $(`#layer-${target}`);

		if ($target.hasClass('active-bg-image')) {
			console.error('Target layer is already in front.');

			return;
		}

		$target.show();
		const current = $('.background.image-container.active-bg-image');
		const time = duration ||  1; // default 1s

		$target.css('z-index', 2);
		const transitionTween = TweenMax.to(current, time, {
			css: {
				opacity: 0
			},
			ease: RoughEase.ease.config({
				template : transition.type,
				strength : 1,
				points   : transition.stutter,
				taper    : 'none',
				randomize: true,
				clamp    : false
			}),
			onComplete: cancelAnimation
		});

		function cancelAnimation() {
			transitionTween.kill();

			if (reset) {
				backgroundImage.resetEffects('.active-bg-image');
			}

			$target.css('z-index', 3).addClass('active-bg-image');
			current.css({
				zIndex : 1,
				opacity: 1
			}).removeClass('active-bg-image').hide();
		}
	},

	resetEffects(target) {
		const $target = $(`#${target}`);
		TweenMax.to($target, 0.5, {
			css: {
				filter: `blur(${backgroundImage.data.reset.blur}px) brightness(${backgroundImage.data.reset.brightness}%) contrast(${backgroundImage.data.reset.contrast}%) grayscale(${backgroundImage.data.reset.grayscale}%) hue-rotate(${backgroundImage.data.reset.hue}deg) invert(${backgroundImage.data.reset.invert}%) saturate(${backgroundImage.data.reset.saturate}%) sepia(${backgroundImage.data.reset.sepia}%)`
			}
		});
	},

	applyEffect(duration, target) {
		const $target = $(`#${target}`);
		const time = duration ||  1; // default 1s

		const effectTween = TweenMax.to($target, time, {
			css: {
				filter: `blur(${backgroundImage.data[target].blur}px) brightness($${backgroundImage.data[target].brightness}%) contrast(${backgroundImage.data[target].contrast}%) grayscale(${backgroundImage.data[target].grayscale}%) hue-rotate(${backgroundImage.data[target].hue}deg) invert(${backgroundImage.data[target].invert}%) saturate(${backgroundImage.data[target].saturate}%) sepia(${backgroundImage.data[target].sepia}%)`
			},
			onComplete: cancelAnimation
		});

		function cancelAnimation() {
			effectTween.kill();
		}
	},

	applyRandomEffect(duration, target) {
		const $target = $(`#layer-${target}`);
		const time = duration ||  1; // default 1s

		const effectTween = TweenMax.to($target, time, {
			css: {
				filter: `blur(${util.randomRange(0, 1)}px) brightness($${util.randomRange(50, 150)}%) contrast(${util.randomRange(50, 150)}%) grayscale(${util.randomRange(0, 25)}%) hue-rotate(${util.randomRange(0, 360)}deg) invert(${util.randomRange(0, 100)}%) saturate(${util.randomRange(50, 150)}%) sepia(${util.randomRange(0, 40)}%)`
			},
			onComplete: cancelAnimation
		});

		function cancelAnimation() {
			effectTween.kill();
		}
	},

	interval: {},
	looping : false

};

const controls = {
	init() {
		controls.runBackgroundImageEvents();
		controls.runHideShowControls();
	},

	initLoop() {
		return setInterval(() => {
			const current = parseInt($('.background.image-container.active-bg-image').attr('id').slice(6), 10);
			let target = current + 1;
			if (target > 3) {
				target = 1;
			}

			backgroundImage.changeBackgroundImage(target, util.randomRange(1, 37));

			backgroundImage.changeFrontLayer(target, 2, {
				type   : 'Power0.easeInOut',
				stutter: 20
			}, false);

			backgroundImage.applyRandomEffect(3, target);

		}, 6000);
	},

	runHideShowControls() {
		$(document).on('keypress', e => {
			if (e.which === 104) {
				$('#controls').toggle();
			} else if (e.which === 114 && !backgroundImage.looping) {
				$('.reset-button').click();
				backgroundImage.looping = true;
				backgroundImage.interval = controls.initLoop();
			} else if (e.which === 115 && backgroundImage.looping) {
				clearInterval(backgroundImage.interval);
				$('.reset-button').click();
			}
		});
	},

	runBackgroundImageEvents() {
		$('.layer-options > input[type=range]').each((i, el) => {
			$(el).on('change', () => {
				const target = $(el).attr('id').slice(0, 7);
				const type = $(el).attr('id').slice(8);
				backgroundImage.data[target][type] = $(el).val();
				backgroundImage.applyEffect(1, target);
			});
		});

		$('#change-layer-1').click(() => {
			backgroundImage.changeFrontLayer(1, 2, {
				type   : 'Power0.easeInOut',
				stutter: 20
			}, false);
		});
		$('#change-layer-2').click(() => {
			backgroundImage.changeFrontLayer(2, 2, {
				type   : 'Power0.easeInOut',
				stutter: 20
			}, false);
		});
		$('#change-layer-3').click(() => {
			backgroundImage.changeFrontLayer(3, 2, {
				type   : 'Power0.easeInOut',
				stutter: 20
			}, false);
		});

		$('.change-layer-bg').click(e => {
			backgroundImage.changeBackgroundImage($(e.target).val(), $('#change-bg-image').val());
		});

		$('.reset-button').click(e => {
			const target = $(e.target).attr('id').slice(0, 7);

			Object.keys(backgroundImage.data[target]).forEach(property => {
				backgroundImage.data[target][property] = backgroundImage.data.reset[property];
			});

			$(`#${target}-options > input`).each((i, el) => {
				const property = $(el).attr('id').slice(8);
				$(el).val(backgroundImage.data.reset[property]);
			});

			backgroundImage.resetEffects(target);
		});
	}
};

function init() {
	$.getJSON('js/user.json', cb => {
		backgroundImage.data = cb.backgroundImage;
		backgroundImage.init();
		controls.init();
	});
}

$(document).ready(() => {
	init();
});
