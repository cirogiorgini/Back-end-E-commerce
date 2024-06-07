const generateInvalidProductDataError = ({ title, description, price, thumbnail, code, status, stock, category }) => {
    return `Invalid product data:
    * title       : should be a non-empty String, received ${title} (${typeof title})
    * description : should be a non-empty String, received ${description} (${typeof description})
    * price       : should be a positive Number, received ${price} (${typeof price})
    * thumbnail   : should be a String, received ${thumbnail} (${typeof thumbnail})
    * code        : should be a non-empty String, received ${code} (${typeof code})
    * status      : should be a Boolean, received ${status} (${typeof status})
    * stock       : should be a non-negative Number, received ${stock} (${typeof stock})
    * category    : should be a non-empty String, received ${category} (${typeof category})`
}

module.exports = { generateInvalidProductDataError }
