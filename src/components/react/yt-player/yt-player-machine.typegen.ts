// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(300)#yt-machine.Check IframeAPI": {
      type: "xstate.after(300)#yt-machine.Check IframeAPI";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "assign iframe rendered" | "play from start";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    "assign embedString": "";
    "assign iframe rendered": "iframe rendered";
    "assign iframeAPI loaded": "xstate.after(300)#yt-machine.Check IframeAPI";
    "play from start": "replay";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "iframeAPI loaded": "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Check IframeAPI"
    | "Load player"
    | "Player ready"
    | "Player ready.Operations"
    | "Player ready.Operations.Not playing"
    | "Player ready.Operations.Not playing.Initial"
    | "Player ready.Operations.Not playing.Video stopped"
    | "Player ready.Operations.Not playing.Video stopped.Ended"
    | "Player ready.Operations.Not playing.Video stopped.Paused"
    | "Player ready.Operations.Playing"
    | "Render Iframe"
    | {
        "Player ready"?:
          | "Operations"
          | {
              Operations?:
                | "Not playing"
                | "Playing"
                | {
                    "Not playing"?:
                      | "Initial"
                      | "Video stopped"
                      | { "Video stopped"?: "Ended" | "Paused" };
                  };
            };
      };
  tags: never;
}
