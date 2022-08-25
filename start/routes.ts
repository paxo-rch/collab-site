/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import './routes/users-auth'

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view, auth }) => {
  console.log(auth.use('web').user)
  return view.render('welcome')
}).middleware('auth')

Route.get('/hello', async ({ view }) => {
  return view.render('site.edge')
})
