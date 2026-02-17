"use client";
import { useEffect, useMemo, useState } from "react";

export default function WordCounterClient() {
  const STORAGE_KEY = "unitools-word-counter";
  const [text, setText] = useState<string>(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, text);
    } catch {}
  }, [text]);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const minutesFloat = words / 200;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.round((minutesFloat - minutes) * 60);
    const reading =
      words === 0
        ? "0 min"
        : minutes > 0
        ? `~${minutes} min${seconds > 0 ? ` ${seconds} sec` : ""}`
        : `~${seconds} sec`;
    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      reading,
    };
  }, [text]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onClear = () => {
    setText("");
  };

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Start typing or paste text here..."
          className="w-full resize-y rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCopy}
            className="rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700"
          >
            {copied ? "Copied" : "Copy Text"}
          </button>
          <button
            onClick={onClear}
            className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
          >
            Clear Text
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Live Stats</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Words</div>
            <div className="text-xl font-bold">{stats.words}</div>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Characters</div>
            <div className="text-xl font-bold">{stats.charsWithSpaces}</div>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Characters (no spaces)</div>
            <div className="text-xl font-bold">{stats.charsNoSpaces}</div>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Sentences</div>
            <div className="text-xl font-bold">{stats.sentences}</div>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Paragraphs</div>
            <div className="text-xl font-bold">{stats.paragraphs}</div>
          </div>
          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="text-xs text-neutral-500">Reading time</div>
            <div className="text-xl font-bold">{stats.reading}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
