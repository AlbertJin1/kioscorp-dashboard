const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow(isDev) {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1600,
        minHeight: 900,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,  // Disables nodeIntegration for better security
            contextIsolation: true,  // Enables context isolation for better security
            preload: path.join(__dirname, 'preload.js')  // Load preload script for better security and to expose necessary APIs
        },
        icon: path.join(__dirname, 'kioscorp-icon.ico')
    });

    // Maximize the window
    mainWindow.maximize();

    // Load the correct URL based on environment (dev or production)
    const indexPath = isDev ? 'http://localhost:3000' : path.join(__dirname, 'build', 'index.html');
    mainWindow.loadURL(indexPath);

    // Add a menu with an About option and a DevTools toggle
    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'togglefullscreen' }
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
                            icon: path.join(__dirname, 'kioscorp-icon.ico')
                        });
                    }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'F12',  // Optional: you can use a keyboard shortcut to open DevTools
                    click: () => {
                        mainWindow.webContents.toggleDevTools(); // Toggle DevTools
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Optionally prevent opening DevTools automatically
    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools();
    });
}

app.whenReady().then(async () => {
    try {
        // Dynamically import 'electron-is-dev' and create the window after it's available
        const { default: isDev } = await import('electron-is-dev');
        createWindow(isDev);  // Call createWindow after loading isDev
    } catch (err) {
        console.error("Error loading electron-is-dev:", err);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow(true); // Ensure a window is created when there are no open windows
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
