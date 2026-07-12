'use client';

import { useState, useRef, useEffect } from 'react';

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

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'picker' | 'image'>('picker');
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [image, setImage] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rgbResult = hexToRgb(hex);
    if (rgbResult) {
      setRgb(rgbResult);
      setHsl(rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b));
    }
  }, [hex]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(event.target?.result as string);
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setPickedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    setHex(rgbToHex(pixel[0], pixel[1], pixel[2]));
    setIsPicking(false);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPicking) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setPickedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Color Converter</h1>
          <p className="text-xl text-gray-600">Convert colors between HEX, RGB, and HSL — or pick from an image</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${activeTab === 'picker' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            Color Picker
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${activeTab === 'image' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            Image Color Picker
          </button>
        </div>

        {/* Color Picker Tab */}
        {activeTab === 'picker' && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-lg border-2 border-slate-200 shadow-inner" style={{ backgroundColor: hex }} />
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">HEX</label>
                <input type="text" className="w-full p-3 border rounded-lg font-mono text-lg" value={hex} onChange={(e) => setHex(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">R</label>
                <input type="number" min="0" max="255" className="w-full p-3 border rounded font-mono" value={rgb.r} onChange={(e) => { const v = parseInt(e.target.value) || 0; setRgb({ ...rgb, r: v }); setHex(rgbToHex(v, rgb.g, rgb.b)); }} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">G</label>
                <input type="number" min="0" max="255" className="w-full p-3 border rounded font-mono" value={rgb.g} onChange={(e) => { const v = parseInt(e.target.value) || 0; setRgb({ ...rgb, g: v }); setHex(rgbToHex(rgb.r, v, rgb.b)); }} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">B</label>
                <input type="number" min="0" max="255" className="w-full p-3 border rounded font-mono" value={rgb.b} onChange={(e) => { const v = parseInt(e.target.value) || 0; setRgb({ ...rgb, b: v }); setHex(rgbToHex(rgb.r, rgb.g, v)); }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                <div className="text-xs text-slate-400 mb-1">RGB</div>
                <div>rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                <div className="text-xs text-slate-400 mb-1">HSL</div>
                <div>hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
              </div>
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                <div className="text-xs text-slate-400 mb-1">HEX</div>
                <div>{hex}</div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[0.1, 0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.95, 0.98, 1].map((opacity) => (
                <div key={opacity} className="p-2 rounded-lg text-center text-xs font-mono" style={{ backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`, color: opacity > 0.5 ? 'white' : 'black' }}>
                  {Math.round(opacity * 100)}%
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Picker Tab */}
        {activeTab === 'image' && (
          <div className="bg-white rounded-lg border p-6">
            {!image ? (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-16 text-center hover:border-blue-400 transition-colors">
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">Upload an image to pick colors</p>
                <p className="text-sm text-gray-400 mb-6">Supports JPG, PNG, GIF, WebP</p>
                <label className="inline-block">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 font-medium">Choose Image</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Click anywhere on the image to pick a color</h3>
                  {pickedColor && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border-2 border-slate-200" style={{ backgroundColor: rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b) }} />
                      <span className="font-mono text-lg font-bold">{rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b)}</span>
                    </div>
                  )}
                </div>

                <canvas
                  ref={canvasRef}
                  className="w-full rounded-lg border cursor-crosshair"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                />

                {pickedColor && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                      <div className="text-xs text-slate-400 mb-1">RGB</div>
                      <div>rgb({pickedColor.r}, {pickedColor.g}, {pickedColor.b})</div>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                      <div className="text-xs text-slate-400 mb-1">HEX</div>
                      <div>{rgbToHex(pickedColor.r, pickedColor.g, pickedColor.b)}</div>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-center">
                      <div className="text-xs text-slate-400 mb-1">HSL</div>
                      <div>hsl({rgbToHsl(pickedColor.r, pickedColor.g, pickedColor.b).h}, {rgbToHsl(pickedColor.r, pickedColor.g, pickedColor.b).s}%, {rgbToHsl(pickedColor.r, pickedColor.g, pickedColor.b).l}%)</div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { setImage(null); setPickedColor(null); setIsPicking(false); }}
                  className="w-full py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
