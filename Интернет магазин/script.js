'use strict'

fetch("./data/products.json").then( uploadProducts )

function uploadProducts(data) {
    data.json().then( getProducts )
}

function getProducts(products) {
    for (let phoneName in products) {
        const phoneData = products[phoneName]
        console.log(phoneName, phoneData)
    }
}