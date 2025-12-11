'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled (Three.js requires window)
const DodecahedronScene = dynamic(
  () => import('@/components/three/DodecahedronScene').then(mod => ({ default: mod.DodecahedronScene })),
  { ssr: false }
)

export default function Test3DPage() {
  return (
    <div className="w-screen h-screen bg-[#0a0a0f]">
      <DodecahedronScene className="w-full h-full" />

      {/* Info overlay */}
      <div className="absolute top-4 left-4 text-white font-mono text-sm bg-black/50 p-4 rounded">
        <h1 className="text-lg font-bold mb-2">Roman Dodecahedron Navigation</h1>
        <p className="text-gray-400">Phase 1: Basic Geometry Test</p>
        <ul className="mt-2 text-xs text-gray-500 space-y-1">
          <li>• Drag to rotate camera</li>
          <li>• Scroll to zoom</li>
          <li>• 12 faces with portal rings</li>
          <li>• 20 vertex spheres</li>
        </ul>
      </div>
    </div>
  )
}
