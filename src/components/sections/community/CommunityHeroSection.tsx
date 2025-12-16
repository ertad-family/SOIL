'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { NewsletterWidget } from '@/components/ui/newsletter-widget'
import { ArrowRight } from 'lucide-react'
import {
  Landmark,
  FlaskConical,
  Shield,
  Wrench,
  Heart,
  HandHelping,
} from 'lucide-react'

// Role definitions with descriptions
const roles = [
  {
    id: 'researchers',
    label: 'RESEARCHERS',
    title: 'Researchers',
    description: 'Access unique datasets, collaborate on publications, and advance organizational science.',
    color: 'rgba(147,112,219,1)', // purple
    colorBg: 'rgba(147,112,219,0.15)',
    colorStroke: 'rgba(147,112,219,0.5)',
    icon: FlaskConical,
    anchor: '#researchers',
  },
  {
    id: 'keepers',
    label: 'KEEPERS',
    title: 'Keepers',
    description: 'Lead regional communities, organize events, and build the local ecosystem.',
    color: 'rgba(100,180,130,1)', // green
    colorBg: 'rgba(100,180,130,0.15)',
    colorStroke: 'rgba(100,180,130,0.5)',
    icon: Shield,
    anchor: '#keepers',
  },
  {
    id: 'contributors',
    label: 'CONTRIBUTORS',
    title: 'Contributors',
    description: 'Develop the platform, design interfaces, translate content, or support the community.',
    color: 'rgba(230,126,90,1)', // orange
    colorBg: 'rgba(230,126,90,0.15)',
    colorStroke: 'rgba(230,126,90,0.5)',
    icon: Wrench,
    anchor: '#contributors',
  },
  {
    id: 'givers',
    label: 'GIVERS',
    title: 'Givers',
    description: 'Support platform development with donations, investments, or feature sponsorships.',
    color: 'rgba(180,160,120,1)', // marble/tan
    colorBg: 'rgba(180,160,120,0.15)',
    colorStroke: 'rgba(180,160,120,0.5)',
    icon: Heart,
    anchor: '#givers',
  },
  {
    id: 'volunteers',
    label: 'VOLUNTEERS',
    title: 'Volunteers',
    description: 'Contribute time as content reviewers, event organizers, or community moderators.',
    color: 'rgba(59,130,246,1)', // blue
    colorBg: 'rgba(59,130,246,0.15)',
    colorStroke: 'rgba(59,130,246,0.5)',
    icon: HandHelping,
    anchor: '#contribution',
  },
]

// Founders (center) data
const foundersRole = {
  id: 'founders',
  label: 'FOUNDERS',
  title: 'Founders',
  description: 'Share your story, preserve your legacy, and help others learn from your experience.',
  color: 'rgba(196,161,90,1)', // gold
  colorBg: 'rgba(196,161,90,0.15)',
  colorStroke: 'rgba(196,161,90,0.5)',
  icon: Landmark,
  anchor: '#founders',
}

// Pentagon positions (72 degrees apart, starting from top)
const pentagonRadius = 110
const centerX = 200
const centerY = 200

function getPentagonPosition(index: number) {
  const angle = (index * 72 - 90) * (Math.PI / 180) // Start from top (-90°)
  return {
    x: centerX + pentagonRadius * Math.cos(angle),
    y: centerY + pentagonRadius * Math.sin(angle),
  }
}

// Calculate tooltip position based on role position in the diagram
function getTooltipPosition(roleId: string, index: number): { top: number; left: number; side: 'left' | 'right' } {
  if (roleId === 'founders') {
    // Center - show to the right
    return { top: 50, left: 60, side: 'right' }
  }

  const pos = getPentagonPosition(index)
  // Convert SVG coordinates to percentages (SVG is 400x400)
  const topPercent = (pos.y / 400) * 100
  const leftPercent = (pos.x / 400) * 100

  // Determine if tooltip should be on left or right based on x position
  const side = pos.x > centerX ? 'right' : 'left'

  return { top: topPercent, left: leftPercent, side }
}

interface RoleNodeProps {
  role: typeof roles[0]
  position: { x: number; y: number }
  isCenter?: boolean
  onHover: (roleId: string | null) => void
  isHovered: boolean
}

function RoleNode({ role, position, isCenter, onHover, isHovered }: RoleNodeProps) {
  const nodeRadius = isCenter ? 35 : 24
  const innerRadius = isCenter ? 12 : 8

  const handleClick = () => {
    window.location.href = role.anchor
  }

  return (
    <g
      className="cursor-pointer transition-transform duration-200"
      style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)', transformOrigin: `${position.x}px ${position.y}px` }}
      onMouseEnter={() => onHover(role.id)}
      onClick={handleClick}
    >
      {/* Outer glow on hover */}
      {isHovered && (
        <circle
          cx={position.x}
          cy={position.y}
          r={nodeRadius + 8}
          fill={role.colorBg}
          className="animate-pulse"
        />
      )}

      {/* Outer circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={nodeRadius}
        fill={role.colorBg}
        stroke={isHovered ? role.color : role.colorStroke}
        strokeWidth={isHovered ? 3 : 2}
      />

      {/* Inner circle */}
      <circle
        cx={position.x}
        cy={position.y}
        r={innerRadius}
        fill={isHovered ? role.color : role.colorStroke}
      />

      {/* Label - but NOT for center (Founders) */}
      {!isCenter && (
        <text
          x={position.x}
          y={position.y + nodeRadius + 14}
          textAnchor="middle"
          fill={isHovered ? role.color : `${role.color.replace(',1)', ',0.7)')}`}
          fontSize={9}
          fontFamily="system-ui"
          fontWeight={isHovered ? 600 : 400}
        >
          {role.label}
        </text>
      )}
    </g>
  )
}

function CommunityNetworkDiagram({ onHover, hoveredRole }: { onHover: (roleId: string | null) => void; hoveredRole: string | null }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-[480px] h-[480px] md:w-[600px] md:h-[600px]"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer orbital rings */}
      {[0, 1, 2].map((i) => (
        <circle
          key={`orbit-${i}`}
          cx={centerX}
          cy={centerY}
          r={70 + i * 50}
          fill="none"
          stroke={`rgba(196,161,90,${0.12 - i * 0.03})`}
          strokeWidth="1"
          strokeDasharray={i % 2 === 0 ? 'none' : '4 4'}
        />
      ))}

      {/* Pentagon outline */}
      <polygon
        points={roles.map((_, i) => {
          const pos = getPentagonPosition(i)
          return `${pos.x},${pos.y}`
        }).join(' ')}
        fill="none"
        stroke="rgba(196,161,90,0.15)"
        strokeWidth="1"
      />

      {/* Connection lines from center to each role */}
      {roles.map((role, i) => {
        const pos = getPentagonPosition(i)
        const isHovered = hoveredRole === role.id || hoveredRole === 'founders'
        return (
          <line
            key={`line-${role.id}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke={isHovered ? role.colorStroke : 'rgba(196,161,90,0.2)'}
            strokeWidth={isHovered ? 2 : 1}
            className="transition-all duration-200"
          />
        )
      })}

      {/* Role nodes on pentagon vertices */}
      {roles.map((role, i) => {
        const pos = getPentagonPosition(i)
        return (
          <RoleNode
            key={role.id}
            role={role}
            position={pos}
            onHover={onHover}
            isHovered={hoveredRole === role.id}
          />
        )
      })}

      {/* Founders at center */}
      <RoleNode
        role={foundersRole}
        position={{ x: centerX, y: centerY }}
        isCenter
        onHover={onHover}
        isHovered={hoveredRole === 'founders'}
      />

      {/* Floating particles */}
      {[
        { cx: 80, cy: 80, r: 2 },
        { cx: 320, cy: 90, r: 1.5 },
        { cx: 350, cy: 200, r: 2 },
        { cx: 310, cy: 320, r: 1.5 },
        { cx: 90, cy: 310, r: 2 },
        { cx: 50, cy: 180, r: 1.5 },
      ].map((p, i) => (
        <circle key={`particle-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(196,161,90,0.4)" />
      ))}
    </svg>
  )
}

// Tooltip card component - positioned next to the role node
function RoleTooltip({
  role,
  roleIndex,
  onMouseEnter,
  onMouseLeave,
}: {
  role: typeof roles[0] | typeof foundersRole
  roleIndex: number
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const Icon = role.icon
  const tooltipPos = getTooltipPosition(role.id, roleIndex)

  // Calculate position offsets based on which side the tooltip should appear
  const offsetX = tooltipPos.side === 'right' ? 30 : -280 // Card width ~250px + gap
  const offsetY = -80 // Center the card vertically relative to the node

  return (
    <div
      className="absolute z-20 pointer-events-auto"
      style={{
        top: `${tooltipPos.top}%`,
        left: `${tooltipPos.left}%`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card
        variant="dark"
        padding="md"
        className="w-56 shadow-xl animate-fade-in-up"
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gold-400" />
            </div>
            <CardTitle variant="dark" className="text-base">
              {role.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            {role.description}
          </p>
          <a href={role.anchor}>
            <Button
              variant="dark-secondary"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-3 h-3" />}
            >
              Learn More
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}

export function CommunityHeroSection() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const [isTooltipHovered, setIsTooltipHovered] = useState(false)

  // Find hovered role data and index
  const hoveredRoleIndex = roles.findIndex(r => r.id === hoveredRole)
  const hoveredRoleData = hoveredRole === 'founders'
    ? foundersRole
    : roles.find(r => r.id === hoveredRole)

  // Only hide tooltip if neither the node nor the tooltip is hovered
  const handleNodeHover = (roleId: string | null) => {
    if (roleId) {
      setHoveredRole(roleId)
    } else if (!isTooltipHovered) {
      setHoveredRole(null)
    }
  }

  const handleTooltipMouseEnter = () => {
    setIsTooltipHovered(true)
  }

  const handleTooltipMouseLeave = () => {
    setIsTooltipHovered(false)
    setHoveredRole(null)
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Content - 1/3 width */}
          <div className="flex flex-col animate-fade-in-up lg:w-1/3">
            {/* Text content with left padding */}
            <div className="flex-1 pl-4 lg:pl-8">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide mb-6 text-marble-100 leading-tight">
                Join the{' '}
                <span className="text-gradient-gold">Community</span>
              </h1>
              <p className="text-base lg:text-lg text-slate-400 mb-4 leading-relaxed">
                A global network transforming organizational failure into collective wisdom.
              </p>
              <p className="text-base lg:text-lg text-slate-400 mb-8 leading-relaxed">
                Founders are at the heart of everything we do. Around them, a community of
                researchers, keepers, contributors, givers, and volunteers works together
                to preserve and share organizational wisdom.
              </p>

              {/* CTA Button */}
              <a href="#contribution">
                <Button
                  variant="dark-primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Find Your Role
                </Button>
              </a>
            </div>

            {/* Newsletter subscription */}
            <NewsletterWidget variant="compact" className="mt-8" />
          </div>

          {/* Right: Interactive Diagram - 2/3 width */}
          <div className="animate-fade-in-up stagger-1 lg:w-2/3">
            <Card variant="dark-elevated" padding="none" className="h-full relative overflow-visible flex items-center justify-center p-8">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" />

              {/* Network Diagram with tooltips */}
              <div
                className="relative"
                onMouseLeave={() => {
                  if (!isTooltipHovered) {
                    setHoveredRole(null)
                  }
                }}
              >
                <CommunityNetworkDiagram onHover={handleNodeHover} hoveredRole={hoveredRole} />

                {/* Tooltip positioned next to the role */}
                {hoveredRoleData && (
                  <RoleTooltip
                    role={hoveredRoleData}
                    roleIndex={hoveredRoleIndex}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                  />
                )}
              </div>

              {/* Floating label */}
              <div className="absolute bottom-6 right-6 text-xs text-gold-400/60 font-mono">
                HOVER TO EXPLORE
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="divider-roman mt-16 md:mt-20 animate-fade-in-up stagger-2">
        <span className="text-gold-400 font-serif text-sm tracking-[0.3em] px-6">MMXXV</span>
      </div>
    </section>
  )
}
