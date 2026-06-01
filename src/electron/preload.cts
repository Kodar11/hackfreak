const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
  onWindowStateChange: (callback) => ipcOn('window-state-changed', callback),
  getIsMaximized: () => ipcInvoke('getIsMaximized'),
} satisfies Window['electron']);

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const listener = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, listener);
  return () => electron.ipcRenderer.removeListener(key, listener);
}

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}
