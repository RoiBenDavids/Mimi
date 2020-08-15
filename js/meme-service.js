'use strict'
const PHOTO_NUM = 21
const STICKER_COUNT = 4;
var gImgs = []
var gMeme;
var gLastTextPos = 1;
var gKeywordsCount = [{ 'politics': 5 }, { 'animals': 7 }, { ugly: 1 }, { happy: 10 }, { all: 5 }, { dog: 7 }]
var gFilterBy = ''
var gFirstKeywordIdx = 0
var gCCLoc;
var gOffSetX;
var gOffSetY;
var gStickers = [];
var gStickersOnCanvas = [];
var gChoesenStickerIndex;



initImg()
initStickers()


function initImg() {
    for (let i = 1; i <= PHOTO_NUM; i++) {
        gImgs[i] =
        {
            id: i,
            url: 'img/' + i + '.jpg'
        }

    }
    gImgs[1].keywords = ['politics', 'ugly']
    gImgs[2].keywords = ['animals', 'dog']
    gImgs[3].keywords = ['animals', 'dog', 'baby']
    gImgs[4].keywords = ['animals', 'cat']
    gImgs[5].keywords = ['baby', 'happy']
    gImgs[6].keywords = ['ugly']
    gImgs[7].keywords = ['baby', 'surprise']
    gImgs[8].keywords = ['ugly']
    gImgs[9].keywords = ['baby', 'happy']
    gImgs[10].keywords = ['politics', 'happy']
    gImgs[11].keywords = ['sports']
    gImgs[12].keywords = ['ugly']
    gImgs[13].keywords = ['happy', 'movie']
    gImgs[14].keywords = ['movie']
    gImgs[14].keywords = ['movie']
    gImgs[15].keywords = ['movie']
    gImgs[16].keywords = ['movie']
    gImgs[17].keywords = ['movie']
    gImgs[18].keywords = ['movie']
    gImgs[19].keywords = ['movie']
    gImgs[20].keywords = ['movie']
    gImgs[21].keywords = ['movie']



}
function initStickers() {
    var pos = 0;
    for (var i = 0; i < STICKER_COUNT; i++) {
        gStickers.push({
            url: 'img/stick' + (i + 1) + '.webp',
            containerPos: pos
        })
        pos += 101;
    }
}
function getStickers() {
    return gStickers;
}

function moveStickers(direction) {
    if (direction) {
        gStickers.forEach(sticker => {
            sticker.containerPos -= 2;
        })
        if (gStickers[gStickers.length - 1].containerPos < 240) {
            var temp = gStickers.splice(0, 1)[0];
            gStickers.push(temp);
            gStickers[gStickers.length - 1].containerPos = gStickers[gStickers.length - 2].containerPos + 101;
        }
    } else {
        gStickers.forEach(sticker => sticker.containerPos += 2);
        if (gStickers[0].containerPos > 0) {
            var temp = gStickers.pop()
            for (var i = gStickers.length - 1; i >= 0; i--) {
                gStickers[i + 1] = gStickers[i]
            }
            gStickers[0] = temp;
            gStickers[0].containerPos = gStickers[1].containerPos - 101
        }

    }
}

function checkIfStickerAndAdd(x, y) {
    var chosenSticker = gStickers.find(sticker => sticker.containerPos < x && x < sticker.containerPos + 91)
    if (chosenSticker) addStickToCanvas(chosenSticker);

}

function addStickToCanvas(stk) {
    var sticker = {
        url: stk.url,
        pos: { x: 0, y: 250 }
    }
    gStickersOnCanvas.push(sticker)
}

function getStickersToRender() {
    return gStickersOnCanvas;
}

function getImgsToGallery() {
    if (!gFilterBy || gFilterBy === 'all') return gImgs;
    return gImgs.filter(img => {
        return img.keywords.find(imgK => imgK === gFilterBy)
    })
}

function getImg() {
    return gImgs.find(img => {
        if (!img) return
        return img.id === gMeme.selectedImgId
    })
}


function createMeme(memeId) {
    gMeme = {
        selectedImgId: memeId,
        selectedLineIdx: 0,
        lines: []

    }
}

// function addLine(txt) {
//     gMeme.lines.push(
//         {
//             txt,
//             font:'PoppinsL',
//             size: 40,
//             pos: {
//                 h: 250,
//                 w: gLastTextPos
//             },
//             color: 'yellow',
//         }
//     )
//     gMeme.lines[gMeme.lines.length - 1].textWidth = getLineWidth(gMeme.lines[gMeme.lines.length - 1])
//     gMeme.selectedLineIdx = gMeme.lines.length - 1;
//     gLastTextPos += 40;
// }

function addLine(line) {
    gMeme.lines.push(line)
    gMeme.lines[gMeme.lines.length - 1].textWidth = getLineWidth(gMeme.lines[gMeme.lines.length - 1])
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function createLine(txt, font) {
    var line = {
        txt,
        font,
        size: 40,
        pos: {
            h: 250,
            w: 250
        },
        color: 'yellow',
    }
    return line;
}

function getLines() {

    return gMeme.lines
}

function getTextPos() {
    return gMeme.lines[gMeme.selectedLineIdx].pos;
}
function setTextPos(h, w, side) {
    gMeme.lines[gMeme.selectedLineIdx].pos = {
        h,
        w
    }

}

function changeSelection() {
    gMeme.selectedLineIdx = gMeme.selectedLineIdx + 1 < gMeme.lines.length ? gMeme.selectedLineIdx + 1 : 0;
}

function getSelectedLine() {
    return gMeme.selectedLineIdx;
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    changeSelection();
}

function changeTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;

}

function changeTextSize(flag) {
    let curSize = gMeme.lines[gMeme.selectedLineIdx].size;
    gMeme.lines[gMeme.selectedLineIdx].size = flag ? curSize + 2 : curSize - 2;
}

function alignText(direction) {
    const size = getCanvasSize()
    if (direction === 'left') {
        gMeme.lines[gMeme.selectedLineIdx].pos.h = 0 + (0.6 * gMeme.lines[gMeme.selectedLineIdx].textWidth);
    } else if (direction === 'right') {
        gMeme.lines[gMeme.selectedLineIdx].pos.h = size.h - (0.6 * gMeme.lines[gMeme.selectedLineIdx].textWidth);
    } else {
        gMeme.lines[gMeme.selectedLineIdx].pos.h = 250;
    }
}

function changeFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;

}

function getKeywordsToRender() {
    var currIdx = gFirstKeywordIdx;
    var keywordsToRender = []
    for (var i = 0; i < 4; i++) {
        keywordsToRender.push(gKeywordsCount[currIdx])
        currIdx++
        if (currIdx >= gKeywordsCount.length) currIdx = 0;

    }
    return keywordsToRender;
}

function moveKId() {
    gFirstKeywordIdx++

    if (gFirstKeywordIdx >= gKeywordsCount.length) gFirstKeywordIdx = 0;
}


function filterByKey(key) {
    gKeywordsCount.find(keyword => {
        if (Object.keys(keyword)[0] === key) keyword[key]++;
    })

    gFilterBy = key;
}

function isThereSomething(cursPos) {
    var line = isThereText(cursPos);
    if (line) return { line, type: 'line' }
    var sticker = isThereSticker(cursPos);
    return sticker
}

function isThereSticker(cursPos){
    if(!gStickersOnCanvas[0]) return
    var chosenSticker = gStickersOnCanvas.find((stk,idx) => {
        if( stk.pos.x < cursPos.x && cursPos.x < stk.pos.x + 91){
            gChoesenStickerIndex = idx;
            gOffSetX = cursPos.x - stk.pos.x
            gOffSetY = cursPos.y - stk.pos.y;
            return stk;
        }
    })
    return chosenSticker
}

function isThereText(cursPos) {
    var chosenLine = gMeme.lines.find((line, idx) => {
        var x1 = line.pos.h - (0.8 * line.textWidth);
        var x2 = line.pos.h + (0.8 * line.textWidth);
        var y2 = line.pos.w + line.size + 20;
        if (x1 <= cursPos.x && cursPos.x <= x2 && line.pos.w < cursPos.y && cursPos.y <= y2) {
            gMeme.selectedLineIdx = idx;
            gOffSetX = cursPos.x - line.pos.h
            gOffSetY = cursPos.y - line.pos.w;
            return line

        }
    })

    return chosenLine;

}

function saveCurCurPosition(cCloc) {
    gCCLoc = cCloc;

}

function dragText() {
    gMeme.lines[gMeme.selectedLineIdx].pos.h = gCCLoc.x - gOffSetX;
    gMeme.lines[gMeme.selectedLineIdx].pos.w = gCCLoc.y - gOffSetY;


}

function dragSticker(){
    gStickersOnCanvas[gChoesenStickerIndex].pos.x = gCCLoc.x - gOffSetX;
    gStickersOnCanvas[gChoesenStickerIndex].pos.y = gCCLoc.y - gOffSetY;
}


// var gMeme = {
//     selectedImgId: 5,
//     selectedLineIdx: 0,
//     lines: [
//         {
//             txt: 'I never eat Falafel',
//             size: 20,
//             align: 'left',
//             color: 'red'
//         }
//     ]
// }