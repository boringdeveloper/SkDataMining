const fetch = require("node-fetch")
const CSVToJSON = require("csvtojson")
const JSONToCSV = require("json2csv").parse
const FileSystem = require("fs")

// Replace this with your shop link
const shopLink = "https://siomaiking.ph/skshop/PPS3092989"

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
                let productId = product.Id
                let image_link = `https://siomaiking.ph/skshop/assets/img/JCWW/products-520/${productId}/0-${productId}.jpg`
                let description = (product.summary == "" || product.summary == null) ? "No description available for this product" : product.summary
                let title = titleCase(product.itemname)
                let inventory = (product.no_of_stocks < 0) ? 0 : product.no_of_stocks
                let availability = (product.no_of_stocks <= 0) ? "out of stock" : "in stock"

                source.push({
                    "id": productId,
                    "title": title,
                    "description": description,
                    "availability": availability,
                    "inventory": inventory,
                    "condition": "new",
                    "price": product.price,
                    "link": shopLink,
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
        .then(() => fetch('https://coppermask.ph/cpshop/api/getItems/'))
        .then((response) => response.json())
        .then((data) => {
            // required fields { id, title, description, availability, inventory, condition, price, link, image_link, brand }
            data.data.forEach(product => {
                let productId = product.Id
                let image_link = `https://coppermask.ph/cpshop/assets/img/COP/products/${productId}/0-${productId}.png`
                let description = (product.summary == "" || product.summary == null) ? "No description available for this product" : product.summary
                let title = titleCase(product.itemname)
                let inventory = (product.no_of_stocks < 0) ? 0 : product.no_of_stocks
                let availability = (product.no_of_stocks <= 0) ? "out of stock" : "in stock"

                source.push({
                    "id": productId,
                    "title": title,
                    "description": description,
                    "availability": availability,
                    "inventory": inventory,
                    "condition": "new",
                    "price": product.price,
                    "link": shopLink,
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
        .then((source) => {
            const csv = JSONToCSV(source, { fields: ["id", "title", "description", "availability", "inventory", "condition", "price", "link", "image_link", "brand", "google_product_category", "fb_product_category", "sale_price", "sale_price_effective_date", "item_group_id", "gender", "size", "age_group", "material", "pattern", "product_type", "shipping", "shipping_weight", "rich_text_description"] })
            FileSystem.writeFileSync("./skshop_import.csv", csv)
        })
        .catch((err) => console.log(err))
})
