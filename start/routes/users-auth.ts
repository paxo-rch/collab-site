import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

Route.get('/login', async ({ view, request, response }) => {
  if (!request.qs().isEmail) {
    response.redirect('/login?isEmail=false'+(request.qs().name ? '&name='+request.qs().name : '')+(request.qs().error ? '&error='+request.qs().error : ''))
  }
  return view.render('users-auth/login', {name: (request.qs().name ? request.qs().name : ''), error: request.qs().error, isEmail: (request.qs().isEmail=='true' ? true : false)})    // erreur si espace dans le nom
})    // probleme si ' ' dans username


Route.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  response.redirect('/login')
})


Route.post('/login/username', async ({ response, request, auth }) => {
  const userName = request.input('username')
  const password = request.input('password')
  try {
    let rememberMe = request.input('rememberMe') == 'on'
    await auth.use('web').attempt(userName, password, rememberMe)
    response.redirect('/')
  } catch(error) {
    response.redirect('/login?name='+(userName ? userName : '')+'&error=true')
  }
})


Route.post('/login/email', async ({ response, request, auth }) => {
  const email = request.input('email')
  const password = request.input('password')
  try {
    let rememberMe = request.input('rememberMe') == 'on'
    await auth.use('web').attempt(email, password, rememberMe)
    response.redirect('/')
  } catch(error) {
    response.redirect('/login?name='+(email ? email : '')+'&error=true')
  }
})


Route.get('/signup', async ({ view }) => {
  return view.render('users-auth/signup')
})


Route.post('/signup', async ({ view, request, auth, response }) => {
  if (!request.input('username') || !request.input('password') || !request.input('email') || !request.input('classe')) {
    return view.render('users-auth/signup', { error : true })
  }
  if (await User.findBy('email', request.input('email')) || await User.findBy('userName', request.input('username'))) {
    return view.render('users-auth/signup', { error : true })
  }
  const user =  new User()
  user.userName = request.input('username')
  user.password = request.input('password')
  user.email = request.input('email')
  user.class = request.input('classe')
  const image = request.file('profile_image')
  if (image) {
    const fileName = '/'+user.class+'/'+user.id+'_image.jpg'
    await image.move(Application.tmpPath('users'), {
      name: fileName,
      overwrite: true,
    })
    const url = await Drive.getUrl(fileName)
    user.profilePicturePath = url
    console.log(user.profilePicturePath)
  } else {
    user.profilePicturePath = '/images/makeaphone.png'
  }
  await user.save()
  console.log(user.$isPersisted)
  console.log(user.$attributes)
  let rememberMe = request.input('rememberMe') == 'on'
  await auth.use('web').login(user, rememberMe)
  response.redirect('/')
})
