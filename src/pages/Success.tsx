
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Give some time for the webhook to process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-white">
            {isLoading ? 'Processing...' : 'Welcome to Professional!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-400">
            {isLoading 
              ? 'We\'re setting up your subscription. This may take a few moments.'
              : 'Your subscription has been activated successfully. You now have access to unlimited AI requests and premium features!'
            }
          </p>
          
          {!isLoading && (
            <div className="space-y-3">
              <div className="text-sm text-gray-500 bg-white/5 p-3 rounded-lg">
                ✨ You now have access to 500 AI requests per day
                <br />
                🚀 Advanced AI features unlocked
                <br />
                💎 Priority support available
              </div>
              
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-noteflow-500 hover:bg-noteflow-600"
              >
                Start Creating Notes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
