import { useState } from "react";

export default function HelleReact({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  const [showAge, setShowAge] = useState(false);

  return (
    <div>
      <h1>Hello {name}</h1>
      <button
        onClick={() => {
          console.log("Button clicked");
          setShowAge(!showAge);
        }}
      >
        {showAge ? "Hide" : "Show"} Age
      </button>
      {showAge && <h2>Age: {age}</h2>}
    </div>
  );
}
