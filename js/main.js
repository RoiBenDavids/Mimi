'use strict'
var gIsMBOpen = false;






function init() {
    renderGallery();
    renderKeywords()
}


function renderGallery() {
    const elGallery = document.querySelector('.gallery')
    var imgsToRender = getImgsToGallery();
    var strHTML = ''
    imgsToRender.forEach(img => {
        strHTML += `
        <img src="img/${img.id}.jpg" alt="pic num ${img.id}" class="shadow" onclick="openEditor(${img.id})">
        
        `
    })
    elGallery.innerHTML = strHTML

}

function openEditor(id) {
    var elGallery = document.querySelector('.gallery-area');
    var elMemeArea = document.querySelector('.meme-area');
    elGallery.classList.add('hidden')
    elGallery.classList.add('move-gallery')
    elMemeArea.classList.remove('hidden')
    setTimeout(function(){
        elMemeArea.classList.add('enter-editor')
    },20)
    
    initCanvas(id);

}

function goToGallery() {
    var elGallery = document.querySelector('.gallery-area');
    var elMemeArea = document.querySelector('.meme-area');
    elMemeArea.classList.remove('enter-editor')
    setTimeout(function(){
        elMemeArea.classList.add('hidden')
        elGallery.classList.remove('hidden')
    },400)
    setTimeout(function(){
        elGallery.classList.remove('move-gallery')

    },500)
    

}

function renderKeywords() {
    var elContainer = document.querySelector('.game-bar span');
    var keys = getKeywordsToRender();
    var strHTML = '';
    keys.forEach(key => {
        strHTML += `
        <h6 onclick=onFilterByKey('${Object.keys(key)[0]}') style="font-size:${Object.values(key)[0] + 10}px">${Object.keys(key)[0]}</h6>
        `
    })
    elContainer.innerHTML = strHTML;
}

function moveKewordsIdx() {
    moveKId();
    renderKeywords();
}

function onFilterByKey(key) {
    filterByKey(key);
    renderKeywords()
    renderGallery()

}

// function toggleMBtns() {
//     var elMB = document.querySelector('.managment-btns')
//     if (!gIsMBOpen) {
//         elMB.style = "right:100px ; opacity: 1;"
//         gIsMBOpen = true;
//     } else {
//         elMB.style = "right:-100% ; opacity: 0;"
//         gIsMBOpen = false;

//     }
// }
function toggleMBtns() {
    var elMT = document.querySelector('.managment-btns')
    elMT.classList.toggle('open')
}
function toggleMTtns() {
    var elMT = document.querySelector('.manage-text')
    elMT.classList.toggle('openG')
}
function toggleStickers() {
    var elMT = document.querySelector('.stickers-container')
    elMT.classList.toggle('open')
}
function toggleSAD() {
    var elMT = document.querySelector('.share-and-download-container')
    elMT.classList.toggle('open')
}

