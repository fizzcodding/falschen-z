import { useEffect, useState } from "react";

/**
 * Terminal style typewriter: types a word, holds, deletes, moves to the next.
 */
export function Typewriter({
  words,
  className = "",
  typeSpeed = 70,
  deleteSpeed = 40,
  hold = 1400,
}: {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  hold?: number;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];

    if (!deleting && text === word) {
      const t = window.setTimeout(() => setDeleting(true), hold);
      return () => window.clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = window.setTimeout(
      () =>
        setText(
          deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1),
        ),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => window.clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, hold]);

  return (
    <span className={className}>
      {text}
      <span className="caret-blink" aria-hidden="true">
        _
      </span>
    </span>
  );
}
