"use client";
import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

type Mode = "url" | "whatsapp" | "wifi";
type Size = "small" | "medium" | "large";
type WifiEnc = "WPA" | "WEP" | "None";

const sizePx: Record<Size, number> = {
  small: 128,
  medium: 256,
  large: 384,
};

export default function QRGeneratorClient() {
  const [mode, setMode] = useState<Mode>("url");
  const [size, setSize] = useState<Size>("medium");
  const [text, setText] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEnc, setWifiEnc] = useState<WifiEnc>("WPA");
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(() => {
    if (mode === "url") {
      return text.trim();
    }
    if (mode === "whatsapp") {
      const digits = waPhone.replace(/\D/g, "");
      const link = `https://wa.me/${digits}?text=${encodeURIComponent(waMsg)}`;
      return link;
    }
    const enc = wifiEnc === "None" ? "nopass" : wifiEnc;
    const wifiPayload = `WIFI:T:${enc};S:${ssid};P:${wifiPass};;`;
    return wifiPayload;
  }, [mode, text, waPhone, waMsg, ssid, wifiPass, wifiEnc]);

  const onDownload = () => {
    const canvas = previewRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.png";
    a.click();
  };

  const onCopyLink = async () => {
    if (mode !== "whatsapp") return;
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Type:</span>
            <div className="flex gap-2">
              <button
                className={`px-3 py-2 rounded-lg border text-sm ${mode === "url" ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 dark:border-neutral-700"}`}
                onClick={() => setMode("url")}
              >
                URL/Text
              </button>
              <button
                className={`px-3 py-2 rounded-lg border text-sm ${mode === "whatsapp" ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 dark:border-neutral-700"}`}
                onClick={() => setMode("whatsapp")}
              >
                WhatsApp
              </button>
              <button
                className={`px-3 py-2 rounded-lg border text-sm ${mode === "wifi" ? "bg-blue-600 text-white border-blue-600" : "border-neutral-300 dark:border-neutral-700"}`}
                onClick={() => setMode("wifi")}
              >
                WiFi
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Size:</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as Size)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        {mode === "url" && (
          <div className="mt-4">
            <label className="block text-sm font-medium">Text / URL</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or a URL"
              className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {mode === "whatsapp" && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Phone (with country code)</label>
              <input
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                placeholder="e.g., 919876543210"
                className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Message</label>
              <input
                value={waMsg}
                onChange={(e) => setWaMsg(e.target.value)}
                placeholder="Hello!"
                className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {mode === "wifi" && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">SSID</label>
              <input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Network name"
                className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Network password"
                className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Encryption</label>
              <select
                value={wifiEnc}
                onChange={(e) => setWifiEnc(e.target.value as WifiEnc)}
                className="mt-2 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="WPA">WPA</option>
                <option value="WEP">WEP</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDownload}
            className="rounded-lg bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700"
          >
            Download PNG
          </button>
          {mode === "whatsapp" && (
            <button
              onClick={onCopyLink}
              className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-5 py-3 font-medium"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Live QR Preview</h2>
        <div ref={previewRef} className="mt-4 flex items-center justify-center">
          <QRCodeCanvas value={data || " "} size={sizePx[size]} includeMargin />
        </div>
      </div>
    </div>
  );
}
