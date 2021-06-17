function handleFiles(pic) {
    let preview = document.querySelector(".preview");
    let previewPic = document.querySelector(".previewPic");
    if (previewPic != null) {
        preview.removeChild(previewPic);
    }
    let file = pic[0];
    let img = document.createElement("img");
    img.classList.add("previewPic");
    img.file = file;
    preview.appendChild(img);
    let reader = new FileReader();
    reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

function submit() {
    let selectedPic = document.getElementById('uploadPic').files[0];
    console.log(selectedPic);
    let content = document.querySelector('.textInput').value;

    let formData = new FormData();
    formData.append("text", content);
    formData.append("pic", selectedPic);
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    // .then(res => {
    //     return res.json();
    // }).then(result => {
    //     console.log(result);
    // })


    if (selectedPic != undefined && content != "") {
        document.querySelector('.errormsg').style.display = "none";
        let preview = document.querySelector(".preview");
        let previewPic = document.querySelector(".previewPic");
        preview.removeChild(previewPic);
        let main = document.querySelector('main');
        let hr = document.createElement("hr");
        let cell = document.createElement("div");
        let text = document.createElement("div");
        let img = document.createElement("img");
        main.appendChild(hr);
        main.appendChild(cell);
        text.className = 'picText';
        text.textContent = content;
        cell.appendChild(text);
        img.classList.add("obj");
        let objectURL = window.URL.createObjectURL(selectedPic);
        console.log(objectURL);
        img.src = objectURL;
        cell.appendChild(img);
        document.querySelector('.textInput').value = "";

    } else {
        document.querySelector('.errormsg').textContent = "請輸入文字或上傳照片";
        document.querySelector('.errormsg').style.display = "block";
    }
}
