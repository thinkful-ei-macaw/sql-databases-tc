require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})
console.log('knex and driver installed correctly');

knexInstance('amazong_products')
  .select('*');
  
function searchByName(searchTerm) {
  knexInstance
    .select('name', 'price')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

//searchByName('Burger')

function paginateItems(page) {
  const itemsPerPage = 6
  const offset = itemsPerPage * (page - 1)
  knexInstance
    .select('name', 'price')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

//paginateItems(2)

function searchAfterDate(daysAgo) {
  knexInstance
    .select('name', 'price', 'date_added')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then( result => {
      console.log(result)
    })
}

//searchAfterDate(10)

function getTotalCost(){
  knexInstance
    .select('category')
    .sum('price AS total_price')
    .from('shopping_list')
    .groupBy('category')
    .orderBy([ 
      {column: 'total_price', order: 'DESC'}
    ])
    .then( result => {
      console.log(result)
    })
}

getTotalCost();