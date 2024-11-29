import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Layout from '../src/Layout.jsx'
import Home from './components/home/Home.jsx'
import About from './components/about/About.jsx'
import Contact from './components/contact/Contact.jsx'
import AllTweets from './components/tweets/AllTweets.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Register from './components/register/Register.jsx'
import Login from './components/login/Login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//login store
import store from './store/store.js'
import { Provider } from 'react-redux'
import CreateTweet from './components/tweets/CreateTweet.jsx'
import UserTweet from './components/tweets/UserTweets/UserTweet.jsx'
import EditTweetForm from './components/tweets/UserTweets/EditTweetForm.jsx'
import Task from './components/tasks/Task.jsx'
// import CreateTask from './components/tasks/CreateTask.jsx'
import ProtectedRoute from './protected route/ProtectedRoute.jsx';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       {
//         path: "",
//         element: <Home />
//       },
//       {
//         path: "about",
//         element: <About />
//       },
//       {
//         path: "contact",
//         element: <Contact />
//       }
//     ]
//   }
// ])

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
      <Route path='tweet' element={<AllTweets />} />
      <Route path='register' element={<Register />} />
      <Route path='login' element={<Login />} />
      {/* <Route path='createTweet' element={<CreateTweet />} /> */}
      <Route
        path='createTweet'
        element={
          <ProtectedRoute>
            <CreateTweet />
          </ProtectedRoute>
        }
      />
      {/* <Route path='myBlogs' element={<UserTweet />} /> */}
      <Route
        path='myBlogs'
        element={
          <ProtectedRoute>
            <UserTweet />
          </ProtectedRoute>
        }
      />
      {/* <Route path='edittweet' element={<EditTweetForm />} /> */}
      <Route path='edit-tweet/:tweetId' element={<EditTweetForm />} /> {/* Fix here */}
      {/* <Route path='tasks' element={<Task />} /> */}
      {/* <Route path='createTask' element={<CreateTask />} /> */}
      <Route
        path='tasks'
        element={
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        }
      />
    </Route >
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* for toast notification */}
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
)
