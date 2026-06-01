<input type="file" id="fileInput">
<button onclick="uploadImage()">UPLOAD</button>

<p id="result"></p>

<script>
async function uploadImage() {
    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("SELECT FILE FIRST");
        return;
    }

    const fileName = Date.now() + "_" + file.name;
    const ref = storage.ref("images/" + fileName);

    const uploadTask = ref.put(file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("UPLOAD " + progress + "%");
        },
        (error) => {
            console.log(error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                document.getElementById("result").innerText = url;
                console.log("IMAGE URL:", url);
            });
        }
    );
}
</script>