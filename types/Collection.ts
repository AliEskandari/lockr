import { DeepNonNullable } from "./DeepNonNullable";
import { SocialUnlock } from "./SocialUnlock";

type Error = {
  code: string;
};

export type CollectionSocialUnlock = {
  id: number;
  socialUnlock: string;
  title: string;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  status: "active" | "deleted";
  views: 0;
  createdAt?: string;
  isValid: boolean;
  collectionSocialUnlocks: { [index: number]: CollectionSocialUnlock };
  user: {
    id: string;
  };
  errors?: {
    title?: Error[];
    description?: Error[];
    collectionSocialUnlocks?: { [index: number]: Error[] };
  };
  deletedAt: string | null;
};

export interface PopulatedCollectionSocialUnlock
  extends Omit<CollectionSocialUnlock, "socialUnlock"> {
  socialUnlock: DeepNonNullable<SocialUnlock>;
}

export interface PopulatedCollection
  extends Omit<Collection, "collectionSocialUnlocks"> {
  collectionSocialUnlocks: { [index: number]: PopulatedCollectionSocialUnlock };
}
