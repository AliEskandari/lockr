import Form, {
  CollectionFormReducer,
} from "@/components/forms/collections/form";
import AuthUserContext from "@/contexts/auth-user";
import db from "@/modules/db";
import { Paths } from "@/modules/routes";
import { useRouter } from "next/router";
import { ReactNode, useContext, useState } from "react";
import DashboardLayout from "../_layout";
import Layout from "./_layout";

export default function Create() {
  const authUser = useContext(AuthUserContext);
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const [formState, setFormState] =
    useState<CollectionFormReducer.State | null>(null);

  const handleCreateClick = async () => {
    const populatedCollection = structuredClone(formState!);
    const collection = db.Collection.unpopulate(populatedCollection);
    delete collection.errors;
    collection.user = { id: authUser!.uid };
    const docRef = await db.Collection.create(collection);
    router.push(Paths.Collections.Show.replace(":id", docRef.id));
  };

  return (
    <>
      <Form
        onValidation={(state: CollectionFormReducer.State) => {
          setIsValid(state.isValid);
          setFormState(state);
        }}
        className="max-w-md"
      >
        {/* Create */}
        <button
          className="p-2 text-red-500 active:text-red-400 rounded-xl ml-auto font-semibold w-auto sm:w-auto disabled:text-gray-500 disabled:active:text-gray-400 disabled:cursor-pointer"
          onClick={handleCreateClick}
          disabled={!isValid}
        >
          Create
        </button>
      </Form>
    </>
  );
}

Create.getLayout = function getLayout(page: ReactNode) {
  return (
    <DashboardLayout>
      <Layout>{page}</Layout>
    </DashboardLayout>
  );
};
