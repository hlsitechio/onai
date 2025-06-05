import { useState } from 'react'
import { Check, Star, Zap, Crown, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Switch } from '@/components/ui/switch.jsx'

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'yearly'
  const [currentPlan] = useState('Pro')

  const plans = [
    {
      name: 'Free',
      icon: Users,
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '100 notes per month',
        '1 GB storage',
        'Basic AI suggestions',
        'Web access only',
        'Community support',
        'Basic templates'
      ],
      limitations: [
        'Limited AI features',
        'No team collaboration',
        'No advanced formatting'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      popular: false,
      disabled: true
    },
    {
      name: 'Pro',
      icon: Zap,
      description: 'Best for individuals and small teams',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
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
        'Custom themes'
      ],
      limitations: [],
      buttonText: 'Current Plan',
      buttonVariant: 'default',
      popular: true,
      disabled: true,
      current: true
    },
    {
      name: 'Team',
      icon: Crown,
      description: 'Perfect for growing teams',
      monthlyPrice: 39.99,
      yearlyPrice: 399.99,
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
      limitations: [],
      buttonText: 'Upgrade to Team',
      buttonVariant: 'default',
      popular: false,
      disabled: false
    },
    {
      name: 'Enterprise',
      icon: Shield,
      description: 'For large organizations',
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      features: [
        'Everything in Team',
        'Unlimited everything',
        'Advanced security',
        'Compliance features',
        'Dedicated support',
        'Custom deployment',
        'SLA guarantee',
        'Training sessions',
        'Custom development',
        'White-label options'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      popular: false,
      disabled: false
    }
  ]

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free'
    
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice / 12
    return `$${price.toFixed(2)}`
  }

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null
    
    const monthlyTotal = plan.monthlyPrice * 12
    const savings = monthlyTotal - plan.yearlyPrice
    const percentage = Math.round((savings / monthlyTotal) * 100)
    
    return billingCycle === 'yearly' ? `Save ${percentage}%` : null
  }

  const handlePlanSelect = (planName) => {
    if (planName === 'Enterprise') {
      // Handle enterprise contact
      window.open('mailto:sales@onlinenote.ai?subject=Enterprise Plan Inquiry', '_blank')
    } else {
      // Handle plan upgrade/downgrade
      console.log(`Selecting plan: ${planName}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-gray-600">
          Upgrade or downgrade your subscription at any time
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge className="bg-green-100 text-green-800">
            Save up to 17%
          </Badge>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
        {plans.map((plan) => {
          const PlanIcon = plan.icon
          const savings = getSavings(plan)
          
          return (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''} ${plan.current ? 'border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <PlanIcon className={`h-6 w-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {getPrice(plan)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-sm text-gray-500 ml-1">
                        /{billingCycle === 'monthly' ? 'month' : 'month'}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <Badge variant="secondary" className="mt-2">
                      {savings}
                    </Badge>
                  )}
                  {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Billed annually (${plan.yearlyPrice})
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  variant={plan.buttonVariant}
                  disabled={plan.disabled}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-900">Features included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-3 border-t">
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Limitations:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="text-xs text-gray-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Can I change my plan anytime?</h4>
            <p className="text-sm text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
              and we'll prorate the billing accordingly.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">What happens to my data if I downgrade?</h4>
            <p className="text-sm text-gray-600">
              Your data is always safe. If you exceed the limits of a lower plan, 
              you'll have read-only access until you upgrade or reduce usage.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Do you offer refunds?</h4>
            <p className="text-sm text-gray-600">
              We offer a 30-day money-back guarantee for all paid plans. 
              Contact support if you're not satisfied with your subscription.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Is there a student discount?</h4>
            <p className="text-sm text-gray-600">
              Yes! Students get 50% off Pro and Team plans. 
              Contact support with your student ID for verification.
            </p>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Need a Custom Solution?</h3>
            <p className="text-blue-100 mb-6">
              Our Enterprise plan can be customized to meet your organization's specific needs.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary">
                Schedule Demo
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

