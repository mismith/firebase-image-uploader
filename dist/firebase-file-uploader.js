"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirebaseFileUploader = function () {
	function FirebaseFileUploader() {
		_classCallCheck(this, FirebaseFileUploader);
	}

	_createClass(FirebaseFileUploader, [{
		key: "process",
		value: function process(files, ref) {
			var single = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

			if (!files || !files.length) return;

			var processed = [];

			var _loop = function _loop(i) {
				processed.push(new Promise(function (resolve) {
					var reader = new FileReader();
					if (files[i] instanceof DataTransferItem) {
						reader.onload = function (e) {
							resolve({
								src: e.target.result
							});
						};
						var blob = files[i].getAsFile();
						if (blob instanceof Blob) {
							reader.readAsDataURL(blob);
						} else {
							// @TODO: error?
						}
					} else if (files[i] instanceof File) {
							reader.onload = function (e) {
								resolve({
									name: files[i].name,
									size: files[i].size,
									type: files[i].type,
									src: e.target.result
								});
							};
							reader.readAsDataURL(files[i]);
						}
				}));
			};

			for (var i = 0; i < files.length; i++) {
				_loop(i);
			}

			return Promise.all(processed).then(function (files) {
				if (ref) {
					if (ref instanceof Firebase) {
						// firebase reference
						if (single) {
							return ref.set(files[0] || null).then(function (snap) {
								return files;
							});
						} else {
							var _ret2 = function () {
								var deferreds = [];
								files.map(function (file) {
									return deferreds.push(ref.push(file));
								});
								return {
									v: Promise.all(deferreds).then(files)
								};
							}();

							if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
						}
					} else {
						// object / array (i.e. for local/draft manipulation)
						if (single) {
							for (var k in files[0]) {
								ref[k] = files[0][k];
							}return ref;
						} else {
							files.map(function (file) {
								return ref.push(file);
							});
							return ref;
						}
					}
				} else {
					return files;
				}
			});
		}
	}]);

	return FirebaseFileUploader;
}();
