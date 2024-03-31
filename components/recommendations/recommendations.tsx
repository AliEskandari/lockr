import { SocialUnlock } from "@/types";
import { trpc } from "@/modules/trpc/trpc";
import SocialUnlockCard from "../cards/social-unlock-card";

type RecommendationsProps = {
  socialUnlock: SocialUnlock;
};

export default function Recommendations({
  socialUnlock,
}: RecommendationsProps) {
  const query = trpc.socialUnlock.recommendations.useQuery(
    {
      id: socialUnlock.id,
    },
    { initialData: [] }
  );

  const socialUnlocks = query.data as SocialUnlock[];

  return (
    <>
      {socialUnlocks.slice(0, 10).map((socialUnlock) => (
        <SocialUnlockCard
          key={socialUnlock.id}
          className=""
          socialUnlock={socialUnlock}
        />
      ))}
    </>
  );
}
