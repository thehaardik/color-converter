'use client';

import { useState, useEffect } from 'react';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function Home() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  useEffect(() => {
    const rgbResult = hexToRgb(hex);
    if (rgbResult) {
      setRgb(rgbResult);
      setHsl(rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b));
    }
  }, [hex]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Color Converter</h1>
          <p className="text-xl text-gray-600">Convert colors between HEX, RGB, and HSL</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32 rounded-lg border-2 border-slate-200" style={{ backgroundColor: hex }} />
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">HEX</label>
              <input type="text" className="w-full p-3 border rounded-lg font-mono" value={hex} onChange={(e) => setHex(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">RGB</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">R</div>
                  <div className="font-mono font-bold">{rgb.r}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">G</div>
                  <div className="font-mono font-bold">{rgb.g}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">B</div>
                  <div className="font-mono font-bold">{rgb.b}</div>
                </div>
              </div>
              <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm text-center">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">HSL</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">H</div>
                  <div className="font-mono font-bold">{hsl.h}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">S</div>
                  <div className="font-mono font-bold">{hsl.s}%</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">L</div>
                  <div className="font-mono font-bold">{hsl.l}%</div>
                </div>
              </div>
              <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm text-center">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((opacity) => (
              <div key={opacity} className="p-2 rounded text-center text-xs font-mono" style={{ backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`, color: opacity > 0.5 ? 'white' : 'black' }}>
                {Math.round(opacity * 100)}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
