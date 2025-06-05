import { Brain, Zap, Shield, Users, FileText, Search, Palette, Focus, BarChart3, Layout, Code, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'

export default function Features() {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Writing',
      description: 'Advanced AI assistance for writing, editing, and content generation with intelligent suggestions.',
      features: ['Smart auto-completion', 'Content suggestions', 'Grammar checking', 'Style improvements'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description: 'Instant search, real-time sync, and blazing-fast performance optimized for productivity.',
      features: ['Sub-second search', 'Real-time sync', 'Offline access', 'Fast loading'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      description: 'Bank-level security with complete privacy protection for your sensitive information.',
      features: ['AES-256 encryption', 'Zero-knowledge storage', 'Secure sync', 'Privacy first'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless real-time collaboration with advanced permission controls and team management.',
      features: ['Real-time editing', 'Team workspaces', 'Permission controls', 'Comment system'],
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const readyFeatures = [
    { icon: FileText, title: 'Rich Text Editor', description: 'Advanced Tiptap editor with markdown support and rich formatting' },
    { icon: Palette, title: 'Custom Themes', description: 'Dark/light themes with customizable color schemes' },
    { icon: Focus, title: 'Focus Mode', description: 'Distraction-free writing environment with centered layout' },
    { icon: Search, title: 'Universal Search', description: 'Find anything instantly across all your notes and documents' },
    { icon: BarChart3, title: 'Word Count & Stats', description: 'Real-time word count, character count, and writing statistics' },
    { icon: Layout, title: 'Template System', description: 'Pre-built templates for different types of notes and documents' }
  ]

  const techStack = [
    { icon: Code, title: 'React 19', description: 'Modern React with latest features and optimizations', color: 'from-blue-500 to-cyan-500' },
    { icon: FileText, title: 'Tiptap Editor', description: 'Advanced rich text editor with extensible architecture', color: 'from-purple-500 to-pink-500' },
    { icon: Lock, title: 'End-to-End Encryption', description: 'Military-grade security for all your data', color: 'from-green-500 to-emerald-500' }
  ]

  return (
    <section id="features" className="relative py-20 bg-gray-900/50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-6">
            Built for modern
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              productivity workflows
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300 leading-relaxed">
            Every feature in ONAI is designed and built to enhance your productivity. 
            No bloat, no unnecessary complexity - just powerful tools that work.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-8 hover:bg-gray-800/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mr-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Live
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 mr-2"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ready to use section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to use today</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All these features are already built and working in the ONAI application
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {readyFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6 hover:bg-gray-800/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gray-700/50 text-gray-300 mr-3">
                  <feature.icon className="h-5 w-5" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  Live
                </Badge>
              </div>
              <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Technology stack */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Built with modern technology</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ONAI is built using cutting-edge technologies for maximum performance and reliability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${tech.color} text-white mb-4`}>
                <tech.icon className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{tech.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

