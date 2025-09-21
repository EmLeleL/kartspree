import { Route, Routes } from 'react-router-dom'

import Homepage from '../pages/homepage/Homepage.jsx'
import ProductsPage from '../pages/products_page/ProductsPage.jsx'
import SingleProductPage from '../pages/single_page/SingleProductPage.jsx'
import KartPage from '../pages/kart/KartPage.jsx';
import LoginPage from '../authentication/LoginPage.jsx';
import SignupPage from '../authentication/SignupPage.jsx';
import MyOrdersPage from '../pages/orders/MyOrdersPage.jsx';
import PrivateRoute from '../authentication/PrivateRoute.jsx';
import ProfilePage from "../pages/profile/ProfilePage.jsx";


function Routing() {
    return (
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path="/product/:id" element={<SingleProductPage />} />    {/*:id allows to create and re-direct to all products pages using id as key */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/orders' element={<PrivateRoute> <MyOrdersPage /> </PrivateRoute>} />
            <Route path='/kart' element={<PrivateRoute> <KartPage /> </PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
    )
}

export default Routing