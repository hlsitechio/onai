import { Star, Quote, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { motion } from 'framer-motion'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: 'SC',
      content: 'ONAI has completely transformed how I organize my thoughts and manage projects. The AI suggestions are incredibly accurate and save me hours every week.',
      rating: 5,
      featured: true
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Research Scientist',
      company: 'BioLab Inc',
      avatar: 'MR',
      content: 'The real-time collaboration and advanced formatting make it perfect for our research team. We can work together seamlessly on complex documents.',
      rating: 5,
      featured: false
    },
    {
      name: 'Emily Watson',
      role: 'Content Creator',
      company: 'Independent',
      avatar: 'EW',
      content: 'Focus mode is a game-changer for my writing process. I can finally write without distractions and the AI helps me improve my content quality.',
      rating: 5,
      featured: false
    },
    {
      name: 'David Kim',
      role: 'Engineering Lead',
      company: 'StartupXYZ',
      avatar: 'DK',
      content: 'The security features give us peace of mind when handling sensitive information. End-to-end encryption with great usability is rare to find.',
      rating: 5,
      featured: true
    },
    {
      name: 'Lisa Thompson',
      role: 'Academic Researcher',
      company: 'University',
      avatar: 'LT',
      content: 'Template system and rich formatting make it perfect for academic writing. I can focus on research instead of formatting.',
      rating: 5,
      featured: false
    },
    {
      name: 'Alex Johnson',
      role: 'Startup Founder',
      company: 'InnovateCo',
      avatar: 'AJ',
      content: 'ONAI scales with our team perfectly. From solo brainstorming to team collaboration, it handles everything we throw at it.',
      rating: 5,
      featured: false
    }
  ]

  const stats = [
    { value: '98%', label: 'User Satisfaction' },
    { value: '50K+', label: 'Active Users' },
    { value: '2M+', label: 'Notes Created' },
    { value: '99.9%', label: 'Uptime' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Badge className="bg-gray-800/50 text-blue-400 border-blue-500/30 mb-4 backdrop-blur-sm">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Trusted by professionals
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            See what our users are saying about their experience with ONAI
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Featured testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.filter(t => t.featured).map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-gray-800/20 border-gray-700/30 backdrop-blur-sm hover:bg-gray-800/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <Quote className="h-8 w-8 text-blue-400 mb-4" />
                    
                    <blockquote className="text-gray-300 text-lg leading-relaxed mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All testimonials grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.filter(t => !t.featured).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gray-800/10 border-gray-700/20 backdrop-blur-sm hover:bg-gray-800/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-300 text-sm leading-relaxed mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gray-800/20 border border-gray-700/30 rounded-2xl p-8 sm:p-12 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join thousands of satisfied users
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience why professionals choose ONAI for their productivity needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3">
                View Live Demo
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

