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
      /** @xstate-layout N4IgpgJg5mDOIC5QE8AuBaAtgQwMYAsBLAOzADoAlMYiMAJwAIBJAMzu0zAGJC2OwGdarSEQA2gAYAuolAAHAPaxCqQguKyQAD0QBGCbrIB2ACy6ATLpMBOa7osAOBwDYANCGSJzRsibPWjCSMAZmsJaxNnAFYjAF9Y9zQsPCJSMgAZBWwIBjkAG2xkei4hbORJGSQQRWVVdU0dBCiow2drBysHcyjg83MHE0TEKIkyXWdoro6W3RCHeMSMHAIScgAFAqLGUohkMgB5OXpsOuJYMgA5BVRczZIoMiZiFUJsPK41gEEAVQBlAFEACIVTQ1F71KqNXTBBxkJzWbwOaxtazBEYOIYIGzWMhhELBfQmGIdEwLDxLFKrMgbQr0QRgMoHI7sU7nK43fKFe6PZ6qN5cf4XQFAkFVMGnBp6EzBMjBZy6VEtExOPxWTHOcwyzW6KIuOUmCTBIzWMlJZapdabOk7PaHY6sy7XW5c4gPABqhFoCgYsFQCjkRwg1OwAFdYJABUKRdJQUpwRpIYhelExiEokSjJqYeZMTFDEYOs45RJwqijM5TRSVmkaVt6Yy7Sy1GdHRy7q6yB6vT6-QHIGR-jQI0JOeUY2K4xLEwhzLZjEa0UF01ZpZjAj5oiZvDCHAW5SaEuTktXLbTtgzdkz7c3zrX7h8fgDgeP5JPm5KEPLYU5nB1NS5M3MNwPEQZVYWCCRnENfoJG6AJpUrY8LWpK1zwbZkThvFCXSgSNhWfSpX1qd9pw1GU0QiX8omiItxnVajcTRZVzEgkxTAGRDzSpABhfAwFwABrZg+E4T41iYLhRSI+MP3QWZYWROxdAGAl2mNTFxlhUw5W8VE2IMBFOMpNJeP4oTWHYUTxK4LRfROchsBYVB6AACggiQAEouDNYzyFMwThMssAxKYKTqjfCFQEadAIPIyIlOVTN9B1TFVLISCgKgqJ+hhCRmiMk9sLrG0rybdQ2SdUd7zWdJPgATSYC4AHEwvFEiouGNoxhLHddwmJEcxAppmjIWdQl6CYNSJCsyWIBRaHgKofJPWNiMi7REBilpZXi+xEssAwokxdBnB8IInAMIw0wmOJD2W5CqCHRgLP4VaZOndAWPzLooKCWZpQGTEWNG1VCQNEJDtJO6q2QzJsmdLY3qnDqEFCUYVzaIsYmcNiJkxGw4WCIkWhiQ0IicArkNra0L08Cc1oTFH0BTewggO9ycYRYINJGdKS1RWDxmsYlbsWJCqWptDL0bTDyqR9qNqxcw4QGgtFMVCQMSGzUfF6GF02ootgmCSmJdQ+tpYwh12QR+55fWxowhVhE1ZRRctbp3oTDIHHTrsPLzuiU2a3NkqZetyr2weJ4Xjee3GcVqx0dO5oIYkPxTCMXMizIGI5RRTXSwPMWuJDs8LdtK2sJtqqOy7MBvV9f1A3jj9unzBcRiMZc-G5oazEMRTAgm9FjeD09itp0rZZbGuo87T0G57Zv+zWUNwwgVvp16HEgPOhx0wLSw+7p7FRoReVD9RBxYPHoqafQ69ytbW268Xxve0DAch03+n3pR42MorDdzZsWaUMR1TKlxFRFwW5DTZXMHfSWFdp4OjvK6LeKNjTOFzmYY0Cp07C3TLmK6PsXDZXGLOFw3Q77+XMiJYK4lMEgF7F4LcxhHDtCRMpNoR0QB5DAE5TaBDZQ63lMpLo5Y5TuAAEbXD9JgLwTsjCcPhDw4W7g6CECgPgVAm1AiiKNOIpw3gizAQAO6elQPgPQLF3B8W0bo0CWtooiL1uWewJipHATpuYdhKj+hcLsC4YW8R4hAA */
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
        },
      },

      id: "yt-machine",
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
