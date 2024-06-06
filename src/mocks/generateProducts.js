const { fakerES: faker } = require("@faker-js/faker")

const generateProduct = () => ({
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    image: faker.image.url(),
    stock: faker.number.int({ min: 0, max: 200 })
})

module.exports = { generateProduct }