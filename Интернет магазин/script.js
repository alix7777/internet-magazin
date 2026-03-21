'use strict'

const catalog = document.getElementById("catalog")

//
//
fetch("./data/products.json").then( uploadProducts )

function uploadProducts(data) {
    //
    //
    data.json().then( getProducts )
}

function getProducts(data) {
    for (let phoneName in data) {
        const phoneData = data[phoneName]
        const phoneCard = getProductCard(phoneName, phoneData)
        console.append(phoneCard)
    }
}

function getProductCard(phoneName, phoneData) {
    //
    const phoneCard = document.createElement('div')
    phoneCard.className = "phone-card"

    //
    const cardTitle = document.createElement('h4')
    cardTitle.innerText = phoneName
    phoneCard.append(cardTitle)

    //
    const cardImagesSlider = getImagesSlider(phoneData.images)
    phoneCard.append(cardImagesSlider)

    //
    const descriptionDiv = getDescriptionDiv(phoneData)
    phoneCard.append(descriptionDiv)

    return phoneCard
}

function getImagesSlider(imagesList) {
    //
    const imagesSlider = document.createElement('div')
    imagesSlider.className = 'slider-wrapper'

    //
    for(let i = 0; i < imagesList.length; i++) {
        const image = new Image()
        image.src = './images/' + imagesList[i]
        if (i === 0) {
            image.className = 'slide=image visible'
        } else {
            image.className = 'slide-image'
        }
        imagesSlider.append(image)
    }

    //
    if (imagesList.length > 1) {
        const arrowForward = new Image()
        arrowForward.src = './arrow_forward.png'
        arrowForward.className = "arrow forward"
        arrowForward.onclick = () => showForwardImage(imagesSlider)
        imagesSlider.append(arrowForward)

        const arrowBack = new Image()
        arrowBack.src = './arrow_back.png'
        arrowBack.className = "arrow back"
        arrowBack.onclick = () => showBackImage(imagesSlider)
        imagesSlider.append(arrowBack)
    }

    return imagesSlider
}

function showBackImage(slider) {
    const images = slider.querySelectorAll('.slide-image')
    let index = 0
    while (index < images.length) {
        if(images[index].classList.contains('visible')) {
            images[index].classList.remove('visible')
            if (index > 0) {
                images[index - 1].classList.add('visible')
            } else {
                images[images.length - 1].classList.add('visible')
            }
            index = images.length
        }
        index++
    }
}

function showBackImage(slider) {
    const images = slider.querySelectorAll('.slide-image')
    let index = 0
    while (index < images.length) {
        if(images[index].classList.contains('visible')) {
            images[index].classList.remove('visible')
            if (index === images.length - 1) {
                images[0].classList.add('visible')
            } else {
                images[index + 1].classList.add('visible')
            }
            index = images.length
        }
        index++
    }
}
