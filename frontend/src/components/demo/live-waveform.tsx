"use client";

import { useEffect, useRef } from "react";

import type { Track } from "livekit-client";

export function LiveWaveform({ track }: { track?: Track }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !track ||
      !("mediaStream" in track) ||
      !track.mediaStream ||
      !canvasRef.current
    ) {
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(track.mediaStream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let frame = 0;
    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(6,10,18,0.62)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#34F5A1";
      ctx.shadowColor = "#34F5A1";
      ctx.shadowBlur = 12;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i += 2) {
        const v = dataArray[i] / 128;
        const y = (v * canvas.height) / 2;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth * 2;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      audioContext.close();
    };
  }, [track]);

  return (
    <div className="surface-muted rounded-lg p-2">
      <canvas
        ref={canvasRef}
        width={820}
        height={130}
        className="h-32 w-full rounded-md"
      />
    </div>
  );
}
