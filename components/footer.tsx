import React from "react";
import Link from "next/link";
import { Paths } from "@/modules/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube";
import EnvelopeIcon from "@heroicons/react/24/solid/EnvelopeIcon";

export default function Footer() {
  return (
    <footer className="py-32">
      <nav className="flex flex-col space-y-8 md:space-y-0 items-center md:items-start md:flex-row container px-10 mx-auto justify-between text-center md:text-start">
        <div>
          <Link href={Paths.Home} className="font-semibold text-xl">
            lockr
          </Link>
        </div>
        <div>
          <h4 className="text-sm uppercase text-gray-500 mb-4">
            Social Unlocks
          </h4>
          <Link href={Paths.Home} className="block mb-2">
            Social unlocks
          </Link>
        </div>
        <div>
          <h4 className="text-sm uppercase text-gray-500 mb-4">Extra Tools</h4>
          <Link href={Paths.Home} className="block mb-2">
            Smart Links
          </Link>
          <Link href={Paths.Home} className="block mb-2">
            Social pages
          </Link>
          <Link href={Paths.Home} className="block mb-2">
            Email capturing
          </Link>
          <Link href={Paths.Home} className="block mb-2">
            QR code generator
          </Link>
        </div>
        <div>
          <h4 className="text-sm uppercase text-gray-500 mb-4">Company</h4>
          <Link href={Paths.Pricing} className="block mb-2">
            Pricing
          </Link>
          <Link href={Paths.Terms} className="block mb-2">
            Terms
          </Link>
          <Link href={Paths.Privacy} className="block mb-2">
            Privacy Policy
          </Link>
          <Link href={Paths.Cookies} className="block mb-2">
            Cookies Policy
          </Link>
        </div>
        <div className="flex space-x-2">
          <Link href={Paths.Twitter} className="inline-block">
            <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
          </Link>
          <Link href={Paths.Youtube} className="inline-block">
            <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
          </Link>
          <Link href={Paths.Mail} className="inline-block">
            <EnvelopeIcon className="w-6 h-6" />
          </Link>
        </div>
      </nav>
    </footer>
  );
}
