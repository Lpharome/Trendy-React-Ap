const fs = require('fs');
const path = require('path');


const files = [
    'public/index.html',
    'src/index.js',
    'src/App.js',
    'src/context/AuthContext.js',
    'src/context/ProductContext.js',
    'src/context/NotificationContext.js',
    'src/hooks/useAuth.js',
    'src/hooks/useFetch.js',
    'src/hooks/useToast.js',
    'src/services/api.js',
    'src/services/productService.js',
    'src/styles/variables.scss',
    'src/styles/mixins.scss',
    'src/styles/base.scss',
    'src/pages/Dashboard/Dashboard.js',
    'src/pages/Products/Products.js',
    'src/pages/Orders/Orders.js',
    'src/pages/Users/Users.js',
    'src/pages/Settings/Settings.js',
    'src/pages/Login/Login.js',
    'src/components/Sidebar/Sidebar.js',
    'src/components/Header/Header.js',
    'src/components/Widgets/Widgets.js',
    'src/components/DataTable/DataTable.js',
    'src/components/Notification/Notification.js'
];

// // Create folders
// folders.forEach((folder) => {
//     fs.mkdirSync(path.resolve(__dirname, folder), { recursive: true });
// });

// Create files
files.forEach((file) => {
    fs.writeFileSync(path.resolve(__dirname, file), '');
});

console.log('Admin panel folder structure and files created!');
