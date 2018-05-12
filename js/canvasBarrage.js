/*!
 ** by zhangxinxu(.com)
 ** 涓嶩TML5 video瑙嗛鐪熷疄浜や簰鐨勫脊骞曟晥鏋�
 ** http://www.zhangxinxu.com/wordpress/?p=6386
 ** MIT License
 ** 淇濈暀鐗堟潈鐢虫槑
 */
var CanvasBarrage = function (canvas, video, options) {
	if (!canvas || !video) {
		return;
	}
	var defaults = {
		opacity: 100,
		fontSize: 24,
		speed: 2,
		range: [0,1],
		color: 'white',
		data: []
	};

	options = options || {};

	var params = {};
	// 鍙傛暟鍚堝苟
	for (var key in defaults) {
		if (options[key]) {
			params[key] = options[key];
		} else {
			params[key] = defaults[key];
		}

		this[key] = params[key];
	}
	var top = this;
	var data = top.data;

	if (!data || !data.length) {
		return;
	}

	var context = canvas.getContext('2d');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	// 瀛樺偍瀹炰緥
	var store = {};

	// 鏆傚仠涓庡惁
	var isPause = true;
	// 鎾斁鏃堕暱
	var time = video.currentTime;

	// 瀛楀彿澶у皬
	var fontSize = 28;

	// 瀹炰緥鏂规硶
	var Barrage = function (obj) {
		// 涓€浜涘彉閲忓弬鏁�
		this.value = obj.value;
		this.time = obj.time;
		// data涓殑鍙互瑕嗙洊鍏ㄥ眬鐨勮缃�
		this.init = function () {
			// 1. 閫熷害
			var speed = top.speed;
			if (obj.hasOwnProperty('speed')) {
				speed = obj.speed;
			}
			if (speed !== 0) {
				// 闅忕潃瀛楁暟涓嶅悓锛岄€熷害浼氭湁寰皟
				speed = speed + obj.value.length / 100;
			}
			// 2. 瀛楀彿澶у皬
			var fontSize = obj.fontSize || top.fontSize;

			// 3. 鏂囧瓧棰滆壊
			var color = obj.color || top.color;
			// 杞崲鎴恟gb棰滆壊
			color = (function () {
				var div = document.createElement('div');
				div.style.backgroundColor = color;
				document.body.appendChild(div);
				var c = window.getComputedStyle(div).backgroundColor;
				document.body.removeChild(div);
				return c;
			})();

			// 4. range鑼冨洿
			var range = obj.range || top.range;
			// 5. 閫忔槑搴�
			var opacity = obj.opacity || top.opacity;
			opacity = opacity / 100;

			// 璁＄畻鍑哄唴瀹归暱搴�
			var span = document.createElement('span');
			span.style.position = 'absolute';
			span.style.whiteSpace = 'nowrap';
			span.style.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif';
			span.innerText = obj.value;
			span.textContent = obj.value;
			document.body.appendChild(span);
			// 姹傚緱鏂囧瓧鍐呭瀹藉害
			this.width = span.clientWidth;
			// 绉婚櫎dom鍏冪礌
			document.body.removeChild(span);

			// 鍒濆姘村钩浣嶇疆鍜屽瀭鐩翠綅缃�
			this.x = canvas.width;
			if (speed == 0) {
				this.x	= (this.x - this.width) / 2;
			}
			this.actualX = canvas.width;
			this.y = range[0] * canvas.height + (range[1] - range[0]) * canvas.height * Math.random();
			if (this.y < fontSize) {
				this.y = fontSize;
			} else if (this.y > canvas.height - fontSize) {
				this.y = canvas.height - fontSize;
			}

			this.moveX = speed;
			this.opacity = opacity;
			this.color = color;
			this.range = range;
			this.fontSize = fontSize;
		};

		this.draw = function () {
			// 鏍规嵁姝ゆ椂x浣嶇疆缁樺埗鏂囨湰
			context.shadowColor = 'rgba(0,0,0,'+ this.opacity +')';
			context.shadowBlur = 2;
			context.font = this.fontSize + 'px "microsoft yahei", sans-serif';
			if (/rgb\(/.test(this.color)) {
				context.fillStyle = 'rgba('+ this.color.split('(')[1].split(')')[0] +','+ this.opacity +')';
			} else {
				context.fillStyle = this.color;
			}
			// 濉壊
			context.fillText(this.value, this.x, this.y);
		};
	};

	data.forEach(function (obj, index) {
		store[index] = new Barrage(obj);
	});

	// 缁樺埗寮瑰箷鏂囨湰
	var draw = function () {
		for (var index in store) {
			var barrage = store[index];

			if (barrage && !barrage.disabled && time >= barrage.time) {
				if (!barrage.inited) {
					barrage.init();
					barrage.inited = true;
				}
				barrage.x -= barrage.moveX;
				if (barrage.moveX == 0) {
					// 涓嶅姩鐨勫脊骞�
					barrage.actualX -= top.speed;
				} else {
					barrage.actualX = barrage.x;
				}
				// 绉诲嚭灞忓箷
				if (barrage.actualX < -1 * barrage.width) {
					// 涓嬮潰杩欒缁檚peed涓�0鐨勫脊骞�
					barrage.x = barrage.actualX;
					// 璇ュ脊骞曚笉杩愬姩
					barrage.disabled = true;
				}
				// 鏍规嵁鏂颁綅缃粯鍒跺渾鍦堝湀
				barrage.draw();
			}
		}
	};

	// 鐢诲竷娓叉煋
	var render = function () {
		// 鏇存柊宸茬粡鎾斁鏃堕棿
		time = video.currentTime;
		// 娓呴櫎鐢诲竷
		context.clearRect(0, 0, canvas.width, canvas.height);

		// 缁樺埗鐢诲竷
		draw();

		// 缁х画娓叉煋
		if (isPause == false) {
			requestAnimationFrame(render);
		}
	};

	// 瑙嗛澶勭悊
	video.addEventListener('play', function () {
		isPause = false;
		render();
	});
	video.addEventListener('pause', function () {
		isPause = true;
	});
	video.addEventListener('seeked', function () {
		// 璺宠浆鎾斁闇€瑕佹竻灞�
		top.reset();
	});


	// 娣诲姞鏁版嵁鐨勬柟娉�
	this.add = function (obj) {
		store[Object.keys(store).length] = new Barrage(obj);
	};

	// 閲嶇疆
	this.reset = function () {
		time = video.currentTime;
		// 鐢诲竷娓呴櫎
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (var index in store) {
			var barrage = store[index];
			if (barrage) {
				// 鐘舵€佸彉鍖�
				barrage.disabled = false;
				// 鏍规嵁鏃堕棿鍒ゆ柇鍝簺鍙互璧拌捣
				if (time < barrage.time) {
					// 瑙嗛鏃堕棿灏忎簬鎾斁鏃堕棿
					// barrage.disabled = true;
					barrage.inited = null;
				} else {
					// 瑙嗛鏃堕棿澶т簬鎾斁鏃堕棿
					barrage.disabled = true;
				}
			}
		}
	};
};