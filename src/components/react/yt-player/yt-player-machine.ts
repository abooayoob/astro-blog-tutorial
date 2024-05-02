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
      /** @xstate-layout N4IgpgJg5mDOIC5QE8AuBaAtgQwMYAsBLAOzADoAlMYiMAJwAIBJAMzu0zAGJC2OwGdarSEQA2gAYAuolAAHAPaxCqQguKyQAD0QBGCbrIB2ACy6ATLpMBOa7osAOBwDYANCGSJzRsibPWjCSMAZmsJaxNnAFYjAF9Y9zQsPCJSMgAZBWwIBjkAG2xkei4hbORJGSQQRWVVdU0dBCiow2drBysHcyjg83MHE0TEKIkyXWdoro6W3RCHeMSMHAIScgAFAqLGUohkMgB5OXpsOuJYMgA5BVRczZIoLjX0gEEATSYLgHEKzRqVNQ0VUaUWcPl0YV0UTsEnMzmC0SGTSMDjIBmCwSMUXMZlmAwWHiWKVWZA2hXogjAZQOR3Yp3OVxu+UK9zITGI-2weUezwAqgBlACiABEflU-qcGnpgiinNZvA5rG1rMERg5ETZrGQwiFgvoTDEOiZ8Ullql1ptyTs9odjnTLtdbsziFBWezVJyuAKLkLhaL5Ep-vUgXoTMEyPDwSrOgMzIMPIhnOYw0nIS54SYJBjrMbCSs0qSthSqTbaQD6Q6mcgWQA1Qi0BQMWCoBRyI4QEnYACusEgnu9vukvwDEuDCF6UTGISi+qMSel5kRMUMyPG8Ik4WVRmcOeSefNZO2lN21NtZftjLuzrItfrjebrcgZAFNF7Qkrfuqw4BkoQ5lsxgxFUgmnKxQ0RQIfGiExvGlBxkXhbMEgJXczRJC1D2LGkTjPAt7m5fkB0qf1am-UdnF0GUXA6JMXFnWF1SccMJGcTN+hhKFTGCHdTWJAtLSPa0sLtXDnT7H0RUHMUvyDUBGkTMMVQiZwHBBEFdTceMEGiZwtRVEwumYkxTDxJCTSJNIAGF8DAXAAGtmD4ThnjWJguA-cVSNkxB0FxLU2nsAZdXaIxrERcYUU4xMQuCIyDDlbjzPIKybPs1h2CclyuC0JsTnIbAWFQegAApgnXABKLgzL3Mhkrshz0rAZymHc6TAS8hB0FKhTIjsTpZ30SFESC1FEwmCQsQcaVxqieIkOIBRaHgKoqrNIcSJk7RvKjcMevsfT+oMKJEXQUFUWRDpyM6JU4lM3NUKoF9GDS-g1sDNrNo68wDGMLoWKCWZQwGREvrIbEcQkPwglKyEjVulDiUybJHS2V6R3a0JRlAto4RiZwjImdVNUm-UWhiTMIicBLqr4jDdlRzyPvQCd7CCSxM3XPG5WCMKRlRAwYVMcEHHGxDFnh-N0KLY8S2w9QluIt6f2gshZXlRVbCAtVNKTHxelCL6ommOF5jhniJYPKXBNPOXz2R+56Y2xowhVhU1aVTWhuxMg8dBaxca+vpdCp1Cactk9Sxthk7avNkOTyB33saKxMdBZoQnXPxTCMRc4TIGJ4SVCRhdsUXkLN-dCytcPZbOW3KxrOswAbJsWzbBOf26ZdAJGTFYzAzScT8xVAgibFhdDYPeMlquZbtKP66vG8m7vVvHzWLsewgdvR16TVYSCJxp2RSxuYH-8-1hGHouF8xJ-NyuBOrueK0vF0l+b+82yfF8t6k9bE8QOiMMVhMSszXKGGIiI8YokVCpFw0FMxYlvqbRKaELYzyEjhV+292oj1RJfXUvRMS9F0IuIwkEOgxVCIqfU24UHVVqqlRyjUXI4JAPeLwysjCOHaAqCibQjogDyGAAq3lwSjD1luAKXQtzwncAAI2uM2TAXhnbcP6LwuwLg-buDoIQKA+BUDeUCOGHWl0nDeDhBpAA7nWVA+A9BfXcNZfRhjED6XcI0HyztJHmJkVY4GXCeGyn4X7WasQgA */
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
                  on: {
                    PLAYING: "Playing",
                  },

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
      },
      guards: {
        "iframeAPI loaded": (context, event) => {
          return window.iframeApiReady || false;
        },
      },
    }
  );
