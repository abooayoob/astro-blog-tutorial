import { createMachine, assign } from "xstate";

export const simpleMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwJYFsAOAbMA6AkhDgMTYCGAngNoAMAuoqBgPaoAuKzAdoyAB6IATAHYAjLhrDBggMwBOABxyaAVgAsAGhAUhagGy41ClaIU0Fa4eZXC9AXztbUmHLgAKWSii5RSZAK6wYLQMSCAs7Jw8YQIIgnpqErbCiioJcnqCWjoIUrh6MoJG8mpyomqlwg5O6Nh4bgFBEKSe1PS8ESgc3LyxegZitkomCgnCMnrZiArihYJlMqXG5YUOjiBczBBwvM51HaxdUb2IALRKuHKCNgoy45KFcjJTCOeJesZ6wvpP6lL26z2rkIOAOkR6MTOanEVxudxkD3mz200xol2UCgU0hUdzKWOqICB9Va3igYKOENAsXis2+ikENFKNA+yJyohkMlwMwKCmEo0ESkxBKJ7kakHJ3WiVKEejRT15WNGwlsZRegnyd1kmMZGSsJjWdiAA */
    id: "simple",
    context: {
      playedTimes: 0,
    },
    states: {
      Idle: {
        on: {
          play: "Playing",
        },
      },
      Playing: {
        on: {
          pause: "Paused",
        },

        entry: "increment playedTimes",
      },
      Paused: {
        on: {
          play: "Playing",
        },
      },
    },

    initial: "Idle",
  },
  {
    actions: {
      "increment playedTimes": assign({
        playedTimes: (context) => context.playedTimes + 1,
      }),
    },
  }
);
