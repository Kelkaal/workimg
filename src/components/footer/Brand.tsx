import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const SocialIcon = ({
  href,
  children,
  label,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
  >
    {children}
  </Link>
);

export default function FooterBrand() {
  return (
    <div className="col-span-2">
      <div className="flex items-center gap-2 mb-2">
        <Image
          src="/assets/logo.png"
          alt="Inventrix Logo"
          width={24}
          height={24}
          className="h-6 w-6 object-cover"
        />
        <span className="text-xl font-bold">Inventrix</span>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Smart inventory management made simple for modern businesses.
      </p>

      {/* Social Media Links */}
      <div className="flex gap-3">
        <SocialIcon href="https://facebook.com" label="Facebook">
          <Facebook className="h-5 w-5" />
        </SocialIcon>
        <SocialIcon href="https://twitter.com" label="Twitter">
          <Twitter className="h-5 w-5" />
        </SocialIcon>
        <SocialIcon href="https://linkedin.com" label="LinkedIn">
          <Linkedin className="h-5 w-5" />
        </SocialIcon>
        <SocialIcon href="https://instagram.com" label="Instagram">
          <Instagram className="h-5 w-5" />
        </SocialIcon>
      </div>
    </div>
  );
}
