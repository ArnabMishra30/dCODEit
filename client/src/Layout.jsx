import React from 'react'
import Header from './components/header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { refreshAccessToken } from './store/authServices'
// import { useEffect } from 'react'

function Layout() {

    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(refreshAccessToken());
    // }, [dispatch]);

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout

//where we give out let we can change that dynamically and other two remains same