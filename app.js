const fetch = require("node-fetch")
const CSVToJSON = require("csvtojson")
const JSONToCSV = require("json2csv").parse
const FileSystem = require("fs")

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

CSVToJSON().fromFile("./skshop.csv").then(source => {
    fetch("https://siomaiking.ph/skshop/api/getItems")
        .then((response) => response.json())
        .then((data) => {
            // required fields { id, title, description, availability, inventory, condition, price, link, image_link, brand }
            data.data.forEach(product => {
                let image_link = `https://siomaiking.ph/skshop/assets/img/JCWW/products-520/${product.Id}/0-${product.Id}.jpg`
                let description = (product.summary == "" || product.summary == null) ? "No description available for this product" : product.summary
                let title = titleCase(product.itemname)

                source.push({
                    "id": product.Id,
                    "title": title,
                    "description": description,
                    "availability": "in stock",
                    "inventory": "999",
                    "condition": "new",
                    "price": product.price,
                    "link": "https://siomaiking.ph/skshop/PPS3092989",
                    "image_link": image_link,
                    "brand": product.category_name,
                    "google_product_category": "",
                    "fb_product_category": "",
                    "sale_price": '',
                    "sale_price_effective_date": "",
                    "item_group_id": "",
                    "gender": "",
                    "size": "",
                    "age_group": "",
                    "material": "",
                    "pattern": "",
                    "product_type": "",
                    "shipping": "",
                    "shipping_weight": "",
                    "rich_text_description": description
                })
            })

            return source
        })
        .then((source) => fetch('https://coppermask.ph/cpshop/api/getItems/'))
        .then((response) => response.json())
        .then((data) => {
            // required fields { id, title, description, availability, inventory, condition, price, link, image_link, brand }
            data.data.forEach(product => {
                if (product.no_of_stocks > 0) {
                    let image_link = `https://coppermask.ph/cpshop/assets/img/COP/products/${product.Id}/0-${product.Id}.png`
                    let description = (product.summary == "" || product.summary == null) ? "No description available for this product" : product.summary
                    let title = titleCase(product.itemname)

                    source.push({
                        "id": product.Id,
                        "title": title,
                        "description": description,
                        "availability": "in stock",
                        "inventory": "999",
                        "condition": "new",
                        "price": product.price,
                        "link": "https://coppermask.ph/cpshop/PPS3092989",
                        "image_link": image_link,
                        "brand": product.category_name,
                        "google_product_category": "",
                        "fb_product_category": "",
                        "sale_price": '',
                        "sale_price_effective_date": "",
                        "item_group_id": "",
                        "gender": "",
                        "size": "",
                        "age_group": "",
                        "material": "",
                        "pattern": "",
                        "product_type": "",
                        "shipping": "",
                        "shipping_weight": "",
                        "rich_text_description": description
                    })
                }
            })

            return source
        })
        .then((source) => {
            const csv = JSONToCSV(source, { fields: ["id", "title", "description", "availability", "inventory", "condition", "price", "link", "image_link", "brand", "google_product_category", "fb_product_category", "sale_price", "sale_price_effective_date", "item_group_id", "gender", "size", "age_group", "material", "pattern", "product_type", "shipping", "shipping_weight", "rich_text_description"] })
            FileSystem.writeFileSync("./skshop_import.csv", csv)
        })
        .catch((err) => console.log(err))
})
