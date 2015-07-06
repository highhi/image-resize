(function(global){
	var _win		= window,
		_doc		= document,
		_reader		= null,
		_imageInfo	= null,
		_dropArea	= null,
		_rsWidht	= null,
		_rsHeight	= null,
		_path		= null,
		REG_EXT		= /(.*)(?:\.([^.]+$))/;

	if ( !(_win.File && _win.FileReader && _win.FileList && _win.Blob) ) {
		throw new Error('This browser is not supported for FileReader');
	}

	_doc.addEventListener('DOMContentLoaded', init, false);

	function init() {
		_dropArea = _doc.getElementById('dropArea');
		_imageInfo = _doc.getElementById('imageInfo');
		_rsWidht = _doc.getElementById('resizeWidth');
		_rsHeight = _doc.getElementById('resizeHeight');

		dropArea.addEventListener('drop', handleFileDrop, false);
		dropArea.addEventListener('dragover', handleDragOver, false);
	}

	function handleFileDrop(e) {
		var files, reader, ext;
		e.stopPropagation();
		e.preventDefault();

		file = e.dataTransfer.files[0];
		ext = file.name.match(REG_EXT)[2];

		if ( ext !== 'jpg' && ext !== 'png' && ext !== 'gif' && ext !== 'jpeg' ) {
			throw new Error('Supported files are jpg, gif, png and jpeg.');
		}

		_reader = new FileReader();
		_reader.onload = readerLoaded(ext);
		_reader.readAsDataURL(file);
	}

	function handleDragOver(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	function getImageInfo(files) {
		var info = null, f;
		for (var i = files.length; i--;) {
			f = files[i];
			info = 'filename : ' + f.name + ' size : ' + f.size + ' type : ' +f.type;
		}
		return info;
	}

	function readerLoaded(extainon) {

		var ext = extainon,
			type = ext === 'jpg' ? 'jpeg' : ext;

		return function (e) {
			var dataUri = e.target.result,
				img = new Image(),
				canvas = _doc.createElement('canvas'),
				ctx = canvas.getContext('2d');

			img.src = dataUri;
			
			img.onload = function(e) {
				var path,
					sizeUpdate;

				_rsWidht.value = img.width;
				_rsHeight.value = img.height;
				sizeUpdate = setSizeUpdate(img, canvas, ctx);

				sizeUpdate();
				_path = canvas.toDataURL('image/'+ type, 0.8);

				_rsWidht.addEventListener('change', sizeUpdate, false);
				_rsHeight.addEventListener('change', sizeUpdate, false);

				_doc.getElementsByTagName('body')[0].appendChild(img);
			};
		};

		function setSizeUpdate(image, canvas, context) {
			var img = image,
				canv = canvas,
				ctx = context,
				origSize = {
					w : img.width,
					h : img.height
				},
				a = _doc.getElementById('download');

			return function(e){
				var size = {
					w : _rsWidht.value || img.width,
					h : _rsHeight.value || img.height
				};
				canv.width = size.w;
				canv.height = size.h;
				img.width = size.w;
				img.height = size.h;
				ctx.drawImage( img, 0, 0, origSize.w, origSize.h, 0, 0, size.w, size.h );
				_path = canv.toDataURL('image/'+ type, 0.8);

				a.setAttribute('href', _path);
			};
		}
	}
})(this);