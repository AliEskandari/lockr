import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import DashboardLayout from "../_layout";
import Layout from "./_layout";
import Form from "@/components/forms/social-unlocks/form";
import AuthUserContext from "@/contexts/auth-user";
import { useRouter } from "next/router";
import { Paths } from "@/modules/routes";
import db from "@/modules/db";
import Button from "@/components/buttons/button";
import { SocialUnlock } from "@/types/SocialUnlock";

export default function Create() {
  const authUser = useContext(AuthUserContext);
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [formState, setFormState] = useState<SocialUnlock | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const handleCreateClick = async () => {
    const socialUnlock = structuredClone(formState!);
    if (authUser) socialUnlock.user = { id: authUser.uid, subscription: null };
    socialUnlock.errors = null;
    const docRef = await db.SocialUnlock.create(socialUnlock);
    router.push(Paths.SocialUnlock.replace(":id", docRef.id));
  };

  useEffect(() => {
    scrollContainerRef.current = document.getElementById(
      "dashboard-layout-content"
    );
  }, []);

  return (
    <Form
      onValidation={(state: SocialUnlock) => {
        setIsValid(state.isValid);
        setFormState(state);
      }}
      scrollContainerRef={scrollContainerRef}
      className="max-w-md"
    >
      {/* Create */}
      <Button
        className="p-2 text-red-500 active:text-red-400 rounded-xl ml-auto font-semibold w-auto sm:w-auto disabled:text-gray-500 disabled:active:text-gray-400 disabled:cursor-pointer"
        onClick={handleCreateClick}
        disabled={!isValid}
      >
        Create
      </Button>
    </Form>
  );
}

Create.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <Layout>{page}</Layout>
    </DashboardLayout>
  );
};
