"use client"
import { User } from "lucide-react"

interface GenderSelectorProps {
  onSelect: (gender: "male" | "female" | "any") => void
}

export default function GenderSelector({ onSelect }: GenderSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl shadow-primary/20 dark:shadow-primary/10 p-8 max-w-md w-full mx-4 animate-in fade-in scale-in duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">Find Your Match</h2>
          <p className="text-muted-foreground">Who would you like to connect with?</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => onSelect("male")}
            className="w-full px-6 py-4 rounded-2xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold">♂</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground">Boys</p>
              <p className="text-xs text-muted-foreground">Connect with boys</p>
            </div>
          </button>

          <button
            onClick={() => onSelect("female")}
            className="w-full px-6 py-4 rounded-2xl border-2 border-accent/30 hover:border-accent hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-300 flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold">♀</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground">Girls</p>
              <p className="text-xs text-muted-foreground">Connect with girls</p>
            </div>
          </button>

          <button
            onClick={() => onSelect("any")}
            className="w-full px-6 py-4 rounded-2xl border-2 border-purple-300/30 hover:border-purple-500 hover:bg-purple-500/5 dark:hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground">Anyone</p>
              <p className="text-xs text-muted-foreground">Connect with anyone</p>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You can change this preference at any time in the settings.
        </p>
      </div>
    </div>
  )
}
