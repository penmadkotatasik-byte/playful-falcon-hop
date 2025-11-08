import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-gray-900">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-lg text-gray-700">
            Program ini dibuat oleh ERDE
          </p>
          
          <div className="space-y-4">
            <p className="text-md text-gray-600">Hubungi Admin:</p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="ghost">
                <a href="https://www.instagram.com/syam_fuadi/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="mr-2 h-5 w-5" />
                  Instagram
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href="https://www.youtube.com/@erdechannel3802" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-5 w-5" />
                  YouTube
                </a>
              </Button>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;