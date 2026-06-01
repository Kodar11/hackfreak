const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
} satisfies Window['electron']);

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
