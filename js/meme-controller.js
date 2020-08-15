'use strict'
var gCanvas;
var gCtx;
var gCurImg;
var gCurMemeId;
var gIsMouseUp = true;
var gMovingText = false;
var gStickerCanvas;
var gStiCtx;

var gStickCanPos = 0

var gCurrLine;

var gIsWriting = false;
var gCurrColor;
var gCurFont;



function initCanvas(imgId) {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d')
    gCurMemeId = imgId;
    gCurrColor = 'brown';
    gCurFont = 'Impact'
    createMeme(imgId);
    initSticCanvas();
    clearCanvas()
    renderMeme();
}
function clearCanvas() {

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}



function renderMeme() {
    gCurImg = getImg()
    var img = new Image()
    img.src = gCurImg.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, img.width, gCanvas.height, (gCanvas.width - img.width) / 2, (gCanvas.height - img.height) / 2, img.width, gCanvas.height)
        if (gIsWriting) {
            renderLine(gCurrLine)
        }
        var linesToRender = getLines();
        if (linesToRender) {
            linesToRender.forEach(line => renderLine(line))
        }
        renderStickersOnCanvas();


    }
}

function initSticCanvas() {
    gStickerCanvas = document.getElementById('sticker-canvas');
    gStiCtx = gStickerCanvas.getContext('2d')
    renderStickers();
}

function getLineWidth(line) {
    gCtx.font = line.size + 'px ' + line.font;
    return gCtx.measureText(line.txt).width
}

function renderLine(line) {
    gCtx.fillStyle = line.color;
    gCtx.font = line.size + 'px ' + line.font
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'top';
    gCtx.fillText(line.txt, line.pos.h, line.pos.w)

}


function onDrawText() {
    var currText = document.getElementById('meme-text').value;
    if (currText && !gIsWriting) {
        gCurrLine = createLine(currText,gCurFont)
        gIsWriting = true;
    }
    if (currText) gCurrLine.txt = currText;
    if (!currText && gIsWriting) {
        gCurrLine.txt = '';
    }
    renderMeme()

}

function onAddLine() {
    addLine(gCurrLine);
    gIsWriting = false;
    document.getElementById('meme-text').value = ''
}

function onMoveText(direction) {
    const textPos = getTextPos()
    switch (direction) {
        case 'up':
            setTextPos(textPos.h, textPos.w - 20, 'up');
            break;
        case 'down':
            setTextPos(textPos.h, textPos.w + 20, 'down');
            break;
    }

    renderMeme()
}

function onChangeSelection() {
    changeSelection()
    renderMeme();;
}

function onDelete() {
    removeLine();
    renderMeme();
}

function onChangeTextColor() {
    gCurrColor = document.getElementById('text-color').value
    if (gIsWriting) {
        gCurrLine.color = gCurrColor;
        renderMeme()
        return
    }

    changeTextColor(gCurrColor)
    renderMeme();
}

function onChangeTextSize(flag) {
    if (gIsWriting) {
        gCurrLine.size = flag ? gCurrLine.size + 2 : gCurrLine.size - 2;
        renderMeme()
        return
    }
    changeTextSize(flag);
    renderMeme();
}

function onTextAlign(direction) {
    alignText(direction)
    renderMeme();
}

function getCanvasSize() {
    let size = {
        w: gCanvas.height,
        h: gCanvas.width
    }

    return size;
}

function onChangeFont(value) {
    if (gIsWriting) return
    gCurFont = value;
    changeFont(value);
    renderMeme()
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
}

function onUpload() {

}

function mouseEventListener(ev) {
    var curCurPos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    saveCurCurPosition(curCurPos)

    if (!gIsMouseUp && !gMovingText) {
        gCurrLine = isThereSomething(curCurPos)
        if (gCurrLine) gMovingText = true;
    }
    if (gMovingText) {
        if(gCurrLine.type==='line')  dragText();
        else dragSticker();
        renderMeme();
    }
}

function onDragText(ev) {
    ev.preventDefault();
    gIsMouseUp = false;

    // if(isThereText(gCurCurPos)){

    // }
}


function mouseChange(ev) {
    ev.preventDefault();
    gIsMouseUp = !gIsMouseUp
    if (gIsMouseUp) gMovingText = false
}


// STICKERS

function renderStickers() {
    var stickers = getStickers();
    stickers.forEach(sticker => {
        var stk = new Image()
        stk.src = sticker.url;

        stk.onload = () => {
            gStiCtx.beginPath()
            gStiCtx.drawImage(stk, 0, 0, stk.width, stk.height, sticker.containerPos, 0, 91, 91)
            // gStickCanPos+=101;

        }

    })
}
function onMoveStickers(direction) {
    gStiCtx.clearRect(0, 0, gStickerCanvas.width, gStickerCanvas.height)
    moveStickers(direction);
    renderStickers();
    for (var i = 0; i < 8; i++) {
        setTimeout(function () {
            gStiCtx.clearRect(0, 0, gStickerCanvas.width, gStickerCanvas.height)
            moveStickers(direction);
            renderStickers();
        }, 40)

    }
}

function onChooseSticker(ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    checkIfStickerAndAdd(x, y)
    renderMeme();
}

function renderStickersOnCanvas() {
    var stickers = getStickersToRender()
    if (!stickers) return;
    stickers.forEach(sticker => {
        var img = new Image()
        img.src = sticker.url;
        img.onload = () => {
            gCtx.drawImage(img, 0, 0, img.width, img.height, sticker.pos.x, sticker.pos.y, 91, 91)

        }
    })
}


//uploading service
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    document.querySelector('.share').style.display = 'none'


    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        var elContainer = document.querySelector('.share-container')
        elContainer.innerHTML = `
        <a class="btn bt3 fa fab fa-facebook-f " href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        </a>
        <a class="btn bt3 wa fa fa-whatsapp"href="https://wa.me/?text=${uploadedImgUrl}" data-action="share/whatsapp/share"></a>`
        elContainer.style.display = 'flex'
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    
    fetch('https://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            // console.log(err)
        })
}
