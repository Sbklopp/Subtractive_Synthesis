import { useEffect, useRef } from 'react';
import { audioController } from '../../audio/AudioController';
import './Oscilloscope.css';

export const Oscilloscope = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    let animationFrameId = 0;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      const pixelWidth = Math.floor(width * pixelRatio);
      const pixelHeight = Math.floor(height * pixelRatio);

      if (
        canvas.width !== pixelWidth ||
        canvas.height !== pixelHeight
      ) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0,
      );

      context.fillStyle = '#07120d';
      context.fillRect(0, 0, width, height);

      context.strokeStyle = '#173b2a';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      const waveform = audioController.getWaveformData();

      if (waveform && waveform.length > 0) {
        context.strokeStyle = '#55ff99';
        context.lineWidth = 2;
        context.beginPath();

        const sliceWidth = width / (waveform.length - 1);

        waveform.forEach((sample, index) => {
          const x = index * sliceWidth;
          const y = ((1 - sample) * height) / 2;

          if (index === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        });

        context.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="oscilloscope">
      <h3>Oscilloscope</h3>

      <canvas
        ref={canvasRef}
        className="oscilloscope__canvas"
      />
    </section>
  );
};