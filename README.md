# FirebaseFileUploader

Use HTML5/modern browsers to store file data processed client-side as base64-encoded data in Firebase


## Usage

	var ref = new Firebase(FB_URL + '/files');
	var firebaseFileUploader = new FirebaseFileUploader(ref);

	document.querySelector('[type=file]').addEventListener('change', function () {
		firebaseFileUploader.upload(this.files); 
	});