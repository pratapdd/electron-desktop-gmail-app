const {app, BrowserWindow, dialog, Menu, platfrom, session, Tray} = require('electron')

const path = require('path')

require('electron-context-menu')({
  prepend: (params, browserWindow) => []
})

let window = null
let appIcon = null
let trayIcon = null

//hardcoding for testing
let platform = 'darwin'
//temporary fix broken high-dpi scale factor on Windows (125% scaling)
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  api.commandLine.appendSwitch('force-device-scale-factor', '1')
}

if (platform === 'darwin') {
  trayIcon = path.join(__dirname, 'assets/gmail.png')
} else if (platform === 'win32') {
  trayIcon = path.join(__dirname, 'assets/gmail.ico')
} else {
  trayIcon = path.join(__dirname, 'assets/gmail.ico')
}

app.once('ready', () => {
  window = new BrowserWindow({
    width: 767,
    height: 667,
    show: false,
    icon: trayIcon,
    title: 'Gmail',
    toolbar: true,
    webPreferences: {
      nodeIntegration: false
    }
  })

  const url = 'https://www.gmail.com'

  session.defaultSession.cookies.get({}, (error, cookies) => {

  })


  //Function for clearing cache
  const win = BrowserWindow.getAllWindows()[0]
  const ses = win.webContents.session
  const clearAppCache = () => {
    ses.clearCache(() => {
      dialog.showMessageBox({type: 'info', buttons:['OK'], message: 'Cache cleared.'})
    })
  }

  // Template for menu
  const menuTemplate = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'delete'}
      ]
    },
    {
      label: 'View',
      submenu:[
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'}
      ]
    },
    {
      role: 'window',
      submenu:[
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      label: 'Maintenance',
      submenu: [
        {
          label: 'Clear history',
          click: () => {window.webContents.clearHistory(dialog.showMessageBox({type: 'info', buttons: ['OK'], message: 'History cleaned.'}))}
        },
        {
          label: 'Clear cache',
          click: () => {clearAppCache()}
        },
        {
          label: 'Clear storage data',
          click: () => {window.webContents.session.clearStorageData(dialog.showMessageBox({ type: 'info', buttons: ['OK'], message: 'Storage data cleaned.'}))}
        },
        {
          label: 'Check cache size',
          click: () => {window.webContents.session.getCacheSize((size) => dialog.showMessageBox({type: 'info', buttons: ['OK'], message: `Cache size is: ${size} bytes.`}))}
        },
        {
          label: 'Open dev tools',
          click: () => {window.webContents.openDevTools()}
        }
      ]
    },
    {
      role: 'help',
      submenu:[
        {
          label: 'Learn More',
          click: () => {require('electron').shell.openExternal('http://pratapdessai.com')}
        },
        {
          label: 'Author',
          click: () => {require('electron').shell.openExternal('http://pratapdessai.com')}
        }
      ]
    }
  ]


  const menu = Menu.buildFromTemplate(menuTemplate)

  Menu.setApplicationMenu(menu)

  appIcon = new Tray(trayIcon)


  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore app',
      click: () => {
        window.show()
      }
    },
    {
      label: 'Close app',
      click: () => {
        window.close()
      }
    }
  ])

  appIcon.setTitle('Gmail')

  appIcon.setToolTip('Gmail')

  appIcon.setContextMenu(contextMenu)

  appIcon.setHighlightMode('always')

  appIcon.isDestroyed(false)

  appIcon.on('click', () => {
    window.isVisible() ? window.hide() : window.show()
  })

  window.loadURL(url, {
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1'
  })

  window.on('closed', function () {
    window = null
  })

  window.on('minimize', function (event) {
    event.preventDefault()

    window.hide()
  })

  window.once('ready-to-show', () => {
    window.show()

    // if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV.trim() === 'dev') {
    //   window.webContents.openDevTools()
    // }
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

