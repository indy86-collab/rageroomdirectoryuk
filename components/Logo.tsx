import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Icon - Professional Hammer with enhanced impact effect */}
      <div className="relative flex-shrink-0">
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
        >
          {/* Enhanced gradients and effects */}
          <defs>
            <linearGradient id="logoHammerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="logoShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4"/>
            </filter>
          </defs>
          
          {/* Background circle with depth */}
          <circle
            cx="26"
            cy="26"
            r="24"
            fill="url(#logoBgGrad)"
            className="group-hover:opacity-95 transition-opacity"
            filter="url(#logoShadow)"
          />
          <circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="url(#logoHammerGrad)"
            strokeWidth="2"
            opacity="0.5"
            className="group-hover:opacity-80 transition-opacity"
          />
          
          {/* Hammer icon group with filter */}
          <g filter="url(#logoGlow)">
            {/* Main hammer head - larger and more defined */}
            <rect
              x="13"
              y="16"
              width="22"
              height="12"
              rx="2.5"
              fill="url(#logoHammerGrad)"
              className="group-hover:brightness-110 transition-all"
            />
            
            {/* Hammer head highlight for 3D effect */}
            <rect
              x="15"
              y="18"
              width="18"
              height="8"
              rx="1.5"
              fill="#FF8C42"
              opacity="0.35"
            />
            
            {/* Hammer head shine - creates metallic look */}
            <rect
              x="15"
              y="18"
              width="9"
              height="8"
              rx="1.5"
              fill="white"
              opacity="0.25"
            />
            
            {/* Claw back of hammer - adds realism */}
            <path
              d="M13 22 L10 19 L10 25 L13 22 Z"
              fill="url(#logoHammerGrad)"
              opacity="0.85"
            />
            
            {/* Hammer handle - improved proportions */}
            <rect
              x="22"
              y="28"
              width="6"
              height="18"
              rx="3"
              fill="url(#logoHammerGrad)"
              className="group-hover:brightness-110 transition-all"
            />
            
            {/* Handle grip texture */}
            <line x1="23.5" y1="30" x2="23.5" y2="44" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            <line x1="25" y1="30" x2="25" y2="44" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            <line x1="26.5" y1="30" x2="26.5" y2="44" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
            
            {/* Handle end cap */}
            <ellipse cx="25" cy="46" rx="3" ry="1.5" fill="url(#logoHammerGrad)" opacity="0.7" />
          </g>
          
          {/* Enhanced impact effect - larger and more dynamic */}
          <g opacity="0.95">
            {/* Main impact spark */}
            <circle cx="8" cy="18" r="2.5" fill="#F97316" filter="url(#logoGlow)">
              <animate
                attributeName="opacity"
                values="0.9;1;0.9"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="2.5;3;2.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Secondary spark */}
            <circle cx="6" cy="23" r="2" fill="#FB923C" filter="url(#logoGlow)">
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="1.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="2;2.5;2"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Small spark */}
            <circle cx="4" cy="20" r="1.5" fill="#FDBA74" filter="url(#logoGlow)">
              <animate
                attributeName="opacity"
                values="0.7;0.95;0.7"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Impact lines - more prominent */}
            <line x1="7" y1="16" x2="4" y2="13" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="7" y1="21" x2="3" y2="26" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.9;0.6"
                dur="1.3s"
                repeatCount="indefinite"
              />
            </line>
            
            {/* Shatter effect on opposite side */}
            <line x1="35" y1="22" x2="39" y2="22" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
              <animate
                attributeName="opacity"
                values="0.5;0.8;0.5"
                dur="1.7s"
                repeatCount="indefinite"
              />
            </line>
            <line x1="35" y1="22" x2="38" y2="19" stroke="#FB923C" strokeWidth="1.2" strokeLinecap="round" opacity="0.4">
              <animate
                attributeName="opacity"
                values="0.4;0.7;0.4"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        </svg>
      </div>
      
      {/* Enhanced Text */}
      <div className="flex flex-col leading-tight">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:via-orange-300 group-hover:to-orange-400 transition-all duration-300">
            RageRoom
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase tracking-[0.25em] sm:tracking-[0.3em] mt-0.5 group-hover:text-gray-700 transition-colors">
          Directory
        </div>
      </div>
    </Link>
  )
}

