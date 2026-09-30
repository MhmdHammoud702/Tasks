import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

function VideoPlayer() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [levels, setLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [currentQuality, setCurrentQuality] = useState("Auto");

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const videoUrl =
      "https://dmkgokp5mj4ef.cloudfront.net/stereo/master.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 300,
        maxMaxBufferLength: 300,
        maxBufferSize: 500 * 1024 * 1024,
      });

      hlsRef.current = hls;

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS MANIFEST PARSED");
        console.log("Available qualities:", hls.levels);

        setLevels(hls.levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];

        if (level) {
          const quality = `${level.height}p`;

          setCurrentQuality(quality);

          console.log("Quality changed to:", quality);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS ERROR:", data);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    }
  }, []);

  const handleQualityChange = (event) => {
    const value = Number(event.target.value);

    setSelectedQuality(value);

    const hls = hlsRef.current;

    if (!hls) return;

    if (value === -1) {
      // Auto quality
      hls.currentLevel = -1;
      console.log("Quality mode: Auto");
      return;
    }

    // Manual quality
    hls.currentLevel = value;

    const level = hls.levels[value];

    if (level) {
      console.log("Manual quality:", `${level.height}p`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl bg-slate-950 shadow-2xl">
      {/* Video */}
      <div className="w-full bg-black">
        <video
          ref={videoRef}
          controls
          autoPlay
          crossOrigin="anonymous"
          className="block h-auto w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 bg-black px-4 py-3">
        
        <div className="text-sm text-slate-300">
          Quality:
          <span className="ml-2 font-semibold text-white">
            {currentQuality}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="quality"
            className="text-sm font-medium text-slate-300"
          >
            Quality
          </label>

          <select
            id="quality"
            value={selectedQuality}
            onChange={handleQualityChange}
            disabled={levels.length === 0}
            className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-medium text-white outline-none transition hover:bg-slate-700 focus:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={-1}>Auto</option>

            {levels.map((level, index) => (
              <option key={index} value={index}>
                {level.height}p
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
