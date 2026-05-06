"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoPlayerProps {
  url: string;
  userEmail?: string;
}

export const VideoPlayer = ({ url, userEmail }: VideoPlayerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (!isClient) return <div className="aspect-video bg-black animate-pulse" />;

  return (
    <div className="relative aspect-video group">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              onContextMenu: (e: any) => e.preventDefault(),
            }
          }
        }}
      />
      
      {/* Dynamic Watermark */}
      {userEmail && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 select-none">
          <div className="absolute top-1/4 left-1/4 -rotate-12 text-white font-bold text-lg whitespace-nowrap">
            {userEmail}
          </div>
          <div className="absolute bottom-1/4 right-1/4 -rotate-12 text-white font-bold text-lg whitespace-nowrap">
            {userEmail}
          </div>
        </div>
      )}
    </div>
  );
};
