type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
  'window-state-changed': boolean;
  getIsMaximized: boolean;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
    onWindowStateChange: (callback: (isMaximized: boolean) => void) => UnsubscribeFunction;
    getIsMaximized: () => Promise<boolean>;
  };
}
