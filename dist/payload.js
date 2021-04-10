"use strict";
var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('event', function (evt, payload) {
    console.log(payload);
});
