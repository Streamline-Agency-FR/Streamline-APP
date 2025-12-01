const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "build/streamline_logo.png"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // 1️⃣ Affiche la page de splash
    win.loadFile("splash.html");

    // 2️⃣ Une fois la splash chargée
    win.webContents.once('did-finish-load', () => {
        // Vérifie les mises à jour
        autoUpdater.checkForUpdatesAndNotify();

        // Charge ensuite le dashboard après un léger délai pour éviter le blanc
        setTimeout(() => {
            win.loadURL("https://streamlineagency.eu/dashboard");
        }, 1000); // délai 1 seconde
    });

    // Empêche les fenêtres externes
    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

// ======= AUTO-UPDATER =======
autoUpdater.autoDownload = true;

autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Mise à jour disponible",
        message: "Une nouvelle version est disponible. Téléchargement en cours...",
        buttons: ["OK"]
    });
});

autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Mise à jour prête",
        message: "La mise à jour est prête. Redémarrer pour installer ?",
        buttons: ["Oui", "Plus tard"]
    }).then(result => {
        if (result.response === 0) autoUpdater.quitAndInstall();
    });
});

autoUpdater.on("update-not-available", () => console.log("Aucune mise à jour disponible."));
autoUpdater.on("error", err => console.error("Erreur lors de la mise à jour :", err));

// ======= APP =======
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
