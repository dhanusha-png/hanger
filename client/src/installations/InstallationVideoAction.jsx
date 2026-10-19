import React, { useState } from 'react';
import { Play, X, Compass, Wrench, CheckCircle } from 'lucide-react';

export function InstallationVideoAction() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="section container install-section">
      <div className="install-split-action">
        <div className="install-video-card">
          <video
            className="install-video-bg"
            poster="/media/hanger-3.jpg"
            muted
            loop
            playsInline
            autoPlay
          >
            <source src="/media/hanger-demo.mp4" type="video/mp4" />
          </video>

          <div className="install-video-content">
            <h3>See HangerHome in action</h3>
            <p>Watch a real installation and see how we transform everyday spaces.</p>
          </div>

          <button
            type="button"
            className="install-play-fab"
            onClick={() => setIsPlaying(true)}
            aria-label="Play installation demonstration video"
            title="Play installation demonstration video"
          >
            <Play size={26} fill="#09251F" />
          </button>

          <div className="install-video-cta">
            <button
              type="button"
              className="install-watch-btn"
              onClick={() => setIsPlaying(true)}
            >
              <Play size={15} fill="#fff" /> Watch Installation Video
            </button>
          </div>
        </div>

        <div className="install-designed-card">
          <h3>Designed Around Your Space</h3>
          <p>
            Every installation starts with understanding the available space, the required setup and the type of hanger solution.
          </p>

          <div className="install-design-pillars">
            <div className="install-pillar-item">
              <div className="install-pillar-icon">
                <Compass size={18} />
              </div>
              <b>Space Planning</b>
              <small>Understand the available area and ceiling height.</small>
            </div>

            <div className="install-pillar-item">
              <div className="install-pillar-icon">
                <Wrench size={18} />
              </div>
              <b>Professional Setup</b>
              <small>Install the selected solution securely and cleanly.</small>
            </div>

            <div className="install-pillar-item">
              <div className="install-pillar-icon">
                <CheckCircle size={18} />
              </div>
              <b>Clean Finish</b>
              <small>Designed to seamlessly integrate with your home.</small>
            </div>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="install-lightbox" onClick={() => setIsPlaying(false)}>
          <button className="install-lightbox-close" onClick={() => setIsPlaying(false)} aria-label="Close video">
            <X size={20} />
          </button>
          <div style={{ maxWidth: '850px', width: '100%', borderRadius: '16px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <video controls autoPlay style={{ width: '100%', display: 'block' }}>
              <source src="/media/hanger-demo.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
