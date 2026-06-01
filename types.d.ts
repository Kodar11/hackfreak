type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
  sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    sendFrameAction: (payload: FrameWindowAction) => void;
  };
}
