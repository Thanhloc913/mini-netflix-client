import { useState } from 'react';
import { Settings, Check } from 'lucide-react';
import type { VideoAsset } from '@/apis/movies';

interface QualitySelectorProps {
  videoAssets: VideoAsset[];
  selectedAsset: VideoAsset | null;
  onQualityChange: (asset: VideoAsset) => void;
  className?: string;
}

export function QualitySelector({ videoAssets, selectedAsset, onQualityChange, className = '' }: QualitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Chỉ hiển thị 3 chất lượng chính và sắp xếp từ cao xuống thấp
  const allowedQualities = ['1080p', '720p', '480p'];
  const filteredAssets = videoAssets.filter(asset => 
    allowedQualities.includes(asset.resolution)
  );
  
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const resA = parseInt(a.resolution.replace('p', ''));
    const resB = parseInt(b.resolution.replace('p', ''));
    return resB - resA;
  });

  const handleQualitySelect = (asset: VideoAsset) => {
    onQualityChange(asset);
    setIsOpen(false);
  };

  if (!videoAssets || sortedAssets.length <= 1) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Quality Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-2 rounded transition-all"
        title="Chọn chất lượng"
      >
        <Settings size={16} />
        <span className="text-sm font-medium">
          {selectedAsset?.resolution || 'Auto'}
        </span>
      </button>

      {/* Quality Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 backdrop-blur-sm rounded-lg overflow-hidden z-50 min-w-[120px]">
            <div className="p-2">
              <div className="text-white text-xs font-medium mb-2 px-2">
                Chất lượng
              </div>
              
              {sortedAssets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleQualitySelect(asset)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all
                      ${isSelected 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <span>{asset.resolution}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}


            </div>
          </div>
        </>
      )}
    </div>
  );
}