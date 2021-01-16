import {  LaptopOutlined, HomeOutlined,UserOutlined,DatabaseOutlined,ShopOutlined,FileTextOutlined} from '@ant-design/icons';
 const menuList=[
    {
        name:'系统人员管理',
        path:'/homepage/SystemUser',
        icon:<LaptopOutlined />
    },
    {
        name:'高校管理',
        path:'/homepage/school',
        icon:<HomeOutlined />
    },
    {
        name:'用户管理',
        path:'/homepage/user',
        icon:<UserOutlined />
    },
    {
        name:'失物招领管理',
        path:'/homepage/lose',
        icon:<DatabaseOutlined />
    },
    {
        name:'二手交易管理',
        path:'/homepage/shop',
        icon:<ShopOutlined />
    },
    {
        name:'推文管理',
        path:'/homepage/article',
        icon:<FileTextOutlined />
    },
]
export default menuList