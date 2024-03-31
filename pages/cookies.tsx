import Head from "next/head";
import { ReactNode } from "react";
import Layout from "./_layout";

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookies Policy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container max-w-5xl mx-auto mt-10 mb-24 bg-gray-100 p-4">
        <h1 className="font-semibold text-3xl mb-4">Cookies Policy</h1>
        <div>
          <p className="mb-4">
            This is the Cookie Policy for Lockr, accessible from
            https://lockr.social
          </p>

          <h2 className="text-xl mb-4 font-semibold">What Are Cookies</h2>

          <p className="mb-4">
            As is common practice with almost all professional websites this
            site uses cookies, which are tiny files that are downloaded to your
            computer, to improve your experience. This page describes what
            information they gather, how we use it and why we sometimes need to
            store these cookies. We will also share how you can prevent these
            cookies from being stored however this may downgrade or 'break'
            certain elements of the sites functionality.
          </p>

          <h2 className="text-xl mb-4 font-semibold">How We Use Cookies</h2>

          <p className="mb-4">
            We use cookies for a variety of reasons detailed below.
            Unfortunately in most cases there are no industry standard options
            for disabling cookies without completely disabling the functionality
            and features they add to this site. It is recommended that you leave
            on all cookies if you are not sure whether you need them or not in
            case they are used to provide a service that you use.
          </p>

          <h2 className="text-xl mb-4 font-semibold">Disabling Cookies</h2>

          <p className="mb-4">
            You can prevent the setting of cookies by adjusting the settings on
            your browser (see your browser Help for how to do this). Be aware
            that disabling cookies will affect the functionality of this and
            many other websites that you visit. Disabling cookies will usually
            result in also disabling certain functionality and features of the
            this site. Therefore it is recommended that you do not disable
            cookies.
          </p>

          <h2 className="text-xl mb-4 font-semibold">The Cookies We Set</h2>

          <ul>
            <li>
              <p className="mb-4">Account related cookies</p>
              <p className="mb-4">
                If you create an account with us then we will use cookies for
                the management of the signup process and general administration.
                These cookies will usually be deleted when you log out however
                in some cases they may remain afterwards to remember your site
                preferences when logged out.
              </p>
            </li>
            <li>
              <p className="mb-4">Login related cookies</p>
              <p className="mb-4">
                We use cookies when you are logged in so that we can remember
                this fact. This prevents you from having to log in every single
                time you visit a new page. These cookies are typically removed
                or cleared when you log out to ensure that you can only access
                restricted features and areas when logged in.
              </p>
            </li>
            <li>
              <p className="mb-4">Email newsletters related cookies</p>
              <p className="mb-4">
                This site offers newsletter or email subscription services and
                cookies may be used to remember if you are already registered
                and whether to show certain notifications which might only be
                valid to subscribed/unsubscribed users.
              </p>
            </li>
            <li>
              <p className="mb-4">Forms related cookies</p>
              <p className="mb-4">
                When you submit data to through a form such as those found on
                contact pages or comment forms cookies may be set to remember
                your user details for future correspondence.
              </p>
            </li>
            <li>
              <p className="mb-4">Site preferences cookies</p>
              <p className="mb-4">
                In order to provide you with a great experience on this site we
                provide the functionality to set your preferences for how this
                site runs when you use it. In order to remember your preferences
                we need to set cookies so that this information can be called
                whenever you interact with a page is affected by your
                preferences.
              </p>
            </li>
          </ul>

          <h2 className="text-xl mb-4 font-semibold">Third Party Cookies</h2>

          <p className="mb-4">
            In some special cases we also use cookies provided by trusted third
            parties. The following section details which third party cookies you
            might encounter through this site.
          </p>
          <ul>
            <li>
              <p className="mb-4">
                This site uses Google Analytics which is one of the most
                widespread and trusted analytics solution on the web for helping
                us to understand how you use the site and ways that we can
                improve your experience. These cookies may track things such as
                how long you spend on the site and the pages that you visit so
                we can continue to produce engaging content.
              </p>
              <p className="mb-4">
                For more information on Google Analytics cookies, see the
                official Google Analytics page.
              </p>
            </li>
            <li>
              <p className="mb-4">
                The Google AdSense service we use to serve advertising uses a
                DoubleClick cookie to serve more relevant ads across the web and
                limit the number of times that a given ad is shown to you.
              </p>
              <p className="mb-4">
                For more information on Google AdSense see the official Google
                AdSense privacy FAQ.
              </p>
            </li>
            <li>
              <p className="mb-4">
                We also use social media buttons and/or plugins on this site
                that allow you to connect with your social network in various
                ways. For these to work the following social media sites
                including; YouTube, Instagram, Facebook, Twitter, Twitch,
                Spotify, Soundcloud, TikTok. will set cookies through our site
                which may be used to enhance your profile on their site or
                contribute to the data they hold for various purposes outlined
                in their respective privacy policies.
              </p>
            </li>
          </ul>

          <h2 className="text-xl mb-4 font-semibold">More Information</h2>

          <p className="mb-4">
            Hopefully that has clarified things for you and as was previously
            mentioned if there is something that you aren't sure whether you
            need or not it's usually safer to leave cookies enabled in case it
            does interact with one of the features you use on our site.
          </p>
          <p className="mb-4">
            However if you are still looking for more information then you can
            contact us through one of our preferred contact methods:
          </p>
          <ul>
            <li>Email: contact@lockr.social</li>
          </ul>
        </div>
      </div>
    </>
  );
}

Cookies.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
