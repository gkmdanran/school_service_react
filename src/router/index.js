import React from 'react'
import { Redirect } from "react-router-dom"
const Login = React.lazy(() => import("../pages/Login"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const Welcome = React.lazy(() => import("../pages/Welcome"));
const SystemUser = React.lazy(() => import("../pages/SystemUser"));
const School = React.lazy(() => import("../pages/School"));
const User = React.lazy(() => import("../pages/User"));
const Lose = React.lazy(() => import("../pages/Lose"));
const Shop = React.lazy(() => import("../pages/Shop"));
const Article = React.lazy(() => import("../pages/Article"));
const addArticle = React.lazy(() => import("../pages/addArticle"));
const routes=[
    {
        path:"/",
        exact:true,
        component:Login
    },
    {
        path:"/homepage",
        component:HomePage,
        routes:[
            {
                path:"/homepage",
                exact:true,
                render:()=><Redirect to="/homepage/welcome"/>
            },
            {
                path:"/homepage/welcome",
                component:Welcome,
            },
            {
                path:"/homepage/SystemUser",
                component:SystemUser,
            },
            {
                path:"/homepage/school",
                component:School,
            },
            {
                path:"/homepage/user",
                component:User,
            },
            {
                path:"/homepage/lose",
                component:Lose,
            },
            {
                path:"/homepage/shop",
                component:Shop,
            },
            {
                path:"/homepage/article",
                component:Article,
            },
            {
                path:"/homepage/addarticle",
                component:addArticle,
            },
        ]
    },

]
export default routes