import Button from "@/components/buttons/button";
import Form from "@/components/forms/social-unlocks/form";
import SocialUnlock from "@/components/social-unlock/social-unlock";
import { Paths } from "@/modules/routes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import AuthUserContext from "@/contexts/auth-user";

export default function CreateFreeLock() {
  const authUser = useContext(AuthUserContext);
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [formState, setFormState] = useState();
  const scrollContainerRef = useRef();

  const handleCreateClick = async () => {
    const params = { ...formState, user: { id: authUser.uid } };
    delete params.errors;
    const docRef = await db.SocialUnlock.create({ params });
    router.push(Paths.SocialUnlock.replace(":id", docRef.id));
  };

  useEffect(() => {
    scrollContainerRef.current = document.getElementById("html");
  }, []);

  return (
    <>
      <Head>
        <title>Create Free Lock - Lockr</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full mx-auto flex md:flex-nowrap gap-x-6 p-4">
        <div className="w-full flex justify-center md:justify-end">
          <Form
            onValidation={({ isValid, state }) => {
              setIsValid(isValid);
              setFormState(state);
            }}
            scrollContainerRef={scrollContainerRef}
            className="max-w-md flex-1"
          >
            {/* Create */}
            <Button
              className="p-2 text-red-500 hover:text-red-600 active:text-red-700 rounded-xl ml-auto w-auto sm:w-auto disabled:active:text-gray-400 disabled:cursor-pointer text-2xl font-black"
              onClick={handleCreateClick}
              disabled={!isValid}
            >
              create
            </Button>
          </Form>
        </div>
        <div className="hidden md:flex w-full justify-center md:justify-start items-center">
          <SocialUnlock socialUnlock={formState} />
        </div>
      </div>
    </>
  );
}
