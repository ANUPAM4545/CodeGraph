'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  ExternalLink, 
  X, 
  Maximize2 
} from 'lucide-react';
import { RepositoryAsset } from '../../lib/api/intelligence';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ScreenshotGalleryProps {
  assets: RepositoryAsset[];
}

export default function ScreenshotGallery({ assets }: ScreenshotGalleryProps) {
  const [selectedAsset, setSelectedAsset] = useState<RepositoryAsset | null>(null);

  if (!assets || assets.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="bg-white border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Visual Assets & Architecture Diagrams</span>
              </CardTitle>
              <p className="text-xs text-muted mt-0.5">
                Screenshots, flowcharts, and architecture diagrams discovered in repository documentation.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {assets.length} Media Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedAsset(asset)}
                className="group relative rounded-xl border border-border/80 bg-surface/40 hover:border-primary/50 overflow-hidden cursor-pointer transition-all shadow-2xs"
              >
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {asset.preview_url ? (
                    <img 
                      src={asset.preview_url} 
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted" />
                  )}
                </div>

                <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-border/60">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-foreground truncate block">{asset.filename}</span>
                    <span className="text-[10px] text-muted font-mono truncate block">{asset.repository_path}</span>
                  </div>
                  <div className="p-1 rounded bg-surface text-muted group-hover:text-primary transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Preview */}
      {selectedAsset && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-foreground block">{selectedAsset.filename}</span>
                <span className="text-xs text-muted font-mono">{selectedAsset.repository_path}</span>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="p-1.5 rounded-lg bg-surface text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-50 rounded-xl p-2 border border-border">
              <img 
                src={selectedAsset.preview_url || ''} 
                alt={selectedAsset.filename}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
