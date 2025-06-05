import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Sparkles, Mail, Phone, MapPin, Send, MessageSquare, User } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle contact form submission
    console.log('Contact form submitted:', formData)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email anytime',
      value: 'hello@onlinenote.ai',
      action: 'mailto:hello@onlinenote.ai'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      action: '#'
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call us during business hours',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Header */}
      <header className="relative bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                  O
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ONAI
              </span>
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white sm:text-5xl mb-4">
              Get in touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about ONAI? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Let's start a conversation
                  </h2>
                  <p className="text-gray-400 leading-relaxed">
                    Whether you have questions about features, pricing, or need technical support, 
                    our team is here to help you succeed with ONAI.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <Card key={index} className="bg-gray-800/20 border-gray-700/30 hover:bg-gray-800/30 transition-colors duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                            <a 
                              href={item.action}
                              className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                              {item.value}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-6">
                  <h3 className="font-semibold text-white mb-3">Office Hours</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/20 border-gray-700/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Send us a message</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-300">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 resize-none"
                        placeholder="Tell us more about your question or how we can help..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                    >
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      We typically respond within 24 hours during business days.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Quick answers to common questions. Can't find what you're looking for? Contact us directly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold text-white mb-3">How do I get started with ONAI?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Simply sign up for a free account and start creating notes immediately. 
                  No credit card required for the 14-day trial.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Is my data secure?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes, we use end-to-end encryption and zero-knowledge architecture 
                  to ensure your data remains private and secure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Absolutely. You can cancel your subscription at any time with no 
                  cancellation fees or penalties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Do you offer team discounts?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Yes, we offer special pricing for teams and educational institutions. 
                  Contact our sales team for custom pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

