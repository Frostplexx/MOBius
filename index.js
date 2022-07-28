window.onload = function () {


	let imgInput = document.getElementById("img");

	imgInput.addEventListener("change", function (e) {
		if (e.target.files) {

			let imageFile = e.target.files[0]; //here we get the image file
			var reader = new FileReader();
			reader.readAsDataURL(imageFile);
			reader.onloadend = function (e) {
				ctx = c.getContext("2d");
				var img = new Image();
				img.src = e.target.result;

				img.onload = function (ev) {
					var s = (c.width = c.height = 400),
						opts = {
							strips: 100,
							radius: 100,
							insideRadius: 20,
							depth: 200,
							rotVel: {
								x: 0.0022,
								y: 0.003,
							},
							vanishPoint: {
								x: s / 2,
								y: s / 2,
							},
							fl: 250,
						},
						rot = {
							x: 0,
							y: 0,
							cos: {
								x: 1,
								y: 1,
							},
							sin: {
								x: 0,
								y: 0,
							},
						},
						stripAngle = (Math.PI * 2) / opts.strips,
						prevX1,
						prevY1,
						prevX2,
						prevY2;

					function anim() {
						window.requestAnimationFrame(anim);

						ctx.fillStyle = "#333";

						ctx.fillRect(0, 0, s, s);

						rot.x += opts.rotVel.x;
						rot.y += opts.rotVel.y;

						rot.cos.x = Math.cos(rot.x);
						rot.sin.x = Math.sin(rot.x);
						rot.cos.y = Math.cos(rot.y);
						rot.sin.y = Math.sin(rot.y);

						for (var i = 0; i < opts.strips; ++i) {
							var ang = i * stripAngle,
								cos = Math.cos(ang),
								sin = Math.sin(ang),
								cos2 = Math.cos(ang / 2),
								sin2 = Math.sin(ang / 2),
								x1 = opts.radius + cos2 * opts.insideRadius,
								x2 = opts.radius - cos2 * opts.insideRadius,
								y1 = sin2 * opts.insideRadius,
								y2 = -sin2 * opts.insideRadius,
								z1 = 0,
								z2 = 0;

							//rotation to make a circle
							var x1a = x1;
							x1 = x1 * cos; // x1 * cos - z1 * sin, but z1 = 0
							z1 = x1a * sin; // z1 * cos + x1a * sin, but z1 = 0

							var x2a = x2;
							x2 = x2 * cos;
							z2 = x2a * sin;

							//rotation on world
							var y1a = y1,
								y2a = y2;
							y1 = y1 * rot.cos.x - z1 * rot.sin.x;
							z1 = z1 * rot.cos.x + y1a * rot.sin.x;
							y2 = y2 * rot.cos.x - z2 * rot.sin.x;
							z2 = z2 * rot.cos.x + y2a * rot.sin.x;

							var x1a = x1,
								x2a = x2;
							x1 = x1 * rot.cos.y - z1 * rot.sin.y;
							z1 = z1 * rot.cos.y + x1a * rot.sin.y;
							x2 = x2 * rot.cos.y - z2 * rot.sin.y;
							z2 = z2 * rot.cos.y + x2a * rot.sin.y;

							if (img != null) {
								var pat = ctx.createPattern(img, "repeat");
								ctx.fillStyle = pat;
							} else {
								ctx.fillStyle = "hsla(0,0%,50%,1)";
							}

							//translation on world
							z1 += opts.depth;
							z2 += opts.depth;

							if (prevX1) {
								ctx.beginPath();

								if (i !== 0) {
									ctx.moveTo(prevX2, prevY2);
									ctx.lineTo(prevX1, prevY1);
								} else {
									ctx.moveTo(prevX1, prevY1);
									ctx.lineTo(prevX2, prevY2);
								}

								var screenScale1 = opts.fl / z1;
								prevX1 = opts.vanishPoint.x + x1 * screenScale1;
								prevY1 = opts.vanishPoint.y + y1 * screenScale1;

								var screenScale2 = opts.fl / z2;
								prevX2 = opts.vanishPoint.x + x2 * screenScale2;
								prevY2 = opts.vanishPoint.y + y2 * screenScale2;

								ctx.lineTo(prevX1, prevY1);
								ctx.lineTo(prevX2, prevY2);
								ctx.fill();
							} else {
								var screenScale1 = opts.fl / z1;
								prevX1 = opts.vanishPoint.x + x1 * screenScale1;
								prevY1 = opts.vanishPoint.y + y1 * screenScale1;

								var screenScale2 = opts.fl / z2;
								prevX2 = opts.vanishPoint.x + x2 * screenScale2;
								prevY2 = opts.vanishPoint.y + y2 * screenScale2;
							}
						}
					}
					anim();
				};
			};
		}
	});
};
