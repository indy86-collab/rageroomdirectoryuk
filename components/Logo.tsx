import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Icon - Enhanced Hammer with impact effect */}
      <div className="relative flex-shrink-0">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
        >
          {/* Glow effect */}
          <defs>
            <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="1" />
              <stop offset="50%" stopColor="#FB923C" stopOpacity="1" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle with gradient border */}
          <circle
            cx="24"
            cy="24"
            r="21"
            fill="url(#hammerGradient)"
            opacity="0.1"
            className="group-hover:opacity-20 transition-opacity"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="#1a1a1a"
            stroke="url(#hammerGradient)"
            strokeWidth="2"
            className="group-hover:stroke-orange-400 transition-colors"
            filter="url(#glow)"
          />
          
          {/* Hammer head with gradient */}
          <rect
            x="11"
            y="15"
            width="20"
            height="11"
            rx="2.5"
            fill="url(#hammerGradient)"
            className="group-hover:opacity-90 transition-opacity"
            filter="url(#glow)"
          />
          
          {/* Hammer head highlight */}
          <rect
            x="13"
            y="17"
            width="16"
            height="7"
            rx="1.5"
            fill="#FF8C42"
            opacity="0.4"
          />
          
          {/* Hammer head shine */}
          <rect
            x="13"
            y="17"
            width="8"
            height="7"
            rx="1.5"
            fill="white"
            opacity="0.2"
          />
          
          {/* Hammer handle with gradient */}
          <rect
            x="21.5"
            y="26"
            width="5"
            height="16"
            rx="2.5"
            fill="url(#hammerGradient)"
            className="group-hover:opacity-90 transition-opacity"
          />
          
          {/* Handle grip lines */}
          <line x1="23" y1="28" x2="23" y2="38" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.3" />
          <line x1="25" y1="28" x2="25" y2="38" stroke="#1a1a1a" strokeWidth="0.5" opacity="0.3" />
          
          {/* Impact sparks - enhanced */}
          <circle cx="9" cy="17" r="2" fill="#F97316" opacity="0.9" filter="url(#glow)">
            <animate
              attributeName="opacity"
              values="0.9;1;0.9"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="7" cy="21" r="1.5" fill="#FB923C" opacity="0.7" filter="url(#glow)">
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="1.5;2;1.5"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="5" cy="19" r="1" fill="#FDBA74" opacity="0.6" filter="url(#glow)">
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Impact lines */}
          <line x1="8" y1="15" x2="6" y2="13" stroke="#F97316" strokeWidth="1.5" opacity="0.6" strokeLinecap="round">
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="8" y1="19" x2="5" y2="22" stroke="#FB923C" strokeWidth="1" opacity="0.5" strokeLinecap="round">
            <animate
              attributeName="opacity"
              values="0.5;0.8;0.5"
              dur="1.3s"
              repeatCount="indefinite"
            />
          </line>
        </svg>
      </div>
      
      {/* Enhanced Text */}
      <div className="flex flex-col leading-tight">
        <div className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:via-orange-300 group-hover:to-orange-400 transition-all duration-300">
            RageRoom
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-[0.25em] sm:tracking-[0.3em] mt-0.5 group-hover:text-zinc-300 transition-colors">
          Directory
        </div>
      </div>
    </Link>
  )
}

