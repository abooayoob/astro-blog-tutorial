/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  onYouTubeIframeAPIReady: () => void;
  iframeApiReady: boolean | undefined;
  YTPlayers: {
    [id: string]: YT.Player;
  };
}
