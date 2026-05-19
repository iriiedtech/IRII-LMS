import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">IRII</span>
            </Link>
            <p className="text-secondary-foreground/80 max-w-sm mb-6 leading-relaxed">
              <strong>Mission:</strong> To provide 100% industry-ready practical training and transform engineering students into highly skilled professionals. We are India's leading nationwide internship ecosystem eliminating the academia-industry gap.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Platform</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><Link href="/search/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li className="flex items-center gap-2 mt-4">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contact@irii.in" className="hover:text-primary transition-colors">contact@irii.in</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} IRII. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
