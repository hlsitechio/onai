import { useState } from 'react'
import { CreditCard, TrendingUp, Calendar, DollarSign, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'

export default function PaymentDashboard() {
  const [subscriptionData] = useState({
    plan: 'Pro',
    status: 'active',
    nextBilling: '2025-02-15',
    amount: 19.99,
    currency: 'USD',
    billingCycle: 'monthly',
    daysUntilRenewal: 12,
    usage: {
      notes: 1247,
      notesLimit: 10000,
      storage: 2.3,
      storageLimit: 100,
      collaborators: 3,
      collaboratorsLimit: 10
    }
  })

  const [recentTransactions] = useState([
    {
      id: 'txn_001',
      date: '2025-01-15',
      description: 'Pro Plan - Monthly',
      amount: 19.99,
      status: 'completed',
      method: 'Visa •••• 4242'
    },
    {
      id: 'txn_002',
      date: '2024-12-15',
      description: 'Pro Plan - Monthly',
      amount: 19.99,
      status: 'completed',
      method: 'Visa •••• 4242'
    },
    {
      id: 'txn_003',
      date: '2024-11-15',
      description: 'Pro Plan - Monthly',
      amount: 19.99,
      status: 'completed',
      method: 'Visa •••• 4242'
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    }
    
    return (
      <Badge className={variants[status] || variants.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Payment Dashboard</h2>
        <p className="text-gray-600">Manage your subscription, billing, and payment methods</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionData.plan}</div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(subscriptionData.status)}
              <p className="text-xs text-muted-foreground">
                {subscriptionData.status === 'active' ? 'Active subscription' : 'Subscription inactive'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${subscriptionData.amount}
            </div>
            <p className="text-xs text-muted-foreground">
              Billed {subscriptionData.billingCycle}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptionData.daysUntilRenewal}</div>
            <p className="text-xs text-muted-foreground">
              days until {subscriptionData.nextBilling}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((subscriptionData.usage.notes / subscriptionData.usage.notesLimit) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              of notes limit used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscription Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Subscription Overview</span>
            </CardTitle>
            <CardDescription>
              Your current plan details and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{subscriptionData.plan} Plan</h3>
                <p className="text-sm text-gray-600">
                  ${subscriptionData.amount}/{subscriptionData.billingCycle}
                </p>
              </div>
              {getStatusBadge(subscriptionData.status)}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Notes Created</span>
                  <span>{subscriptionData.usage.notes.toLocaleString()} / {subscriptionData.usage.notesLimit.toLocaleString()}</span>
                </div>
                <Progress 
                  value={(subscriptionData.usage.notes / subscriptionData.usage.notesLimit) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Used</span>
                  <span>{subscriptionData.usage.storage} GB / {subscriptionData.usage.storageLimit} GB</span>
                </div>
                <Progress 
                  value={(subscriptionData.usage.storage / subscriptionData.usage.storageLimit) * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Team Members</span>
                  <span>{subscriptionData.usage.collaborators} / {subscriptionData.usage.collaboratorsLimit}</span>
                </div>
                <Progress 
                  value={(subscriptionData.usage.collaborators / subscriptionData.usage.collaboratorsLimit) * 100} 
                  className="h-2"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1">
                Upgrade Plan
              </Button>
              <Button variant="outline" className="flex-1">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>
              Your latest billing history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{transaction.description}</h4>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.method}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${transaction.amount}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-800">Upcoming Renewal</h3>
              <p className="text-sm text-orange-700 mt-1">
                Your {subscriptionData.plan} plan will renew on {subscriptionData.nextBilling} for ${subscriptionData.amount}. 
                Make sure your payment method is up to date.
              </p>
              <div className="mt-3 flex space-x-3">
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Update Payment Method
                </Button>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Change Plan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

