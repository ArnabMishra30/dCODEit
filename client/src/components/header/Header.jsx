// import React, { useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';

// function Header() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     return (
//         <>
//             <header className="shadow sticky z-50 top-0">
//                 <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
//                     <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
//                         <Link to="/" className="flex items-center">
//                             <img
//                                 src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
//                                 className="mr-3 h-12"
//                                 alt="Logo"
//                             />
//                         </Link>
//                         <div className="flex items-center lg:order-2">
//                             <Link
//                                 to="/login"
//                                 className="text-gray-800 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
//                             >
//                                 Log in
//                             </Link>
//                             <Link
//                                 to="/register"
//                                 className="text-white bg-orange-700 hover:bg-orange-300 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
//                             >
//                                 Register
//                             </Link>
//                             <Link
//                                 to="/logout"
//                                 className="text-white bg-orange-700 hover:bg-orange-300 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
//                             >
//                                 Logout
//                             </Link>
//                             <button
//                                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                                 className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                                 aria-controls="mobile-menu"
//                                 aria-expanded={isMenuOpen}
//                             >
//                                 <span className="sr-only">Open main menu</span>
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className={`justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
//                             <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
//                                 <li>
//                                     <NavLink to="/"
//                                         className={({ isActive }) =>
//                                             `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                                         }
//                                     >
//                                         Home
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/about"
//                                         className={({ isActive }) =>
//                                             `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                                         }
//                                     >
//                                         About
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/tweet"
//                                         className={({ isActive }) =>
//                                             `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                                         }
//                                     >
//                                         Tweets
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink to="/contact"
//                                         className={({ isActive }) =>
//                                             `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                                         }
//                                     >
//                                         Contact Us
//                                     </NavLink>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </nav>
//             </header>
//         </>
//     );
// }

// export default Header;

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, clearCredentials } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        dispatch(clearCredentials());
        navigate('/login');
    };

    return (
        <>
            <header className="shadow sticky z-50 top-0">
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link to="/" className="flex items-center">
                            <img
                                src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                                className="mr-3 h-12"
                                alt="Logo"
                            />
                        </Link>
                        <div className="flex items-center lg:order-2">
                            {user ? (
                                <>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white bg-orange-700 hover:bg-orange-300 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-800 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-white bg-orange-700 hover:bg-orange-300 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                aria-controls="mobile-menu"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            </button>
                        </div>
                        <div className={`justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <NavLink to="/"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/about"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        About
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/tweet"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Tweets
                                    </NavLink>
                                </li>
                                {user && (
                                    <li>
                                        <NavLink to="/tasks"
                                            className={({ isActive }) =>
                                                `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                            }
                                        >
                                            Tasks
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink to="/contact"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                        }
                                    >
                                        Contact Us
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;
