import { classNames } from "@/modules/functions/css";
import {
  AnimationPlaybackControls,
  motion,
  useAnimate,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import tw from "@/modules/tailwind";

const words = [
  { title: "followers", backgroundColor: tw.colors.red["500"] },
  { title: "likes", backgroundColor: tw.colors.blue["500"] },
  { title: "views", backgroundColor: tw.colors.red["500"] },
  { title: "reposts", backgroundColor: tw.colors.purple["500"] },
  { title: "retweets", backgroundColor: tw.colors.blue["500"] },
  { title: "comments", backgroundColor: tw.colors.purple["500"] },
];

export default function AnimatedHero({ className }: { className?: string }) {
  const [scope, animate] = useAnimate();
  const [wordIndex, setWordIndex] = useState(0);
  const animation = useRef<AnimationPlaybackControls>();

  const runAnimation = async (color: string) => {
    const closedFrame = [
      scope.current,
      { height: "0px", paddingTop: 0, paddingBottom: 0 },
      { duration: 0.2, ease: "easeInOut", at: "+2.0" },
    ];

    const generateOpenFrame = (color: string) => [
      scope.current,
      {
        height:
          window.innerWidth < parseInt(tw.screens["md"]) ? "80px" : "95px",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: color,
      },
      { duration: 0.2, ease: "easeInOut" },
    ];

    const sequence = [generateOpenFrame(color), closedFrame];
    // @ts-ignore
    animation.current = animate(sequence);

    await animation.current;

    setWordIndex((wordIndex) => {
      if (wordIndex == words.length - 1) return 0;
      return wordIndex + 1;
    });
  };

  useEffect(() => {
    (async () => {
      await runAnimation(words[wordIndex].backgroundColor);
    })();
  }, [wordIndex]);

  // animate height, backgroundColor, padding, innerText
  return (
    <section
      className={classNames(className, "flex  justify-center md:text-start")}
    >
      <h1 className="font-semibold text-6xl md:text-7xl mb-4 flex flex-col md:flex-row justify-center h-80 lg:h-60 items-center bg-gray-100 dark:bg-gray-800 m-4 w-full md:w-auto md:px-20 py-8 md:py-16 rounded-xl gap-y-6 md:gap-y-0">
        <span className="inline-block">Get more&nbsp;</span>
        <motion.div
          ref={scope}
          initial={{ paddingTop: 10, paddingBottom: 10 }}
          className="rounded-xl px-6 md:px-8 text-white bg-red-500 leading-none overflow-hidden"
        >
          {words[wordIndex].title}
        </motion.div>
      </h1>
    </section>
  );
}
