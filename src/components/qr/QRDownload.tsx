"use client";

import QRCode from "react-qr-code";
import { Button } from "@/components/ui/Button";
import { useRef, useState } from "react";

interface QRDownloadProps {
  tombId: string;
}

export function QRDownload({ tombId }: QRDownloadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const qrValue = `${appUrl}/tomb/${tombId}`;

  const downloadAsPng = async () => {
    setIsDownloading(true);
    try {
      const container = containerRef.current;
      if (!container) return;

      const svg = container.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const size = 512;
      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        const link = document.createElement("a");
        link.download = `qr-tomb-${tombId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setIsDownloading(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };

      img.src = url;
    } catch (error) {
      console.error("Failed to download QR code:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4">
      <QRCode value={qrValue} size={200} level="H" />
      <Button
        onClick={downloadAsPng}
        disabled={isDownloading}
        variant="primary"
      >
        {isDownloading ? "Downloading..." : "Download QR Code (PNG)"}
      </Button>
      <p className="text-xs text-gray-500">{qrValue}</p>
    </div>
  );
}
