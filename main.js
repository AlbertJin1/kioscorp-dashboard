const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1600,
        minHeight: 900,
        autoHideMenuBar: true,  // Auto-hide the menu bar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'kioscorp-icon.ico')  // Set the window icon
    });

    // Maximize the window
    mainWindow.maximize();

    // Load your application
    mainWindow.loadURL('http://localhost:3000');

    // Add a menu with an About option
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                { role: 'quit' } // Adds a Quit option
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' }, // Adds a Reload option
                { role: 'togglefullscreen' } // Toggle Fullscreen
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'About This Application',
                            message: 'KiosCorp POS System',
                            detail: 'This application is a capstone project developed by KiosCorp.\n\n© 2024 KiosCorp. All rights reserved.',
                            buttons: ['OK'],
                            icon: path.join(__dirname, 'kioscorp-icon.ico') // Optional, set the icon for the About dialog
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu); // Set the menu for the app

    // Optionally prevent opening DevTools
    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
