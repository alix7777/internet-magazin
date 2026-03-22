'use strict'

const catalog = document.getElementById("catalog")

const cartProductCounter = document.getElementById("cart-product-counter")

fetch("./data/products.json").then( uploadProducts )

let order = {}
let storageData = localStorage.getItem('order')
if (storageData) {
    order = JSON.parse(storageData)
    let count = 0
    for(let productName in order) {
        count += order[productName]
    }
    cartProductCounter.innerText = count
}

function updateLocalStorage() {
    const storageData = JSON.stringify(order)
    localStorage.setItem('order', storageData)
}

function updateCartCounter(value) {
    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value 
}

function orderAdd(productKey) {
    if (productKey in order) {
        order[productKey]++
    } else {
        order[productKey] = 1
    }
    updateLocalStorage()
    updateCartCounter(1)
    return order[productKey]
}

function orderRemove(productKey) {
    if (productKey in order === false) {
        return 0
    }

    order[productKey]--
    updateCartCounter(-1)

    const count = order[productKey]
    if (count === 0) {
        delete order[productKey]
    }

    updateLocalStorage()
    return count
}

function uploadProducts(data) {
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
    const phoneCard = document.createElement('div')
    phoneCard.className = "phone-card"
    const cardTitle = document.createElement('h4')
    cardTitle.innerText = phoneName
    phoneCard.append(cardTitle)
    const cardImagesSlider = getImagesSlider(phoneData.images)
    phoneCard.append(cardImagesSlider)
    const descriptionDiv = getDescriptionDiv(phoneData)
    phoneCard.append(descriptionDiv)
    return phoneCard
}

function getImagesSlider(imagesList) {
    const imagesSlider = document.createElement('div')
    imagesSlider.className = 'slider-wrapper'
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

function getDescriptionDiv(phoneName, phoneData) {
    const descriptionDiv = document.createElement('div')
    descriptionDiv.className = "description"
    const productOrderDiv = getProductOrderDiv (phoneName)
    descriptionDiv.append(productOrderDiv)
    return descriptionDiv
}


function getProductOrderDiv (phoneName) {
    const orderDiv = document.createElement('div') 
    orderDiv.className = 'order'
    const firstButton = document.createElement('button') 
    firstButton.innerText = 'B КОРЗИНУ' 
    firstButton.onclick= () => {
        const counter = orderAdd(phoneName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }
    orderDiv.append(firstButton)
    const removeButton = document.createElement('button') 
    removeButton.className = 'change-order-button'
    removeButton.innerText = '-'
    removeButton.onclick = () => {
        const counter = orderRemove (phoneName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }
    orderDiv.append(removeButton)
    const counterSpan = document.createElement('span')
    counterSpan.className = 'order-counter'
    counterSpan.innerText = 0
    orderDiv.append(counterSpan)

    const addButton = document.createElement('button') 
    addButton.className = 'change-order-button' 
    addButton.innerText = '+'
    addButton.onclick = () => {
        const counter = orderAdd(phoneName)
        updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    }
    orderDiv.append(addButton)
    let counter = 0
    if (phoneName in order) {
        counter = order [phoneName]
    }
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    return orderDiv
}

function updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton) {
    counterSpan.innerText = counter
    if (counter > 0) {
        firstButton.style.display = 'none'
        removeButton.style.display = 'inline' 
        counterSpan.style.display = 'inline' 
        addButton.style.display = 'inline'
    } else {
        firstButton.style.display = 'inline' 
        removeButton.style.display = 'none' 
        counterSpan.style.display = 'none' 
        addButton.style.display = 'none'
    }
}
