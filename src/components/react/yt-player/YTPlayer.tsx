import { useMachine } from "@xstate/react";
import { createYtPlayerMachine } from "./yt-player-machine";
import React from "react";

export function YTPlayer({
  videoId,
  start,
  end,
  description,
}: {
  videoId: string;
  start?: number;
  end?: number;
  description: string;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const outerGrid = React.useRef<HTMLDivElement>(null);
  const player = React.useRef<YT.Player | null>(null);

  const machineRef = React.useRef(
    createYtPlayerMachine({
      videoId,
      start,
      end,
      description,
    })
  );

  const [state, send, actor] = useMachine(machineRef.current, {
    actions: {
      "assign iframe rendered": (context) => {
        context.iframeRendered = true;
      },
      "play from start": (context, event) => {
        console.log("play from start", context.start);
        player.current?.seekTo(context.start, true);
        player.current?.playVideo();
      },
    },
  });

  actor.onTransition((state) => {
    console.log("state", state.event, state.toStrings());
  });

  function onPlayerReady() {
    send({ type: "ready" });
  }
  function onPlayerStateChange(event: YT.OnStateChangeEvent) {
    const nameMap = {
      [YT.PlayerState.BUFFERING]: "BUFFERING",
      [YT.PlayerState.CUED]: "CUED",
      [YT.PlayerState.UNSTARTED]: "UNSTARTED",
      [YT.PlayerState.PLAYING]: "PLAYING",
      [YT.PlayerState.PAUSED]: "PAUSED",
      [YT.PlayerState.ENDED]: "ENDED",
    } as const;
    send({ type: nameMap[event.data] });
  }
  function onPlayerError(event: YT.OnErrorEvent) {
    // console.log(YT.PlayerError.EmbeddingNotAllowed2);
    console.log("error", event);
    const nameMap = {
      [100]: "VideoNotFound",
      [101]: "EmbeddingNotAllowed",
      [5]: "Html5Error",
      [2]: "InvalidParam",
      [150]: "EmbeddingNotAllowed2",
    } as const;
    send({ type: nameMap[event.data] });
  }

  React.useEffect(() => {
    console.log("running iframe effect");
    if (iframeRef.current) {
      console.log("iframe effect");
      send({ type: "iframe rendered" });
    }
  }, [iframeRef.current]);

  React.useEffect(() => {
    if (state.context.iframeRendered) {
      player.current = new YT.Player(videoId, {
        playerVars: {
          playsinline: 1,
          modestbranding: 1,
          controls: 0,
          origin: "http://localhost:4321/",
          rel: 0,
          fs: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    }
  }, [state.context.iframeRendered]);

  return (
    <div className="yt-player">
      <div className="outer-grid" ref={outerGrid}>
        {state.context.embedString && (
          <iframe
            ref={iframeRef}
            src={state.context.embedString}
            id={videoId}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        )}

        {(state.matches("Player ready.Operations.Not playing.Initial") ||
          state.matches(
            "Player ready.Operations.Not playing.Video stopped.Paused"
          ) ||
          state.matches("Render Iframe") ||
          state.matches("Load player")) && (
          <div className="not-playing">
            <h2 className="middle">Play</h2>
          </div>
        )}

        {state.matches(
          "Player ready.Operations.Not playing.Video stopped.Ended"
        ) && (
          <div className="not-playing-blocking">
            <button
              className="middle"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                send({ type: "replay" });
              }}
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
