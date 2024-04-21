import { simpleMachine } from "./simple-machine";
import { useMachine } from "@xstate/react";

export function SimpleMachine() {
  const [state, send] = useMachine(simpleMachine);

  return (
    <div>
      <h1>Simple Machine</h1>
      <h2>{state.toStrings()}</h2>
      <h3>Played Times: {state.context.playedTimes}</h3>

      {state.matches("Idle") && (
        <button onClick={() => send("play")}>Play</button>
      )}
      {state.matches("Playing") && (
        <button onClick={() => send("pause")}>Pause</button>
      )}
      {state.matches("Paused") && (
        <button onClick={() => send("play")}>Resume</button>
      )}
    </div>
  );
}
