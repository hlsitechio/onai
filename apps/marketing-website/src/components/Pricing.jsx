import { useState } from 'react'
import { Check, X, Star, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      icon: Star,
      features: [
        '100 notes per month',
        '1 GB storage',
        'Basic AI suggestions',
        'Web access only',
        'Community support',
        'Basic templates'
      ],
      notIncluded: [
        'Advanced AI features',
        'Team collaboration',
        'Priority support',
        'Advanced formatting'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Best for individuals and professionals',
      price: { monthly: 19.99, yearly: 199.99 },
      icon: Zap,
      features: [
        'Unlimited notes',
        '100 GB storage',
        'Advanced AI suggestions',
        'All device access',
        'Priority support',
        'Premium templates',
        'Real-time collaboration',
        'Advanced formatting',
        'Export to PDF/Word',
        'Custom themes',
        'Focus mode',
        'Offline access'
      ],
      notIncluded: [],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default',
      popular: true
    },
    {
      name: 'Team',
      description: 'Perfect for growing teams',
      price: { monthly: 39.99, yearly: 399.99 },
      icon: Crown,
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Team management',
        'Advanced permissions',
        'Team analytics',
        'Custom integrations',
        'SSO authentication',
        'Admin dashboard',
        'Bulk operations',
        'API access'
      ],
      notIncluded: [],
      buttonText: 'Start Team Trial',
      buttonVariant: 'default',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the billing accordingly.'
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: 'Your data is always safe. If you exceed the limits of a lower plan, you\'ll have read-only access until you upgrade or reduce usage.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support if you\'re not satisfied with your subscription.'
    },
    {
      question: 'Is there a student discount?',
      answer: 'Yes! Students get 50% off Pro and Team plans. Contact support with your student ID for verification.'
    }
  ]

  return (
    <section id="pricing" className="relative py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-6">
            Simple, transparent pricing
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              that scales with you
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300 leading-relaxed">
            Choose the perfect plan for your needs. Start free, upgrade anytime, and cancel whenever you want.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-12">
          <span className={`text-sm font-medium mr-3 ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
          />
          <span className={`text-sm font-medium ml-3 ${isYearly ? 'text-white' : 'text-gray-400'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge className="ml-3 bg-green-500/20 text-green-400 border-green-500/30">
              Save 17%
            </Badge>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative bg-gray-800/30 backdrop-blur-sm border-gray-700/30 hover:bg-gray-800/40 transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl ${plan.name === 'Free' ? 'bg-gray-700/50' : plan.name === 'Pro' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white`}>
                    <plan.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                
                <div className="mt-6">
                  <div className="text-4xl font-bold text-white">
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                    {plan.price.monthly > 0 && (
                      <span className="text-lg font-normal text-gray-400">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <div className="text-sm text-gray-400 mt-1">
                      ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button 
                  className={`w-full py-3 font-semibold ${
                    plan.buttonVariant === 'default' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>

                <div>
                  <h4 className="font-semibold text-white mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.notIncluded.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-400 mb-4">Not included:</h4>
                    <ul className="space-y-3">
                      {plan.notIncluded.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <X className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
                <h4 className="font-semibold text-white mb-3">{faq.question}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Need something custom?</h3>
            <p className="text-gray-300 mb-6">
              Looking for enterprise features, custom integrations, or on-premise deployment? 
              Let's talk about building a solution that fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6">
                Schedule Demo
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

