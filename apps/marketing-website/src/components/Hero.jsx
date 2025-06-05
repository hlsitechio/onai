import { Link } from 'react-router-dom'
import { ArrowRight, Play, CheckCircle, Users, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <Users className="h-4 w-4 mr-2" />
            Trusted by 50,000+ professionals worldwide
          </div>

          {/* Main headline */}
          <h1 className="text-4xl font-bold text-white sm:text-6xl lg:text-7xl mb-6">
            Your AI-Powered
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-xl text-gray-300 leading-relaxed mb-8">
            Transform your thoughts into organized knowledge with AI-powered note-taking. 
            Capture, connect, and collaborate on ideas that matter. Experience the future of productivity.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center text-gray-300">
              <Zap className="h-5 w-5 text-blue-400 mr-2" />
              <span>AI-Powered Intelligence</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Zap className="h-5 w-5 text-purple-400 mr-2" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Shield className="h-5 w-5 text-cyan-400 mr-2" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="h-5 w-5 text-green-400 mr-2" />
              <span>Team Collaboration</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-gray-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-gray-400">Notes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10hrs/week</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>

        {/* Product preview */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6 shadow-2xl">
              {/* Mock browser header */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 bg-gray-700/50 rounded-md px-3 py-1 ml-4">
                  <span className="text-gray-400 text-sm">ONAI Notes - AI-Powered Knowledge Management</span>
                </div>
              </div>
              
              {/* Mock interface */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 bg-gray-700/30 rounded-lg h-4"></div>
                </div>
                <div className="bg-gray-700/20 rounded-lg p-4 space-y-2">
                  <div className="bg-gray-600/30 rounded h-3 w-3/4"></div>
                  <div className="bg-gray-600/30 rounded h-3 w-1/2"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 bg-gray-700/30 rounded-lg h-4"></div>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

