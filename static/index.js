function getData() {
    fetch('/download', {
        method: 'GET',
    })
        .then(res => {
            return res.json();
        }).then(result => {
            console.log(result);
            if (result.error) {
                console.log("伺服器內部錯誤");
            } else {
                if (result.data.length == 0) {
                    console.log("尚無任何留言");
                } else if (result.data.length != 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        let main = document.querySelector('main');
                        let hr = document.createElement("hr");
                        let cell = document.createElement("div");
                        let text = document.createElement("div");
                        let img = document.createElement("img");
                        main.appendChild(hr);
                        main.appendChild(cell);
                        text.className = 'picText';
                        text.innerHTML = result.data[i].text;
                        cell.appendChild(text);
                        img.classList.add("obj");
                        img.src = result.data[i].pic;
                        cell.appendChild(img);
                    }
                }
            }
        })
}

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
    if (selectedPic != undefined && content != "") {
        content = content.replace(/\n/g, "<br>");
        document.querySelector('.errormsg').style.display = "none";
        let preview = document.querySelector(".preview");
        let previewPic = document.querySelector(".previewPic");
        preview.removeChild(previewPic);
        document.querySelector('.textInput').value = "";
        let formData = new FormData();
        formData.append("text", content);
        formData.append("pic", selectedPic);
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(res => {
                return res.json();
            }).then(result => {
                if (result.ok) {
                    window.location.reload();
                } else if (result.error) {
                    document.querySelector('.errormsg').textContent = "留言上傳失敗";
                    document.querySelector('.errormsg').style.display = "block";
                }
            })
    } else {
        document.querySelector('.errormsg').textContent = "請輸入文字或上傳照片";
        document.querySelector('.errormsg').style.display = "block";
    }
}
