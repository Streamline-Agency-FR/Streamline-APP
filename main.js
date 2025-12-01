const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "icon.png"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Ouvre automatiquement ton dashboard avec login intégré
    win.loadURL("https://streamlineagency.eu/dashboard");

    // Empêche les fenêtres externes
    win.webContents.setWindowOpenHandler(() => {
        return { action: "deny" };
    });

    // Vérifie les mises à jour dès que la fenêtre est prête
    win.once("ready-to-show", () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

// ======= AUTO-UPDATER =======
autoUpdater.autoDownload = true; // Télécharge automatiquement

// Lorsqu'une mise à jour est disponible
autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Mise à jour disponible",
        message: "Une nouvelle version est disponible. Téléchargement en cours...",
        buttons: ["OK"]
    });
});

// Lorsque la mise à jour est téléchargée
autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox({
        type: "info",
        title: "Mise à jour prête",
        message: "La mise à jour est prête. Redémarrer pour installer ?",
        buttons: ["Oui", "Plus tard"]
    }).then(result => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

// Si aucune mise à jour n’est trouvée
autoUpdater.on("update-not-available", () => {
    console.log("Aucune mise à jour disponible.");
});

// En cas d’erreur
autoUpdater.on("error", (err) => {
    console.error("Erreur lors de la mise à jour :", err);
});

// ======= APP =======
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
