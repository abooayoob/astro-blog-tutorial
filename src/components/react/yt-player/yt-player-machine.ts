import { createMachine, assign } from "xstate";

type PlayerStates = keyof typeof YT.PlayerState;
type PlayerErrors = keyof typeof YT.PlayerError;

export const createYtPlayerMachine = ({
  videoId,
  start,
  end,
  description,
}: {
  videoId: string;
  start?: number;
  end?: number;
  description: string;
}) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QE8AuBaAtgQwMYAsBLAOzADoAlMYiMAJwAIBJAMzu0zAGJC2OwGdarSEQA2gAYAuolAAHAPaxCqQguKyQAD0QBGCbrIB2ACy6ATLpMBOa7osAOBwDYANCGSJzRsibPWjCSMAZmsJaxNnAFYjAF9Y9zQsPCJSMgAZBWwIBjkAG2xkei4hbORJGSQQRWVVdU0dBCiow2drBysHcyjg83MHE0TEKIkyXWdoro6W3RCHeMSMHAIScgAFAqLGUohkMgB5OXpsOuJYMgA5BVRczZIoLjX0gEEATSYLgHEKzRqVNQ0VUaUTaYwkEmCTgcRgmDms5iGTWaZHM1lCvQmznMJhBCw8SxSqzIG0K9EEYDKByO7FO5yuN3yhXuZCYxH+2Dyj2eAFUAMoAUQAIj8qn9Tg09JCyE54UY4W00SMHIibNYyGEQsF9Di5VY8Ullql1psyTs9odjrTLtdbkziFAWWzVByuPyLoKhSL5Ep-vUgXoTMEyMFnLpFZ0BmZBh5EFig+YtVEXCGTBCjNZ9QSVmkSVtyZSLTSAXSbYzkMyAGqEWgKBiwVAKORHCDE7AAV1gkFd7s90l+PvF-oQvSiYxCUR1CchCJjTSMhl1zhD4NswRhmeS2eNpO2FN2VMtxetDLu9rIVZrdYbTcgZH5NC7QjLXuqA4BEoQqLVIXHQQnVkDRFAh8aITG8SFoQcEMMwSfFNyNYkTV3AtqROI9c3uLk+V7SpvVqd8h1DBxpRcDoExcIw+jcWcTCcYMJGcCF+gkboAkDDdDSJXNTT3c1UKtDD7W7D1hT7UU3z9UBGjjYMogiZwHBBEEtWozwEGiZx1WCCcugYkxTAGDjCTSABhfAwFwABrZg+E4Z41iYLgXzFAipMQdBZmI6w2nsAYtXadNEXGYjTBDbw0X0gx4SMrcyDMizrNYdg7IcrgtHrE5yGwFhUHoAAKYJwQASi4A1jPIeKrJs5KwHsphnIkwE3IQdBCpMWTTAMGEoNRYJEWCMCyCiBNGOhCIQ1CKJ4lg4gFFoeAqjKrd+3wyTtHcswfCsOwDEUyxTERdBnB8IInAkaEsXMBj0xihCqAfRgkv4FbfSa9aWquhcukYoJZkDAZESulE-HsCQ-CCQrdAnW6iUybJbS2F7B2a0JRgAtolxiZx9ImFU1SgnEWhiCEIicGGcyQ-NdiR1z3vQUdQco-RCr0+E+tnKHRnBcIwKonpjqm2CloQ7jkP3Qs0PUBa8Nej9Bplbx5VXJVAbXYNyL8dMod6PUhazEXKbNA8iyl48EfuGm1saMISNlJXFXO-rsTIbHjrlPbrCTHFye3PMjYlq16XNs9WXZPJLbexorDRgWYhZzX9MRZShpCCZbHO8JbB9xCdypvjD1NoOy0raswFretG2bCOP26Bc120v8o0Amj7HVNp51RKxIVo7PRbz43JbOM3i7PC8y6vSvbzWdtOwgauh16NVzEY92JzlSx2bU1UUXhUM17RBwWN7w3eIHwPS1PB0x-L69mzvB85-E1bI8QYI37GfSRko5dAxiRFsa8gpJM2MrraT6MfXO-t+LoUvvPZq6ZNL-i1mEGwzRoxqRiCBFww1xiohcN0bOlVEq2Vqg5OBdNoIfx2roPaf1AaWBdkYNBRhxyzF1vEIAA */
      initial: "Check IframeAPI",

      predictableActionArguments: true,

      context: {
        iframeRendered: false,
        videoId,
        start: start || 0,
        end,
        description,
        embedString: "",
        iframeAPILoaded: false,
      },

      schema: {
        context: {} as {
          iframeRendered: boolean;
          videoId: string;
          start: number;
          end: number | undefined;
          description: string;
          embedString: string;
          iframeAPILoaded: boolean;
        },
        events: {} as
          | { type: "iframe rendered" }
          | { type: "ready" }
          | { type: "replay" }
          | { type: "play from start" }
          | { type: PlayerStates }
          | { type: PlayerErrors },
      },

      tsTypes: {} as import("./yt-player-machine.typegen").Typegen0,

      states: {
        "Render Iframe": {
          on: {
            "iframe rendered": {
              target: "Load player",
              actions: "assign iframe rendered",
            },
          },

          entry: "assign embedString",
        },

        "Load player": {
          on: {
            ready: "Player ready",
          },
        },

        "Player ready": {
          states: {
            Operations: {
              initial: "Not playing",

              states: {
                "Not playing": {
                  states: {
                    Initial: {
                      on: {
                        PAUSED: "Video stopped.Paused",
                        ENDED: "Video stopped.Ended",
                      },
                    },

                    "Video stopped": {
                      initial: "Paused",

                      states: {
                        Paused: {
                          on: {
                            ENDED: "Ended",
                          },
                        },

                        Ended: {
                          on: {
                            replay: {
                              target: "Ended",
                              internal: true,
                              actions: "play from start",
                            },
                          },
                        },
                      },
                    },
                  },

                  initial: "Initial",

                  on: {
                    PLAYING: {
                      target: "Playing",
                      actions: "pause other players",
                    },
                  },
                },

                Playing: {
                  on: {
                    PAUSED: "Not playing.Video stopped.Paused",
                    ENDED: "Not playing.Video stopped.Ended",
                  },
                },
              },
            },
          },

          type: "parallel",
        },

        "Check IframeAPI": {
          always: {
            target: "Render Iframe",
            cond: "iframeAPI loaded",
          },

          after: {
            "300": {
              target: "Check IframeAPI",
              actions: "assign iframeAPI loaded",
            },
          },

          description: `Check if the iframe Api is already loaded globally`,
        },
      },

      id: "yt-machine",
      description: `ALLCAPS events are emitted from the YouTube player`,
    },
    {
      actions: {
        "assign embedString": assign((context, event) => {
          let embedURL = new URL(
            `https://www.youtube.com/embed/${context.videoId || "placeholder"}`
          );
          embedURL.searchParams.set("enablejsapi", "1");
          embedURL.searchParams.set("controls", "0");
          embedURL.searchParams.set("modestbranding", "1");
          embedURL.searchParams.set("playsinline", "1");
          embedURL.searchParams.set("rel", "0");

          if (context.start) {
            embedURL.searchParams.set("start", context.start.toString());
          }
          if (context.end) {
            embedURL.searchParams.set("end", context.end.toString());
          }
          return {
            embedString: embedURL.toString(),
          };
        }),
        "assign iframeAPI loaded": assign((context, event) => {
          return {
            iframeAPILoaded: window.iframeApiReady || false,
          };
        }),
        "pause other players": (context, event) => {
          console.log(`Pausing other players than ${context.videoId}`);
          for (let player in window.YTPlayers) {
            if (player !== context.videoId) {
              window.YTPlayers[player].pauseVideo();
            }
          }
        },
      },
      guards: {
        "iframeAPI loaded": (context, event) => {
          return window.iframeApiReady || false;
        },
      },
    }
  );
